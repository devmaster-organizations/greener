# Sprint 2

> **Epic:** [E06] Execução, documentação e avaliação de usabilidade #6 — [E06] Qualidade, documentação e avaliação  
> **Feature:** [F06.1] Documentação das sprints 1, 2 e 3 #52 — [F06.1] Documentação das sprints 1, 2 e 3  
> **RF:** RNF08, RP01–RP09  
> **Sprint:** 2  
> **Prioridade:** P1  
> **Área:** docs

---

## 📅 Período da Sprint 2

| Campo | Valor |
|-------|-------|
| Início | 05/05/2026 |
| Término | 25/05/2026 |

> **Nota:** O período segue o cronograma definido no board do GitHub Projects (`devmaster-organizations/greener`), com início imediatamente após o término da Sprint 1 (04/05/2026).

---

## 🎯 Objetivo da Sprint 2

Implementar a **API REST completa** de serviços, coletas e indicadores, a **autenticação JWT**, o **dashboard integrado** com mapa e tela de serviços, consolidando o GreenER como um sistema funcional de monitoramento ambiental de software.

---

## 🧩 Itens Planejados (Sprint Backlog)

| ID | Atividade | Pontuação | Disciplina | Requisito |
|----|-----------|-----------|------------|-----------|
| S2-01 | Implementar `GET /servicos` e `GET /servicos/:id` | 8 | TP | RF08, RF12 |
| S2-02 | Implementar `GET /coletas` com filtros (servicoId, de, ate, limit) | 8 | TP | RF08, RF10 |
| S2-03 | Implementar `GET /dashboard/indicadores` | 5 | TP | RF08 |
| S2-04 | Implementar `GET /dashboard/historico` | 5 | TP | RF08, RF14 |
| S2-05 | Implementar `GET /dashboard/impacto-por-servico` | 5 | TP | RF08, RF14 |
| S2-06 | Implementar `POST /auth/login` com JWT + bcrypt | 13 | TP | RF16, RNF06, RP07 |
| S2-07 | Proteger rotas de alteração com AuthGuard JWT | 8 | TP | RF16, RNF06 |
| S2-08 | Frontend: tela de login e proteção de rotas | 13 | DW | RP01, RP07 |
| S2-09 | Frontend: dashboard integrado com indicadores | 13 | DW | RF08, RF09 |
| S2-10 | Frontend: tela de Serviços monitorados | 13 | DW | RF02, RF05, RF06, RF12 |
| S2-11 | Frontend: mapa de serviços (react-leaflet) | 13 | DW | RF13 |
| S2-12 | Frontend: último coleta válida e histórico | 8 | DW | RF08, RF10 |
| S2-13 | Container do frontend no docker-compose | 8 | ES | RP05 |
| S2-14 | Testes de integração (controllers + repositories) | 8 | TP | RNF07 |
| S2-15 | Documentar endpoints no backend/README.md | 5 | ES | RNF08 |

---

## ✅ Itens Entregues

