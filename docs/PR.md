## Título
**feat(worker):** serviço de coleta em background + container Docker

## Resumo

Adiciona o **Worker do GreenER**: um serviço de background, em **container próprio**,
que descobre serviços, coleta métricas periodicamente, calcula energia/CO₂e e
persiste o histórico — mantendo o estado de cada serviço atualizado sem intervenção
manual. O Worker é um segundo entrypoint do `backend/` (NestJS standalone, **sem
HTTP**), reaproveitando `PrismaService` e módulos existentes.

Branch criada a partir da `main`. 32 arquivos, +3374/−45.

## O que foi alterado

### Worker (novo)
- `src/worker/` — `WorkerModule` + `main.ts` (`createApplicationContext`, sem HTTP).
- `src/monitoramento/` — orquestra o ciclo: descobre → coleta → calcula → persiste → reclassifica.
- `src/carbon/` — cliente da Carbon Intensity API **com cache por região**.
- `src/coletas/` — repositório do histórico de coletas.
- `src/dominio/` — regras puras: potência, energia e CO₂e (funções sem I/O) + constantes de estado.
- `src/agregador/agregador.client.ts` — **estendido** com `coletarMetricas()` (200/404/500/rede). Reaproveita o `AgregadorClient` já existente na `main` (PR #27) em vez de duplicar.

### Alterações no backend
- **`package.json` / `package-lock.json`**: declaradas dependências que faltavam (`prisma`, `@prisma/client`, `@prisma/adapter-pg`, `pg`, `dotenv`, `@types/pg`) e adicionado `@nestjs/schedule`; novos scripts `start:worker`, `worker:dev`, `prisma:generate`, `prisma:migrate`; removido o script inválido `deploy`.
- **`prisma7.config.ts` → `prisma.config.ts`**: nome correto esperado pelo Prisma CLI.
- **`prisma/schema.prisma`**: novo modelo **`Coleta`** + relação com `Servico`; migration `20261016213035_add_coletas`.
- **`src/servicos/servicos.repository.ts`**: `latitude`/`longitude` no input e novos métodos `listar`, `atualizarStatus`, `marcarRemovidosExceto`.
- **`src/main.ts`**: removido `console.log` de debug e corrigido fallback de porta (`3000` → `3001`).
- **`.env.example`**: `DATABASE_URL` + variáveis das APIs (`AGREGADOR_*`, `CARBON_BASE_URL`, `COLETA_INTERVALO_MS`).

### Containerização
- `backend/Dockerfile` + `backend/.dockerignore` — imagem única para backend e Worker.
- `compose.yml`: serviços `postgres`, `migrate` (one-shot), `backend` e `worker` (mesma imagem, `command` diferente; `worker` sem porta).

### Documentação e scripts
- `docs/worker/README.md` (spec do Worker) e `docs/worker-sintese.md`.
- `backend/test/conferir-tabelas.{sh,sql}` — verificação do banco.
- `backend/README.md` e `README.md` atualizados.

## Como testar

### 1. Testes automatizados
```bash
cd backend
npm ci
docker compose up -d postgres
docker compose exec postgres psql -U greener -d greener -c "CREATE DATABASE greener_test;"
DATABASE_URL="postgresql://greener:greener_dev@localhost:5434/greener_test?schema=public" npx prisma migrate deploy
npm test            # unitários + integração
npm run test:e2e    # e2e
Esperado: 30 testes aprovados (npm test) e 1 no test:e2e.
2. Stack completa (containers)
docker compose up -d --build
docker compose ps          # postgres (healthy), backend e worker running
docker compose logs -f worker
Esperado no log: Worker iniciado — coleta a cada 30000 ms e GreenER Worker em execução.
3. Verificar os registros gravados (script)
bash backend/test/conferir-tabelas.sh
Esperado:
- Tabelas: servicos, coletas, _prisma_migrations.
- servicos: 1 linha por serviço descoberto, com status (ATIVO/INDISPONIVEL/SEM_METRICAS/REMOVIDO) e ultima_coleta_at recente.
- coletas: cresce a cada ciclo (≈ serviços × ciclos).
- Fórmulas conferem: co2e_g = energia_kwh × carbon_intensity.
4. Consulta manual (DBeaver)
localhost:5434 · banco greener · usuário greener · senha greener_dev — abrir backend/test/conferir-tabelas.sql.
Evidências (execução local)
- 7–8 serviços descobertos; coletas acumuladas a cada ciclo, todas ATIVO.
- Exemplo: reporting-batch CPU 51,49% → 54,47 W → 0,000393 kWh × 40 gCO₂e/kWh = 0,015735 gCO₂e.
- carbon_intensity consistente com a região de cada serviço (br-sudeste 85, us-east 378, ca-central 40, eu-west 295, jp-east 465).
Requisitos atendidos
RF01, RF02, RF03, RF04, RF05, RF06, RF07, RF10, RNF03, RNF05, RNF07 e a base do RP05.
Fora do escopo desta PR
- Endpoints de leitura no backend (dashboard, indicadores, ranking, comparação) — RF08/RF09/RF12–RF15.
- Container do frontend.
- Pendências anotadas no OBSERVACOES.md (registro do AppModule e remoção das credenciais placeholder do @nestjs/observe).
Checklist
- Build (npm run build) OK
- Testes (npm test, npm run test:e2e) OK
- Execução containerizada validada
- Documentação e scripts de verificação incluídos
