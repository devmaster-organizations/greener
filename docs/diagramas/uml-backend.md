# UML do backend

Visão geral da estrutura do backend do GreenER, cobrindo os dois entrypoints
NestJS (API HTTP e Worker), as classes de domínio e integração, o modelo de
dados e o ciclo de coleta executado em background.

> Escopo: apenas o backend (`backend/`). O frontend e a infraestrutura do
> Docker Compose não fazem parte deste documento.

## 1. Componentes

O backend é composto por dois processos que compartilham o mesmo código e a
mesma camada de persistência:

- **API HTTP** (`src/main.ts`): cria o `AppModule`, habilita CORS e expõe a
  porta configurada. Serve o frontend com os endpoints de serviços, coletas,
  dashboard e autenticação.
- **Worker** (`src/worker/main.ts`): cria um contexto NestJS sem HTTP
  (`createApplicationContext`) com o `WorkerModule`, que registra o
  `MonitoramentoService` e o agendador.

O `AppModule` importa `ConfigModule`, `ObserveModule`, `AuthModule`,
`ServicosModule`, `ColetasModule` e `DashboardModule`. A descoberta de
serviços, a coleta e a persistência de métricas ficam no fluxo do Worker;
o backend apenas **lê** o que o Worker gravou.

```mermaid
flowchart LR
    subgraph HTTP["API HTTP — src/main.ts"]
        AM[AppModule]
        AC[AppController]
        AS[AppService]
        OBS[ObserveModule]
        CFG1[ConfigModule]
        SC[ServicosController]
        CC[ColetasController]
        DC[DashboardController]
        AUC[AuthController]
        AUS[AuthService]
        AM --> AC
        AC --> AS
        AM --> OBS
        AM --> CFG1
        AM --> SC
        AM --> CC
        AM --> DC
        AM --> AUC
        AUC --> AUS
    end

    subgraph WORKER["Worker — src/worker/main.ts"]
        WM[WorkerModule]
        SCH[ScheduleModule]
        MM[MonitoramentoModule]
        MS[MonitoramentoService]
        WM --> SCH
        WM --> MM
        MM --> MS
    end

    subgraph MODULES["Módulos de integração e persistência"]
        AGR[AgregadorModule]
        CAR[CarbonModule]
        SRV[ServicosModule]
        COL[ColetasModule]
        PRM[PrismaModule]
        AGC[AgregadorClient]
        CAC[CarbonClient]
        SRE[ServicosRepository]
        CRE[ColetasRepository]
        PRS[PrismaService]
        AGR --> AGC
        CAR --> CAC
        SRV --> SRE
        COL --> CRE
        PRM --> PRS
    end

    MM --> AGR
    MM --> CAR
    MM --> SRV
    MM --> COL
    SRE --> PRM
    CRE --> PRM

    AGC -->|"GET /services"| AGG[("Agregador de Métricas\nmetrics.unilaunch.org")]
    AGC -->|"GET /metrics/:id"| AGG
    CAC -->|"GET /regions/:code/carbon-intensity"| CARB[("API de Carbono\ncarbon.unilaunch.org")]
    PRS -->|"Prisma + adapter-pg"| DB[("PostgreSQL\nservicos / coletas")]

    CFG2[ConfigModule] -.-> AGR
    CFG2 -.-> CAR
    CFG2 -.-> PRM
```

### Responsabilidades dos componentes

| Componente | Responsabilidade |
|---|---|
| `AppModule` / `AppController` / `AppService` | API HTTP; `AppController` responde `GET /` com uma saudação. |
| `ServicosController` | `GET /servicos` e `GET /servicos/:id` (status, localização e última coleta). |
| `ColetasController` | `GET /coletas` com filtros `servicoId`, `de`, `ate` e `limit`. |
| `DashboardController` | `GET /dashboard/indicadores`, `/historico` e `/impacto-por-servico`. |
| `AuthController` / `AuthService` | `POST /auth/login` com JWT e verificação de senha via `bcryptjs`. |
| `WorkerModule` | Módulo raiz do processo de background, sem servidor HTTP. |
| `MonitoramentoService` | Orquestra descoberta, coleta, cálculos ambientais e persistência. |
| `AgregadorClient` | Consulta a lista de serviços e as métricas de cada serviço. |
| `CarbonClient` | Consulta a intensidade de carbono por região, com cache em memória. |
| `ServicosRepository` | Upsert dos serviços descobertos, atualização de status e remoção lógica. |
| `ColetasRepository` | Registro do histórico de coletas. |
| `PrismaService` | Conexão com o PostgreSQL via Prisma Client + `@prisma/adapter-pg`. |
| `ObserveModule` | Instrumentação e telemetria da API HTTP. |

