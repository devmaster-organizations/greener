# GreenER — Backend

API desenvolvida com NestJS, TypeScript, Prisma e PostgreSQL.

## Pré-requisitos

- Node.js e npm compatíveis com as versões utilizadas no projeto.
- Docker com Docker Compose.

## Instalação

Na pasta `backend`, instale as dependências:

```bash
npm ci
```

## Configuração

Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

Configure as variáveis:

```dotenv
PORT=3001
DATABASE_URL="postgresql://greener:greener_dev@localhost:5434/greener?schema=public"
```

A porta e as credenciais devem corresponder ao `compose.yaml`.
Esses valores são destinados ao desenvolvimento local.

## Banco de dados

Na raiz do repositório, inicie o PostgreSQL:

```bash
docker compose up -d postgres
docker compose ps
```

Na pasta `backend`, aplique as migrations e gere o Prisma Client:

```bash
npx prisma migrate dev
npx prisma generate
```

As migrations são versionadas. O Prisma Client é gerado localmente.

## Execução em desenvolvimento

Na pasta `backend`:

```bash
npm run start:dev
```

A aplicação estará disponível em:

http://localhost:3001

## Build e execução do código compilado

```bash
npm run build
node dist/main.js
```

## Teste de integração do Prisma

Com o PostgreSQL iniciado, crie o banco de testes uma única vez.
Execute na raiz do repositório:

```bash
docker compose exec postgres psql -U greener -d greener -c "CREATE DATABASE greener_test;"
```

Se o banco já existir, não repita esse comando.

Crie `backend/.env.test`:

```dotenv
DATABASE_URL_TEST="postgresql://greener:greener_dev@localhost:5434/greener_test?schema=public"
```

Na pasta `backend`, execute:

```bash
npm test -- src/prisma/prisma.integration.spec.ts
```

O teste verifica a disponibilização do PrismaService pelo NestJS
e executa uma consulta real ao PostgreSQL.

Atualmente, esse teste utiliza `SELECT 1` e não exige tabelas
no banco de testes.

## Worker (coleta em background)

O Worker é um processo NestJS **sem servidor HTTP**, responsável pela coleta
periódica de métricas, pelo cálculo de energia e CO₂e e pela persistência do
histórico. Ele reaproveita os módulos do backend (`PrismaService`,
`ServicosRepository`) por meio de um módulo próprio (`WorkerModule`).

Para executá-lo (com o PostgreSQL iniciado e as migrations aplicadas):

```bash
npm run start:worker   # executa dist/worker/main.js
# ou, em desenvolvimento:
npm run worker:dev
```

Variáveis de ambiente utilizadas pelo Worker:

```dotenv
AGREGADOR_BASE_URL=https://metrics.unilaunch.org
AGREGADOR_TIMEOUT_MS=5000
CARBON_BASE_URL=https://carbon.unilaunch.org
COLETA_INTERVALO_MS=30000
```

`COLETA_INTERVALO_MS` define o intervalo entre os ciclos de coleta, em
milissegundos. A cada ciclo o Worker descobre os serviços, coleta as métricas,
calcula os indicadores e grava uma `Coleta` no histórico, atualizando o estado
do serviço (`ATIVO`, `INDISPONIVEL`, `SEM_METRICAS` ou `REMOVIDO`).

## Verificação do banco (scripts)

Scripts de conferência das tabelas ficam em `backend/test/`:

| Arquivo | Função |
|---|---|
| `conferir-tabelas.sql` | Consultas SQL (rodam via `psql` ou no DBeaver). |
| `conferir-tabelas.sh` | Executa o `.sql` no container do Postgres. |

**Pré-requisitos:** containers no ar (`docker compose up -d`) e pelo menos um
ciclo de coleta do Worker já executado.

Executar (de qualquer pasta do repositório):

```bash
bash backend/test/conferir-tabelas.sh
```

Para rodar no **DBeaver**: conecte em `localhost:5434`, banco `greener`,
usuário `greener`, senha `greener_dev`, e abra o `conferir-tabelas.sql`.

### O que o script verifica

1. **Tabelas existentes** — devem aparecer `servicos`, `coletas` e
   `_prisma_migrations`.
2. **Contagem de linhas** — `servicos` e `coletas`.
3. **Serviços monitorados** — id, `status`, `region_code` e `ultima_coleta_at`.
4. **Últimas coletas** — métricas e indicadores calculados
   (`potencia_w`, `energia_kwh`, `carbon_intensity`, `co2e_g`).
5. **Coletas por serviço** — total por serviço e a última coleta.

### Resultados esperados

- `servicos` com **uma linha por serviço** descoberto pelo Worker, sempre com
  `status` entre `ATIVO`, `INDISPONIVEL`, `SEM_METRICAS` e `REMOVIDO`.
- `coletas` com **N linhas ≈ (serviços × número de ciclos)** — cresce a cada
  intervalo de coleta (`COLETA_INTERVALO_MS`).
- `ultima_coleta_at` recente (dentro do intervalo de coleta).
- Os indicadores fecham a fórmula:
  `co2e_g = energia_kwh × carbon_intensity` e
  `energia_kwh = potencia_w × (intervalo_s / 3600) / 1000`.
- Serviços saudáveis aparecem como `ATIVO`; sem métricas como `SEM_METRICAS`
  (HTTP 404); indisponíveis como `INDISPONIVEL` (HTTP 500).

## Encerrar o ambiente

Encerre o backend com `Ctrl+C`.

Na raiz do repositório:

```bash
docker compose stop postgres
```

Esse comando mantém os dados armazenados no volume.

## Arquivos de ambiente

Não versione `.env` nem `.env.test`.
Mantenha `.env.example` atualizado e sem credenciais reais.