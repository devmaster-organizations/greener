# Sprint 1

> **Epic:** [E06] Execução, documentação e avaliação de usabilidade #6 — [E06] Qualidade, documentação e avaliação  
> **Feature:** [F06.1] Documentação das sprints 1, 2 e 3 #52 — [F06.1] Documentação das sprints 1, 2 e 3  
> **RF:** RNF08, RP01–RP09  
> **Sprint:** 1  
> **Prioridade:** P1  
> **Área:** docs

---

## 📅 Período da Sprint 1

| Campo | Valor |
|-------|-------|
| Início | 29/09/2026 (kick-off do projeto ABP) |
| Término | 20/10/2026 |



---

## 🎯 Objetivo da Sprint 1

Entregar a **base do GreenER**: ambiente containerizado, backend com API REST, banco de dados PostgreSQL com Prisma, Worker de coleta em background e frontend inicial. A sprint focou na descoberta de serviços, coleta de métricas periódicas, cálculo de energia/CO₂e e persistência do histórico.

---

## 🧩 Itens Planejados (Sprint Backlog)

| ID | Atividade | Pontuação | Disciplina | Requisito |
|----|-----------|-----------|------------|-----------|
| S1-01 | Configurar repositório, estrutura de pastas e TypeScript | 5 | ES | RP01 |
| S1-02 | Configurar Docker Compose (PostgreSQL, Backend, Worker, Frontend) | 13 | ES | RP05 |
| S1-03 | Modelar banco de dados com Prisma (servicos, coletas) | 8 | BD | RP03 |
| S1-04 | Criar migrations do Prisma (servicos, coletas) | 8 | BD | RP03 |
| S1-05 | Implementar cliente do Agregador de Métricas (listar + coletar) | 13 | TP | RF01, RF03 |
| S1-06 | Implementar cliente da Carbon Intensity API com cache | 8 | TP | RF04 |
| S1-07 | Implementar domínio puro: potência, energia, CO₂e | 5 | TP | RF07 |
| S1-08 | Implementar Worker standalone (sem HTTP) com ScheduleModule | 13 | TP | RF02, RF10, RNF03 |
| S1-09 | Implementar backend HTTP com NestJS | 8 | TP | RP02 |
| S1-10 | Implementar repositórios (servicos, coletas) no Prisma | 8 | TP | RP04 |
| S1-11 | Criar endpoints GET /servicos e GET /servicos/:id | 5 | TP | RF08 |
| S1-12 | Criar endpoints GET /coletas, /dashboard/* | 5 | TP | RF08, RF14 |
| S1-13 | Implementar frontend inicial (Next.js) | 13 | DW | RP01 |
| S1-14 | Configurar testes Vitest no backend | 5 | TP | RNF07 |
| S1-15 | Criar scripts de verificação do banco | 3 | ES | RNF08 |

---

## ✅ Itens Entregues

| ID | Atividade | Status | Evidência |
|----|-----------|--------|-----------|
| S1-01 | Repositório, estrutura e TypeScript | ✅ | Commit `46bb002` (main) |
| S1-02 | Docker Compose (PostgreSQL, Backend, Worker, Frontend) | ✅ | `compose.yml`; PR #33 `fix/worker-ajustes` ([#33](https://github.com/devmaster-organizations/greener/pull/33)) |
| S1-03 | Modelagem Prisma (servicos, coletas) | ✅ | `backend/prisma/schema.prisma`; `backend/prisma/migrations/` |
| S1-04 | Migrations Prisma | ✅ | `backend/prisma/migrations/20261008022727_create_servicos/`, `20261016213035_add_coletas/` |
| S1-05 | Cliente Agregador de Métricas | ✅ | `backend/src/agregador/agregador.client.ts`; PR #27 `feat/cliente-agregador-pr` ([#27](https://github.com/devmaster-organizations/greener/pull/27)) |
| S1-06 | Cliente Carbon Intensity API com cache | ✅ | `backend/src/carbon/carbon.client.ts` |
| S1-07 | Domínio puro (cálculo ambiental) | ✅ | `backend/src/dominio/calculo-ambiental.ts`; `calculo-ambiental.spec.ts` |
| S1-08 | Worker standalone sem HTTP | ✅ | `backend/src/worker/main.ts`; `backend/src/worker/worker.module.ts`; PR #32 `feat/worker` ([#32](https://github.com/devmaster-organizations/greener/pull/32)) |
| S1-09 | Backend HTTP NestJS | ✅ | `backend/src/main.ts`; `backend/src/app.module.ts` |
| S1-10 | Repositórios Prisma | ✅ | `backend/src/servicos/servicos.repository.ts`; `backend/src/coletas/coletas.repository.ts` |
| S1-11 | GET /servicos e GET /servicos/:id | ✅ | `backend/src/servicos/servicos.controller.ts`; PR #36 `feat/backend-card-main` ([#36](https://github.com/devmaster-organizations/greener/pull/36)) |
| S1-12 | GET /coletas, GET /dashboard/* | ✅ | `backend/src/coletas/coletas.controller.ts`; `backend/src/dashboard/dashboard.controller.ts`; PR #36 |
| S1-13 | Frontend inicial Next.js | ✅ | `frontend/`; PR #31 `feat/dashboard` ([#31](https://github.com/devmaster-organizations/greener/pull/31)) |
| S1-14 | Testes Vitest backend | ✅ | `backend/src/**/*.spec.ts`; `npm test` → 30 testes passando |
| S1-15 | Scripts de verificação do banco | ✅ | `backend/test/conferir-tabelas.sh`; `backend/test/conferir-tabelas.sql`; commit `ef3bae9` |

---

## 📋 RFs e RNFs Cobertos

| Requisito | Descrição | Status | Evidência |
|-----------|-----------|--------|-----------|
| **RF01** | Descoberta de serviços (`GET /services`) | ✅ | `agregador/agregador.client.ts` (`listarServicos`); PR #27 |
| **RF02** | Monitoramento dinâmico (inclusão/remoção/indisponibilidade/retorno) | ✅ | `monitoramento/monitoramento.service.ts` (`marcarRemovidosExceto`); PR #32 |
| **RF03** | Coleta de métricas por serviço (`GET /metrics/{id}`) | ✅ | `agregador/agregador.client.ts` (`coletarMetricas`); PR #27 |
| **RF04** | Tratamento da variação das métricas | ✅ | `dominio/calculo-ambiental.ts` (fórmulas puras); `calculo-ambiental.spec.ts` |
| **RF05** | Detecção de indisponibilidade | ✅ | `coletarMetricas()` mapeia 500/rede → `INDISPONIVEL`; PR #27 |
| **RF06** | Detecção de ausência de métricas | ✅ | `coletarMetricas()` mapeia 404 → `SEM_METRICAS`; PR #27 |
| **RF07** | Cálculo individual de energia e CO₂e | ✅ | `estimarPotenciaWatts`, `estimarEnergiaKwh`, `estimarCo2eGramas`; `calculo-ambiental.spec.ts` |
| **RF08** | Indicadores agregados | ✅ | `GET /dashboard/indicadores`; `dashboard.controller.ts`; PR #36 |
| **RF09** | Dashboard operacional por serviço | ✅ | `frontend/`; `GET /servicos`, `GET /coletas`; PR #31 |
| **RF10** | Histórico de coletas | ✅ | Tabela `coletas` (append-only); `coletas.repository.ts`; PR #32 |
| **RF11** | Atualização contínua sem recarregar página | ⚠️ | Polling ainda não implementado no frontend (pendente) |
| **RF12** | Localização dos serviços (país, região, cidade) | ✅ | `servicos.pais/regiao/cidade`; `paraServicoResponse()` |
| **RF13** | Visualização geográfica em mapa | ✅ | `MapaServicosLeaflet.tsx` (react-leaflet); `latitude`/`longitude` opcionais |
| **RF14** | Ranking de impacto | ⚠️ | `GET /dashboard/impacto-por-servico` ordenado; sem tela de ranking nem seleção de período |
| **RF15** | Comparação entre serviços | ❌ | Não implementado (pendente) |
| **RF16** | Autenticação JWT | ⚠️ | `POST /auth/login` implementado; não há rotas protegidas de alteração de parâmetros |
| **RNF03** | Atualização periódica | ✅ | `COLETA_INTERVALO_MS` + `@nestjs/schedule`; Worker |
| **RNF05** | Tolerância a falhas | ✅ | Worker captura exceções por serviço/ciclo; não derruba o processo |
| **RNF07** | Manutenibilidade e testes | ✅ | 30 testes passando; regras puras em `dominio/` |
| **RNF08** | Documentação técnica | ✅ | `README.md`, `backend/README.md`, `docs/worker/`, `docs/diagramas/` |
| **RP01** | Frontend React + TypeScript | ✅ | Next.js + React + TypeScript |
| **RP02** | Backend NestJS/TS, módulos/controllers/services | ⚠️ | NestJS + módulos ✅; DTOs são interfaces (sem class-validator) |
| **RP03** | PostgreSQL + ORM | ✅ | Prisma + `@prisma/adapter-pg` |
| **RP04** | Separação de responsabilidades | ✅ | `dominio/` (regras), `*.repository.ts` (dados), `agregador/`/`carbon/` (APIs) |
| **RP05** | Execução containerizada | ✅ | `docker-compose.yml` (postgres, migrate, backend, worker, frontend) |
| **RP06** | MVP funcional | ✅ | Backend + Worker + Frontend funcionando |
| **RP07** | Autenticação JWT | ✅ | `AuthModule`/`AuthService` com `JwtService` + `bcryptjs` |
| **RP08** | Gestão ágil (backlog priorizado) | ⚠️ | `Epicos_US_tasks.md` cobre o Worker; pendente para o projeto todo |
| **RP09** | Evidências de IHC | ✅ | `docs/atividade-ui-ux/` |



---

## 🔗 PRs e Issues Relacionadas

### Pull Requests (Greener)

| PR | Título | Status | Link |
|----|--------|--------|------|
| #27 | feat(cliente-agregador-pr) | Merged | [#27](https://github.com/devmaster-organizations/greener/pull/27) |
| #31 | feat(dashboard) | Merged | [#31](https://github.com/devmaster-organizations/greener/pull/31) |
| #32 | feat(worker) | Merged | [#32](https://github.com/devmaster-organizations/greener/pull/32) |
| #33 | fix/worker-ajustes | Merged | [#33](https://github.com/devmaster-organizations/greener/pull/33) |
| #35 | feat(login-backend) | Merged | [#35](https://github.com/devmaster-organizations/greener/pull/35) |
| #36 | feat(backend-card-main) | Merged | [#36](https://github.com/devmaster-organizations/greener/pull/36) |

### Issues

| Issue | Título | Status | Link |
|-------|--------|--------|------|
| #37 | [F01.1] Ciclo de vida e remoção de serviços (RF02) | Open | [#37](https://github.com/devmaster-organizations/greener/issues/37) |



---

## 📊 Evidências

### Comandos de verificação

```bash
# Subir a stack completa
docker compose up -d --build