---

## 2. Classes do backend

```mermaid
classDiagram
    direction LR

    class MonitoramentoService {
        -Logger logger
        -boolean emExecucao
        +onModuleInit() void
        +onModuleDestroy() void
        +executarCiclo() Promise~void~
        -executarCicloInterno() Promise~void~
        -coletarDoServico(servico) Promise~void~
        -registrarColetaAtiva(servico, resultado) Promise~void~
        -mapearServico(servico) SalvarServicoInput
    }

    class AgregadorClient {
        -string baseUrl
        -fetch http
        -number timeoutMs
        +listarServicos() Promise~ServicoDescoberto[]~
        +coletarMetricas(servicoId) Promise~ResultadoMetricas~
    }

    class CarbonClient {
        -Logger logger
        -string baseUrl
        -number timeoutMs
        -Map cache
        +obterIntensidade(regionCode) Promise~IntensidadeCarbono|null~
        -buscar(caminho) Promise~Response~
    }

    class ServicosRepository {
        -PrismaService prisma
        +salvar(servico) Promise~void~
        +listar() Promise~Servico[]~
        +atualizarStatus(id, status, ultimaColetaAt) Promise~void~
        +marcarRemovidosExceto(idsAtivos) Promise~number~
    }

    class ColetasRepository {
        -PrismaService prisma
        +registrar(coleta) Promise~void~
    }

    class PrismaService {
        +onModuleInit() Promise~void~
        +onModuleDestroy() Promise~void~
    }

    class PrismaClient {
        <<generated>>
    }

    class ServicoDescoberto {
        <<interface>>
        +string id
        +string nome
        +string regionCode
        +string pais
        +string regiao
        +string cidade
        +number latitude
        +number longitude
        +string metricsPath
    }

    class ResultadoMetricas {
        <<union>>
        ATIVO
        SEM_METRICAS
        INDISPONIVEL
    }

    class MetricasConsumo {
        <<interface>>
        +number cpuPercent
        +number memoryGb
        +number diskGb
        +number networkGb
    }

    class IntensidadeCarbono {
        <<interface>>
        +string regionCode
        +number carbonIntensityGco2ePorKwh
        +number|null renewableSharePercent
    }

    class SalvarServicoInput {
        <<interface>>
        +string id
        +string nome
        +string regionCode
        +string metricsPath
        +string|null pais
        +string|null regiao
        +string|null cidade
        +number|null latitude
        +number|null longitude
    }

    class RegistrarColetaInput {
        <<interface>>
        +string servicoId
        +Date coletadaAt
        +StatusColeta status
        +number|null cpuPercent
        +number|null memoryGb
        +number|null diskGb
        +number|null networkGb
        +number|null potenciaW
        +number|null energiaKwh
        +number|null carbonIntensity
        +number|null co2eG
        +string|null erro
    }

    class StatusServico {
        <<enumeration>>
        ATIVO
        INDISPONIVEL
        SEM_METRICAS
        REMOVIDO
    }

    class StatusColeta {
        <<enumeration>>
        ATIVO
        INDISPONIVEL
        SEM_METRICAS
    }

    MonitoramentoService --> AgregadorClient : usa
    MonitoramentoService --> CarbonClient : usa
    MonitoramentoService --> ServicosRepository : usa
    MonitoramentoService --> ColetasRepository : usa
    MonitoramentoService ..> ServicoDescoberto : produz/consome
    MonitoramentoService ..> ResultadoMetricas : consome
    MonitoramentoService ..> SalvarServicoInput : monta
    MonitoramentoService ..> RegistrarColetaInput : monta
    MonitoramentoService ..> StatusServico : usa
    MonitoramentoService ..> StatusColeta : usa

    AgregadorClient ..> ServicoDescoberto : retorna
    AgregadorClient ..> ResultadoMetricas : retorna
    AgregadorClient ..> MetricasConsumo : compõe
    CarbonClient ..> IntensidadeCarbono : retorna

    ServicosRepository --> PrismaService : injeta
    ColetasRepository --> PrismaService : injeta
    PrismaService --|> PrismaClient : estende

    ServicosRepository ..> SalvarServicoInput : consome
    ServicosRepository ..> StatusServico : usa
    ColetasRepository ..> RegistrarColetaInput : consome
    ColetasRepository ..> StatusColeta : usa
```