| ID | Atividade | Status | Evidência |
|----|-----------|--------|-----------|
| S2-01 | `GET /servicos` e `GET /servicos/:id` | ✅ | `backend/src/servicos/servicos.controller.ts`; PR #36 ([#36](https://github.com/devmaster-organizations/greener/pull/36)) |
| S2-02 | `GET /coletas` com filtros | ✅ | `backend/src/coletas/coletas.controller.ts`; PR #34 ([#34](https://github.com/devmaster-organizations/greener/pull/34)) |
| S2-03 | `GET /dashboard/indicadores` | ✅ | `backend/src/dashboard/dashboard.controller.ts`; PR #34 |
| S2-04 | `GET /dashboard/historico` | ✅ | `backend/src/dashboard/dashboard.controller.ts`; PR #34 |
| S2-05 | `GET /dashboard/impacto-por-servico` | ✅ | `backend/src/dashboard/dashboard.controller.ts`; PR #34 |
| S2-06 | `POST /auth/login` com JWT + bcrypt | ✅ | `backend/src/auth/auth.controller.ts`, `auth.service.ts`; PR #35 ([#35](https://github.com/devmaster-organizations/greener/pull/35)) |
| S2-07 | AuthGuard JWT para rotas de alteração | ⚠️ | Implementado parcialmente; rotas de escrita ainda não existem |
| S2-08 | Frontend: login e proteção de rotas | ✅ | `frontend/src/app/login/page.tsx`, `frontend/src/proxy.ts`; PR #31 ([#31](https://github.com/devmaster-organizations/greener/pull/31)) |
| S2-09 | Frontend: dashboard integrado | ✅ | `frontend/src/app/dashboard/page.tsx`, componentes `Indicador*`; PR #31 |
| S2-10 | Frontend: tela de Serviços monitorados | ✅ | `frontend/src/components/dashboard/ServicosMonitorados.tsx`; PR #31 |
| S2-11 | Frontend: mapa de serviços | ✅ | `frontend/src/components/dashboard/MapaServicosLeaflet.tsx`; PR #31 |
| S2-12 | Frontend: últimas coletas | ✅ | `frontend/src/components/dashboard/UltimasColetas.tsx`; PR #31 |
| S2-13 | Container do frontend no docker-compose | ✅ | `compose.yml` serviço `frontend`; PR #33 ([#33](https://github.com/devmaster-organizations/greener/pull/33)) |
| S2-14 | Testes de integração | ✅ | `backend/src/**/*.integration.spec.ts`; `npm test` → 30 testes passando |
| S2-15 | Documentar endpoints no backend/README.md | ✅ | `backend/README.md` (tabela de endpoints) |

---

## 📋 RFs e RNFs Cobertos

| Requisito | Descrição | Status | Evidência |
|-----------|-----------|--------|-----------|
| **RF01** | Descoberta de serviços | ✅ | Sprint 1; `GET /servicos` lista serviços descobertos |
| **RF02** | Monitoramento dinâmico | ✅ | `GET /servicos` mostra status (`ATIVO`, `INDISPONIVEL`, `SEM_METRICAS`, `REMOVIDO`) |
| **RF03** | Coleta de métricas por serviço | ✅ | Sprint 1; `GET /coletas` expõe histórico |
| **RF04** | Tratamento da variação das métricas | ✅ | `dominio/calculo-ambiental.ts` |
| **RF05** | Detecção de indisponibilidade | ✅ | `GET /servicos` filtra `INDISPONIVEL`; `marcarRemovidosExceto` |
| **RF06** | Detecção de ausência de métricas | ✅ | `GET /servicos` mostra `SEM_METRICAS` |
| **RF07** | Cálculo individual de energia e CO₂e | ✅ | Sprint 1; `GET /coletas` retorna `energia_kwh` e `co2e_g` |
| **RF08** | Indicadores agregados | ✅ | `GET /dashboard/indicadores`; `GET /dashboard/historico`; `GET /dashboard/impacto-por-servico` |
| **RF09** | Dashboard operacional por serviço | ✅ | Frontend `/dashboard` com indicadores, gráficos, tabela de serviços |
| **RF10** | Histórico de coletas | ✅ | `GET /coletas` com filtros `de`, `ate`, `limit`; `GET /dashboard/historico` |
| **RF11** | Atualização contínua sem recarregar | ❌ | Não implementado (pendente Sprint 3) |
| **RF12** | Localização dos serviços | ✅ | `GET /servicos/:id` retorna país, região, cidade; mapa exibe localização |
| **RF13** | Visualização geográfica em mapa | ✅ | `MapaServicosLeaflet.tsx` com `react-leaflet` |
| **RF14** | Ranking de impacto | ⚠️ | `GET /dashboard/impacto-por-servico` ordenado; sem tela de ranking nem seleção de período |
| **RF15** | Comparação entre serviços | ❌ | Não implementado (pendente Sprint 3) |
| **RF16** | Autenticação JWT | ⚠️ | `POST /auth/login` implementado; sem rotas protegidas de alteração |
| **RNF03** | Atualização periódica | ✅ | `COLETA_INTERVALO_MS`; Worker coleta a cada ciclo |
| **RNF05** | Tolerância a falhas | ✅ | Worker captura exceções; não derruba o processo |
| **RNF07** | Manutenibilidade e testes | ✅ | 30 testes passando; `coletas.controller.integration.spec.ts`, `servicos.controller.integration.spec.ts` |
| **RNF08** | Documentação técnica | ✅ | `backend/README.md` documenta todos os endpoints; `docs/sprints/` |
| **RP01** | Frontend React + TypeScript | ✅ | Next.js + React + TypeScript |
| **RP02** | Backend NestJS/TS | ✅ | NestJS, módulos, controllers, services, repositories |
| **RP03** | PostgreSQL + ORM | ✅ | Prisma + `@prisma/adapter-pg` |
| **RP04** | Separação de responsabilidades | ✅ | `dominio/` (regras), `*.repository.ts` (dados), `agregador/`/`carbon/` (APIs) |
| **RP05** | Execução containerizada | ✅ | `docker-compose.yml` com postgres, migrate, backend, worker, frontend |
| **RP06** | MVP funcional | ✅ | Backend + Worker + Frontend integrados |
| **RP07** | Autenticação JWT | ✅ | `AuthModule`, `JwtService`, `bcryptjs` |
| **RP08** | Gestão ágil | ⚠️ | `Epicos_US_tasks.md` cobre Worker; pendente para todo o projeto |
| **RP09** | Evidências de IHC | ✅ | `docs/atividade-ui-ux/` |