# Verificar saúde do Postgres
docker compose exec -T postgres pg_isready -U greener -d greener

# Rodar testes do backend
cd backend
npm test

# Verificar build do TypeScript
npm run build

# Verificar tabelas e coletas gravadas
bash backend/test/conferir-tabelas.sh

# Verificar Worker coletando
docker compose logs worker
```

### Testes existentes

O backend utiliza **Vitest** para testes de unidade e integração. Os testes cobrem:

- `calculo-ambiental.spec.ts` — fórmulas de potência, energia e CO₂e
- `agregador/agregador.client.spec.ts` — cliente do Agregador (200/404/500/rede)
- `monitoramento/monitoramento.service.spec.ts` — orquestração do ciclo
- `coletas/coletas.controller.integration.spec.ts` — integração com banco
- `servicos/servicos.controller.integration.spec.ts` — integração com banco

Resultado esperado:
```
Test Files  X passed (X)
Tests       30 passed (30)
```

### Links de código

- [Greener no GitHub](https://github.com/devmaster-organizations/greener)
- [Backend](https://github.com/devmaster-organizations/greener/tree/develop/backend)
- [Frontend](https://github.com/devmaster-organizations/greener/tree/develop/frontend)
- [Infra (compose, docs)](https://github.com/devmaster-organizations/greener/tree/develop)

---

## ⚠️ Pendências

| Item | Descrição | Motivo |
|------|-----------|--------|
| RF11 | Atualização contínua do dashboard sem recarregar a página | Polling não implementado no frontend |
| RF14 | Ranking com seleção de período e alternância energia/CO₂e | Endpoint existe, mas sem tela dedicada |
| RF15 | Comparação entre dois ou mais serviços | Não implementado |
| RF16 | Rotas protegidas por JWT para alteração de parâmetros | Apenas login implementado; sem AuthGuard em rotas de escrita |
| RNF03 | Exibir intervalo e última atualização na UI | Não implementado |
| RNF06 | Remover segredos placeholder (JWT_SECRET, ObserveModule) | Credenciais default ainda no código |
| RP02 | DTOs com class-validator | Interfaces TypeScript sem validação declarativa |
| RP08 | Backlog priorizado de todo o projeto | `Epicos_US_tasks.md` cobre só o Worker |

---

## 🔄 Retrospectiva da Sprint 1

### O que funcionou

- O Worker de coleta em background foi implementado como aplicação NestJS standalone (sem HTTP), rodando em container próprio com a mesma imagem do backend.
- A reutilização do `AgregadorClient` da main evitou duplicação de código.
- O cálculo ambiental foi mantido puro em `dominio/`, facilitando testes unitários.
- A containerização com Docker Compose permitiu subir PostgreSQL, migrations, backend, Worker e frontend com um único comando.
- Os scripts de verificação (`conferir-tabelas.sh` / `.sql`) permitem conferir as tabelas e coletas gravadas rapidamente.
- A separação entre repositórios (acesso ao DB) e clientes (acesso a APIs externas) ficou clara.

### O que melhorar

- O dashboard não atualiza sozinho (RF11 pendente) — necessário polling ou WebSocket.
- Não existem endpoints de comparação entre serviços (RF15 pendente).
- O ranking não tem tela dedicada nem seleção de período (RF14 parcial).
- Credenciais placeholder (`YOUR_APP_KEY`, `JWT_SECRET` default) ainda estão no código (RNF06).
- Os PRs poderiam ter revisões mais formais antes do merge.
- Não há burndown chart visível para acompanhamento do progresso da sprint.

---