### Funções puras de domínio

O módulo `src/dominio/calculo-ambiental.ts` concentra as estimativas e não
possui I/O, o que permite testá-las isoladamente.

```mermaid
classDiagram
    class calculo_ambiental {
        <<module>>
        +POTENCIA_MAXIMA_CPU_W = 100
        +FATOR_MEMORIA_W_POR_GB = 0.375
        +FATOR_DISCO_W_POR_GB = 0.01
        +FATOR_REDE_W_POR_GB = 0.02
        +estimarPotenciaWatts(metricas) number
        +estimarEnergiaKwh(potenciaW, intervaloSegundos) number
        +estimarCo2eGramas(energiaKwh, intensidade) number
    }

    class MetricasConsumo {
        <<interface>>
        +number cpuPercent
        +number memoryGb
        +number diskGb
        +number networkGb
    }

    calculo_ambiental ..> MetricasConsumo : usa
```

Regras aplicadas:

| Função | Fórmula |
|---|---|
| `estimarPotenciaWatts` | `(cpuPercent / 100) * 100 + memoryGb * 0.375 + diskGb * 0.01 + networkGb * 0.02` |
| `estimarEnergiaKwh` | `potenciaW * intervaloSegundos / 3600 / 1000` |
| `estimarCo2eGramas` | `energiaKwh * intensidadeCarbonoGco2ePorKwh` |

---

## 3. Modelo de dados (ER)

```mermaid
erDiagram
    SERVICO ||--o{ COLETA : "possui"

    SERVICO {
        string id PK "varchar(100)"
        string nome "varchar(150)"
        string region_code "varchar(50)"
        string pais "varchar(100), nullable"
        string regiao "varchar(100), nullable"
        string cidade "varchar(100), nullable"
        decimal latitude "numeric(10,7), nullable"
        decimal longitude "numeric(10,7), nullable"
        string metrics_path "varchar(255)"
        string status "varchar(30), default ATIVO"
        timestamptz ultima_coleta_at "nullable"
        timestamptz created_at "default now()"
        timestamptz updated_at "atualizado pelo Prisma"
    }

    COLETA {
        string id PK "uuid, default uuid()"
        string servico_id FK "varchar(100)"
        timestamptz coletada_at
        decimal cpu_percent "numeric(5,2), nullable"
        decimal memory_gb "numeric(10,3), nullable"
        decimal disk_gb "numeric(10,3), nullable"
        decimal network_gb "numeric(10,3), nullable"
        decimal potencia_w "numeric(12,4), nullable"
        decimal energia_kwh "numeric(18,10), nullable"
        decimal carbon_intensity "numeric(10,3), nullable"
        decimal co2e_g "numeric(18,10), nullable"
        string status "varchar(30)"
        text erro "nullable"
        timestamptz created_at "default now()"
    }
```

Observações do schema (`prisma/schema.prisma`):

- Tabelas mapeadas como `servicos` e `coletas`.
- Relação `Servico 1:N Coleta` com `onDelete: Cascade`.
- Índice composto `@@index([servicoId, coletadaAt])` em `Coleta`.
- `status` é armazenado como texto; os valores válidos vêm dos enums
  `StatusServico` e `StatusColeta` no domínio.

---

## 4. Sequência do ciclo de coleta

O `MonitoramentoService` registra um intervalo no `SchedulerRegistry` e
executa um ciclo imediatamente na inicialização. A flag `emExecucao` impede
que dois ciclos se sobreponham.

