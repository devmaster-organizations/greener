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