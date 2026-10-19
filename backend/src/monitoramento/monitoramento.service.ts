import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AgregadorClient } from '../agregador/agregador.client.js';
import type {
  ResultadoMetricas,
  ServicoDescoberto,
} from '../agregador/agregador.client.js';
import { CarbonClient } from '../carbon/carbon.client.js';
import { ColetasRepository } from '../coletas/coletas.repository.js';
import {
  estimarCo2eGramas,
  estimarEnergiaKwh,
  estimarPotenciaWatts,
} from '../dominio/calculo-ambiental.js';
import { StatusColeta, StatusServico } from '../dominio/status-servico.js';
import { ServicosRepository } from '../servicos/servicos.repository.js';
import type { SalvarServicoInput } from '../servicos/servicos.repository.js';

type ResultadoAtivo = Extract<ResultadoMetricas, { estado: 'ATIVO' }>;

const NOME_INTERVALO = 'coleta-metricas';
const INTERVALO_PADRAO_MS = 30_000;
const INTERVALO_FALLBACK_SEGUNDOS = 60;

/**
 * Orquestra o trabalho de background do GreenER: descobre os serviços,
 * coleta métricas, calcula energia e CO2e, persiste o histórico e mantém
 * o estado de cada serviço atualizado.
 */
@Injectable()
export class MonitoramentoService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MonitoramentoService.name);
  private emExecucao = false;

  constructor(
    @Inject(ConfigService) private readonly config: ConfigService,
    @Inject(AgregadorClient) private readonly agregador: AgregadorClient,
    @Inject(CarbonClient) private readonly carbon: CarbonClient,
    @Inject(ServicosRepository) private readonly servicos: ServicosRepository,
    @Inject(ColetasRepository) private readonly coletas: ColetasRepository,
    @Inject(SchedulerRegistry) private readonly scheduler: SchedulerRegistry,
  ) {}

  onModuleInit(): void {
    const intervaloMs = Number(
      this.config.get('COLETA_INTERVALO_MS') ?? INTERVALO_PADRAO_MS,
    );

    const timer = setInterval(() => {
      void this.executarCiclo();
    }, intervaloMs);

    this.scheduler.addInterval(NOME_INTERVALO, timer);
    this.logger.log(`Worker iniciado — coleta a cada ${intervaloMs} ms`);

    void this.executarCiclo();
  }

  onModuleDestroy(): void {
    if (this.scheduler.doesExist('interval', NOME_INTERVALO)) {
      this.scheduler.deleteInterval(NOME_INTERVALO);
    }
  }

  /**
   * Executa um ciclo completo de coleta, protegido contra sobreposição e
   * contra falhas que possam derrubar o processo.
   */
  async executarCiclo(): Promise<void> {
    if (this.emExecucao) {
      this.logger.warn('Ciclo anterior ainda em execução; disparo ignorado.');
      return;
    }

    this.emExecucao = true;
    try {
      await this.executarCicloInterno();
    } catch (erro) {
      this.logger.error(`Falha no ciclo de coleta: ${String(erro)}`);
    } finally {
      this.emExecucao = false;
    }
  }

  private async executarCicloInterno(): Promise<void> {
    let descobertos: ServicoDescoberto[];

    try {
      descobertos = await this.agregador.listarServicos();
    } catch (erro) {
      this.logger.error(
        `Agregador indisponível; ciclo encerrado sem alterações: ${String(erro)}`,
      );
      return;
    }

    for (const servico of descobertos) {
      await this.servicos.salvar(this.mapearServico(servico));
    }

    for (const servico of descobertos) {
      await this.coletarDoServico(servico);
    }

    const removidos = await this.servicos.marcarRemovidosExceto(
      descobertos.map((servico) => servico.id),
    );

    if (removidos > 0) {
      this.logger.warn(`${removidos} serviço(s) marcado(s) como REMOVIDO.`);
    }
  }

  private async coletarDoServico(servico: ServicoDescoberto): Promise<void> {
    try {
      const resultado = await this.agregador.coletarMetricas(servico.id);
      const agora = new Date();

      if (resultado.estado === 'SEM_METRICAS') {
        await this.coletas.registrar({
          servicoId: servico.id,
          coletadaAt: agora,
          status: StatusColeta.SemMetricas,
        });
        await this.servicos.atualizarStatus(
          servico.id,
          StatusServico.SemMetricas,
          agora,
        );
        return;
      }

      if (resultado.estado === 'INDISPONIVEL') {
        await this.coletas.registrar({
          servicoId: servico.id,
          coletadaAt: agora,
          status: StatusColeta.Indisponivel,
        });
        await this.servicos.atualizarStatus(
          servico.id,
          StatusServico.Indisponivel,
          agora,
        );
        return;
      }

      await this.registrarColetaAtiva(servico, resultado);
    } catch (erro) {
      this.logger.error(
        `Erro ao processar o serviço "${servico.id}": ${String(erro)}`,
      );
    }
  }

  private async registrarColetaAtiva(
    servico: ServicoDescoberto,
    resultado: ResultadoAtivo,
  ): Promise<void> {
    const { metricas, intervaloColetaSegundos } = resultado;

    const potenciaW = estimarPotenciaWatts(metricas);
    const intervalo =
      intervaloColetaSegundos > 0
        ? intervaloColetaSegundos
        : INTERVALO_FALLBACK_SEGUNDOS;
    const energiaKwh = estimarEnergiaKwh(potenciaW, intervalo);

    let carbonIntensity: number | null = null;
    let co2eG: number | null = null;

    const regionCode = servico.regionCode;
    if (regionCode) {
      const intensidade = await this.carbon.obterIntensidade(regionCode);
      if (intensidade) {
        carbonIntensity = intensidade.carbonIntensityGco2ePorKwh;
        co2eG = estimarCo2eGramas(energiaKwh, carbonIntensity);
      }
    }

    const agora = new Date();

    await this.coletas.registrar({
      servicoId: servico.id,
      coletadaAt: agora,
      status: StatusColeta.Ativo,
      cpuPercent: metricas.cpuPercent,
      memoryGb: metricas.memoryGb,
      diskGb: metricas.diskGb,
      networkGb: metricas.networkGb,
      potenciaW,
      energiaKwh,
      carbonIntensity,
      co2eG,
    });

    await this.servicos.atualizarStatus(
      servico.id,
      StatusServico.Ativo,
      agora,
    );
  }

  private mapearServico(servico: ServicoDescoberto): SalvarServicoInput {
    return {
      id: servico.id,
      nome: servico.nome,
      regionCode: servico.regionCode,
      metricsPath: servico.metricsPath,
      pais: servico.pais,
      regiao: servico.regiao,
      cidade: servico.cidade,
      latitude: servico.latitude,
      longitude: servico.longitude,
    };
  }
}