```mermaid
sequenceDiagram
    autonumber
    participant S as Scheduler
    participant M as MonitoramentoService
    participant A as AgregadorClient
    participant C as CarbonClient
    participant SR as ServicosRepository
    participant CR as ColetasRepository
    participant DB as PostgreSQL
    participant AG as Agregador de Métricas
    participant CA as API de Carbono

    Note over M: onModuleInit()
    M->>S: addInterval("coleta-metricas", timer)
    M->>M: executarCiclo()

    loop A cada COLETA_INTERVALO_MS (padrão 30 s)
        S->>M: executarCiclo()
        alt emExecucao = true
            M-->>S: ignora disparo (warn)
        else ciclo livre
            M->>M: emExecucao = true
            M->>A: listarServicos()
            A->>AG: GET /services
            AG-->>A: lista de serviços

            alt Agregador indisponível
                M->>M: log de erro e encerra o ciclo
            else lista recebida
                loop Para cada serviço descoberto
                    M->>SR: salvar(mapearServico(servico))
                    SR->>DB: upsert em servicos (status ATIVO)
                end

                loop Para cada serviço descoberto
                    M->>A: coletarMetricas(servico.id)
                    A->>AG: GET /metrics/:id

                    alt HTTP 200 — ATIVO
                        AG-->>A: métricas e collection_interval_seconds
                        M->>M: estimarPotenciaWatts(métricas)
                        M->>M: estimarEnergiaKwh(potência, intervalo)
                        opt regionCode presente
                            M->>C: obterIntensidade(regionCode)
                            alt cache hit
                                C-->>M: intensidade em cache
                            else cache miss
                                C->>CA: GET /regions/:code/carbon-intensity
                                alt sucesso
                                    CA-->>C: intensidade
                                    C->>C: armazena no cache
                                    C-->>M: intensidade
                                else falha ou região inexistente
                                    C-->>M: null
                                end
                            end
                            M->>M: estimarCo2eGramas(energia, intensidade)
                        end
                        M->>CR: registrar(coleta ATIVO)
                        CR->>DB: insert em coletas
                        M->>SR: atualizarStatus(servico, ATIVO)
                        SR->>DB: update em servicos
                    else HTTP 404 — SEM_METRICAS
                        AG-->>A: 404
                        M->>CR: registrar(coleta SEM_METRICAS)
                        CR->>DB: insert em coletas
                        M->>SR: atualizarStatus(servico, SEM_METRICAS)
                        SR->>DB: update em servicos
                    else HTTP 500, erro de rede ou timeout — INDISPONIVEL
                        AG-->>A: erro
                        M->>CR: registrar(coleta INDISPONIVEL)
                        CR->>DB: insert em coletas
                        M->>SR: atualizarStatus(servico, INDISPONIVEL)
                        SR->>DB: update em servicos
                    end
                end

                M->>SR: marcarRemovidosExceto(ids descobertos)
                SR->>DB: updateMany status = REMOVIDO
                opt removidos > 0
                    M->>M: log de aviso
                end
            end

            M->>M: emExecucao = false
        end
    end

    Note over M: onModuleDestroy()
    M->>S: deleteInterval("coleta-metricas")
```

### Tratamento de erros e estados

| Situação | Coleta registrada | Status do serviço |
|---|---|---|
| Métricas obtidas (HTTP 200) | `ATIVO` com métricas, potência, energia e CO₂e | `ATIVO` |
| Serviço sem métricas (HTTP 404) | `SEM_METRICAS` | `SEM_METRICAS` |
| HTTP 500, erro de rede ou timeout | `INDISPONIVEL` | `INDISPONIVEL` |
| Serviço ausente na descoberta | Histórico preservado | `REMOVIDO` |
| Erro ao processar um serviço | — | O ciclo continua para os demais |
| Falha ao listar serviços | Nenhuma alteração no ciclo | — |

### Configuração relevante

| Variável | Uso |
|---|---|
| `COLETA_INTERVALO_MS` | Intervalo entre ciclos; padrão de 30 000 ms. |
| `AGREGADOR_BASE_URL` | Endereço base do Agregador de Métricas. |
| `AGREGADOR_TIMEOUT_MS` | Timeout das chamadas externas; padrão de 5 000 ms. |
| `CARBON_BASE_URL` | Endereço base da API de Carbono. |
| `DATABASE_URL` | Conexão do Prisma com o PostgreSQL. |
