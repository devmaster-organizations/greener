# Worker do GreenER

Serviço de background responsável por **descobrir serviços, coletar métricas,
persistir o histórico e manter os estados atualizados**, de forma contínua e sem
intervenção manual.

O Worker roda em um **container dedicado**, separado do backend e do frontend, e
**não expõe servidor HTTP**.

## Visão geral

O Worker é um segundo entrypoint do projeto `backend/`, criado com
`NestFactory.createApplicationContext()` — um app NestJS **sem HTTP**, que
reaproveita o `PrismaService` e os módulos de domínio já existentes.

> O Worker não é um servidor e não é acessado de fora. Ele apenas executa ciclos
> de coleta e grava os resultados no banco de dados.

## Responsabilidades

A cada ciclo, o Worker:

1. **Descobre** os serviços disponíveis.
2. **Coleta** as métricas de cada serviço.
3. **Trata falhas** de cada serviço individualmente.
4. **Persiste** cada coleta no histórico.
5. **Reclassifica** o estado de cada serviço.
6. **Não interrompe** o processo quando uma API auxiliar ou um serviço falhar.

### Estados de um serviço

| Estado | Significado |
|---|---|
| `ATIVO` | Listado e retornando métricas (HTTP 200). |
| `INDISPONIVEL` | Listado, mas a coleta falhou (HTTP 500) ou houve falha de rede. |
| `SEM_METRICAS` | Listado, porém sem métricas disponíveis (HTTP 404). |
| `REMOVIDO` | Deixou de aparecer na listagem do agregador. |

## Arquitetura

Quatro containers: **frontend, backend, worker e postgres**.

```
                    ┌───────────────────────────────────────────┐
                    │            metrics.unilaunch.org           │
                    │            carbon.unilaunch.org            │
                    └───────────────▲───────────────▲───────────┘
                                    │ HTTP          │ HTTP
                    ┌───────────────┴───────────────┴───────────┐
                    │                  WORKER                     │
                    │      (NestJS standalone — sem HTTP)         │
                    └───────────────────┬─────────────────────────┘
                                        │ SQL (Prisma)
                    ┌───────────────────▼─────────────────────────┐
                    │               POSTGRESQL                     │
                    │        tabelas: servicos, coletas            │
                    └───────────────────▲─────────────────────────┘
                                        │ SQL (Prisma)
                    ┌───────────────────┴─────────────────────────┐
                    │             BACKEND (NestJS HTTP)            │
                    └───────────────────▲─────────────────────────┘
                                        │ HTTP (REST)
                    ┌───────────────────┴─────────────────────────┐
                    │             FRONTEND (Next.js / React)       │
                    └──────────────────────────────────────────────┘
```

Backend e Worker compartilham **a mesma imagem** Docker, com `command` diferente:

- `backend` → `node dist/main.js`
- `worker` → `node dist/worker/main.js`

## Como executar

### Via Docker Compose

Na raiz do repositório:

```bash
docker compose up -d --build
docker compose logs -f worker
```

Isso sobe o PostgreSQL, aplica as migrations e inicia o backend e o Worker.

### Localmente (sem container)

Com o PostgreSQL iniciado e as migrations aplicadas, na pasta `backend`:

```bash
npm run start:worker   # produção (dist/worker/main.js)
# ou
npm run worker:dev     # desenvolvimento (watch)
```

## Configuração

| Variável | Descrição | Padrão |
|---|---|---|
| `DATABASE_URL` | Conexão com o PostgreSQL (compartilhada com o backend). | — |
| `AGREGADOR_BASE_URL` | URL do Agregador de Métricas. | `https://metrics.unilaunch.org` |
| `AGREGADOR_TIMEOUT_MS` | Timeout das requisições às APIs externas. | `5000` |
| `CARBON_BASE_URL` | URL da API de Intensidade de Carbono. | `https://carbon.unilaunch.org` |
| `COLETA_INTERVALO_MS` | Intervalo entre os ciclos de coleta, em ms. | `30000` |