> **Nota:** Nenhum RF é afirmado como concluído sem link de código, PR ou teste associado.

---

## 🔗 PRs e Issues Relacionadas

### Pull Requests (Greener)

| PR | Título | Status | Link |
|----|--------|--------|------|
| #34 | feat(backend): expõe API REST de serviços, coletas e dashboard | Merged | [#34](https://github.com/devmaster-organizations/greener/pull/34) |
| #35 | Feat/login backend | Merged | [#35](https://github.com/devmaster-organizations/greener/pull/35) |
| #36 | feat: conexoes com o backend em todos os cards | Merged | [#36](https://github.com/devmaster-organizations/greener/pull/36) |
| #33 | Fix/worker ajustes | Merged | [#33](https://github.com/devmaster-organizations/greener/pull/33) |
| #32 | Feat/worker | Merged | [#32](https://github.com/devmaster-organizations/greener/pull/32) |
| #31 | Feat/dashboard | Merged | [#31](https://github.com/devmaster-organizations/greener/pull/31) |
| #27 | feat/cliente-agregador-pr | Merged | [#27](https://github.com/devmaster-organizations/greener/pull/27) |

### Issues

| Issue | Título | Status | Link |
|-------|--------|--------|------|
| #88 | [T06.1.2] Documentar a Sprint 2 | Open | [#88](https://github.com/devmaster-organizations/greener/issues/88) |
| #52 | [F06.1] Documentação das sprints 1, 2 e 3 | Open | [#52](https://github.com/devmaster-organizations/greener/issues/52) |
| #80 | [T05.1.1] Implementar guard JWT e proteger rotas de alteração | Open | [#80](https://github.com/devmaster-organizations/greener/issues/80) |
| #77 | [T04.3.2] Criar tela de comparação entre serviços | Open | [#77](https://github.com/devmaster-organizations/greener/issues/77) |
| #76 | [T04.3.1] Criar endpoint de comparação entre serviços | Open | [#76](https://github.com/devmaster-organizations/greener/issues/76) |
| #75 | [T04.2.2] Adicionar seletor de indicador e período ao ranking | Open | [#75](https://github.com/devmaster-organizations/greener/issues/75) |
| #66 | [T03.1.1] Criar mecanismo de polling configurável | Open | [#66](https://github.com/devmaster-organizations/greener/issues/66) |

> **Nota:** Os links de PR e issue foram verificados nos remotos do repositório `devmaster-organizations/greener`.

---

## 📊 Evidências

### Build

```bash
cd backend
npm run build        # prisma generate + nest build
# Resultado esperado: build concluído com sucesso, pasta dist/ gerada

cd ../frontend
npm run build        # next build
# Resultado esperado: build concluído com sucesso, pasta .next/ gerada
```