## APIs consumidas

Somente o Worker acessa as APIs auxiliares; o backend e o frontend nunca o fazem.

### Agregador de Métricas — `https://metrics.unilaunch.org`

| Rota | Uso |
|---|---|
| `GET /services` | Descobrir os serviços disponíveis e suas localizações. |
| `GET /metrics/{service_id}` | Coletar as métricas de um serviço. |

Resposta de `/metrics/{id}`:
`{ collection_interval_seconds, metrics { cpu_percent, memory_gb, disk_gb, network_gb } }`.

Tratamento dos códigos:

- **200** → métricas coletadas → `ATIVO`
- **404** → sem métricas → `SEM_METRICAS`
- **500** → indisponível → `INDISPONIVEL`

### Carbon Intensity — `https://carbon.unilaunch.org`

| Rota | Uso |
|---|---|
| `GET /regions/{code}/carbon-intensity` | Obter o fator `gCO2e/kWh` da região. |

A intensidade é praticamente estática por região e é **cacheada em memória**.

### Fórmulas

```
potencia_W  = (cpu_percent / 100) * 100
            + memory_gb * 0.375
            + disk_gb   * 0.01
            + network_gb * 0.02

energia_kWh = potencia_W * (intervalo_segundos / 3600) / 1000

CO2e_g      = energia_kWh * carbon_intensity_gco2e_per_kwh
```

## Conexões com o restante do projeto

O Worker se integra por **três vias**, sem HTTP com o backend.

1. **PostgreSQL (principal)** — o Worker **escreve** (`servicos`, `coletas`); o
   backend **lê**. Ambos usam a mesma `DATABASE_URL` e o mesmo `PrismaService`.
2. **Backend ↔ Frontend** — o Worker não participa; ele não expõe porta HTTP.
3. **Código compartilhado** — o Worker reutiliza módulos do `backend/`.

Os únicos pontos de acoplamento são o **schema do banco** e o **módulo de domínio**.

## Modelo de dados

```prisma
model Servico {
  // ...campos atuais...
  coletas Coleta[]
}

model Coleta {
  id              String   @id @default(uuid())
  servicoId       String   @map("servico_id") @db.VarChar(100)
  servico         Servico  @relation(fields: [servicoId], references: [id])
  coletadaAt      DateTime @map("coletada_at") @db.Timestamptz(3)
  cpuPercent      Decimal? @map("cpu_percent") @db.Decimal(5, 2)
  memoryGb        Decimal? @map("memory_gb") @db.Decimal(10, 3)
  diskGb          Decimal? @map("disk_gb") @db.Decimal(10, 3)
  networkGb       Decimal? @map("network_gb") @db.Decimal(10, 3)
  potenciaW       Decimal? @map("potencia_w") @db.Decimal(12, 4)
  energiaKwh      Decimal? @map("energia_kwh") @db.Decimal(18, 10)
  carbonIntensity Decimal? @map("carbon_intensity") @db.Decimal(10, 3)
  co2eG           Decimal? @map("co2e_g") @db.Decimal(18, 10)
  status          String   @db.VarChar(30)  // ATIVO | SEM_METRICAS | INDISPONIVEL
  erro            String?  @db.Text
  createdAt       DateTime @default(now()) @map("created_at") @db.Timestamptz(3)

  @@index([servicoId, coletadaAt])
  @@map("coletas")
}
```

A coluna `status` de `Servico` admite:
`ATIVO | INDISPONIVEL | SEM_METRICAS | REMOVIDO`.

## Estrutura dos arquivos