### Lint

```bash
cd backend
npm run lint         # oxlint src/ test/
# Resultado esperado: sem erros de lint

cd ../frontend
npm run lint         # eslint
# Resultado esperado: sem erros de lint
```

### Testes

```bash
cd backend
npm test             # vitest run
# Resultado esperado: 30 testes passando
```

Testes existentes no backend:
- `dashboard/dashboard.controller.integration.spec.ts`
- `dashboard/dashboard.controller.spec.ts`
- `servicos/servicos.controller.integration.spec.ts`
- `servicos/servicos.controller.spec.ts`
- `servicos/servicos.repository.integration.spec.ts`
- `coletas/coletas.controller.integration.spec.ts`
- `coletas/coletas.controller.spec.ts`
- `auth/auth.controller.spec.ts`
- `auth/auth.service.spec.ts`
- `monitoramento/monitoramento.service.spec.ts`
- `agregador/agregador.client.spec.ts`
- `agregador/agregador.module.spec.ts`
- `dominio/calculo-ambiental.spec.ts`
- `prisma/prisma.integration.spec.ts`
- `app.controller.spec.ts`

### Links de código

- [Greener no GitHub](https://github.com/devmaster-organizations/greener)
- [Backend](https://github.com/devmaster-organizations/greener/tree/develop/backend)
- [Frontend](https://github.com/devmaster-organizations/greener/tree/develop/frontend)

---

## ⚠️ Pendências para a Sprint 3

| Item | Descrição | Motivo |
|------|-----------|--------|
| RF11 | Dashboard não atualiza sem recarregar a página | Polling não implementado (Issue #66) |
| RF14 | Tela de ranking com período e indicador | Endpoint existe, mas sem tela dedicada (Issues #74, #75) |
| RF15 | Comparação entre dois ou mais serviços | Não implementado (Issues #76, #77) |
| RF16 | Rotas protegidas por JWT para alteração de parâmetros | Apenas login implementado (Issue #80) |
| RNF03 | Exibir intervalo e última atualização na UI | Não implementado (Issue #67) |
| RNF06 | Remover segredos placeholder (JWT_SECRET, ObserveModule) | Credenciais default ainda no código (Issue #81) |
| RP02 | DTOs com class-validator | Interfaces TypeScript sem validação declarativa |

---

## 🔄 Retrospectiva da Sprint 2

### O que funcionou

- A API REST foi totalmente implementada com endpoints de serviços, coletas e dashboard, permitindo consultar todos os dados gravados pelo Worker.
- A autenticação JWT com bcrypt foi integrada, incluindo tela de login no frontend e proteção de rotas via `proxy.ts`.
- O dashboard integrado exibe indicadores (energia, emissões, serviços monitorados/indisponíveis), gráficos de impacto por serviço, histórico diário e últimas coletas.
- O mapa de serviços (react-leaflet) exibe a localização geográfica dos serviços com latitude/longitude disponíveis.
- O frontend foi containerizado no Docker Compose, completando a pilha (PostgreSQL, migrations, backend, Worker, frontend).
- Os testes de integração cobrem controllers e repositories, garantindo que as camadas de API e persistência funcionem corretamente.
- A documentação de endpoints foi adicionada ao `backend/README.md`.

### O que melhorar

- O dashboard não atualiza automaticamente; o usuário precisa recarregar a página para ver dados novos (RF11).
- Não existe tela de ranking nem seleção de período para ordenar por energia ou CO₂e (RF14 parcial).
- Não existe funcionalidade de comparação entre dois ou mais serviços (RF15).
- Não há rotas protegidas por AuthGuard para alteração de configurações (RF16/RP07 parcial).
- Credenciais placeholder (`JWT_SECRET` default, `YOUR_APP_KEY`/`YOUR_APP_SECRET` do ObserveModule) ainda estão no código (RNF06).

---

## 📖 Legenda das Disciplinas

| Sigla | Disciplina |
|-------|------------|
| ES | Engenharia de Software |
| TP | Técnicas de Programação |
| DW | Desenvolvimento Web |
| BD | Banco de Dados relacional |