```
backend/src/
  agregador/
    agregador.types.ts       # tipos das respostas do Agregador
    agregador.client.ts      # fetch /services e /metrics/{id}; mapeia 404/500
    agregador.module.ts
  carbon/
    carbon.types.ts          # tipos das respostas da Carbon API
    carbon.client.ts         # intensidade por região (com cache)
    carbon.module.ts
  coletas/
    coletas.repository.ts    # insere Coleta (histórico)
    coletas.module.ts
  dominio/
    calculo-ambiental.ts     # potência, energia e CO2e (funções puras)
    status-servico.ts        # constantes de estado
  monitoramento/
    monitoramento.service.ts # orquestra o ciclo de coleta
    monitoramento.module.ts
  worker/
    worker.module.ts         # módulo raiz do Worker
    main.ts                  # createApplicationContext(WorkerModule)
```

## Fluxo de um ciclo (`executarCiclo`)

1. `servicos = GET /services`.
   - Se o agregador falhar por completo → registra log e encerra o ciclo **sem
     derrubar o processo** (RNF05).
2. Para cada serviço: `ServicosRepository.salvar(...)` (upsert), reativando o status
   e atualizando a localização.
3. Para cada serviço: `GET /metrics/{id}`:
   - **200** → grava `Coleta` com status `ATIVO` + métricas; atualiza
     `ultimaColetaAt` e `status = ATIVO`.
   - **500** → grava `Coleta` com status `INDISPONIVEL`; `status = INDISPONIVEL`.
   - **404** → grava `Coleta` com status `SEM_METRICAS`; `status = SEM_METRICAS`.
   - Cada chamada em `try/catch` individual (um erro não interrompe os demais).
4. Serviços no banco que **não** vieram em `/services` → `status = REMOVIDO`,
   **preservando o histórico**.

### Agendamento

- `ScheduleModule.forRoot()` no `WorkerModule`.
- Intervalo registrado via `SchedulerRegistry` conforme `COLETA_INTERVALO_MS`.
- Flag de controle (`emExecucao`) para evitar sobreposição de ciclos.

## Testes

- `dominio/calculo-ambiental.spec.ts` — potência, energia e CO₂e (inclui dados ausentes).
- `agregador/agregador.client.spec.ts` — mock de `fetch` cobrindo **200 / 404 / 500** e falha de rede.
- `monitoramento/monitoramento.service.spec.ts` — gravação de `Coleta`, reclassificação
  de estado e não sobreposição de ciclos.

## Requisitos atendidos

| Requisito | Descrição | Como o Worker atende |
|---|---|---|
| RF01 | Descoberta de serviços | `GET /services` a cada ciclo |
| RF02 | Monitoramento dinâmico | Reclassificação de status (entrada, remoção, retorno) |
| RF03 | Coleta periódica | `GET /metrics/{id}` no intervalo configurado |
| RF04 | Variação das métricas | Grava uma `Coleta` por ciclo/serviço |
| RF05 | Detecção de indisponibilidade | Tratamento do HTTP 500 |
| RF06 | Detecção de ausência de métricas | Tratamento do HTTP 404 |
| RF07 | Cálculo de energia e CO2e | Módulo de domínio (`dominio/`) |
| RF10 | Histórico de coletas | Tabela `coletas` |
| RF11 | Atualização contínua | Ciclos periódicos |
| RNF03 | Atualização periódica | `COLETA_INTERVALO_MS` |
| RNF05 | Tolerância a falhas | Container isolado + `try/catch` por serviço |
| RNF07 | Testes das regras | Testes do domínio e do cliente HTTP |
| RP05 | Execução containerizada | Container `worker` no Compose |

## Conclusão

O Worker é o **motor do monitoramento**: um serviço de background, isolado em seu
próprio container, que descobre serviços, coleta métricas, trata falhas, calcula
indicadores ambientais e persiste o histórico — mantendo o dashboard atualizado
continuamente. Ele se integra ao sistema **pelo banco PostgreSQL** (escreve o que o
backend lê), **por código de domínio compartilhado** e pelo **consumo isolado das
APIs externas**, sem comunicação HTTP com o backend.
