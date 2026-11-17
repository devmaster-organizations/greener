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
| Início | 21/10/2026 |
| Término | 10/11/2026 |

---

## 🎯 Objetivo da Sprint 2

Integrar o frontend ao backend real do **GreenER**, substituindo os dados simulados do dashboard, e entregar a autenticação JWT de ponta a ponta. A sprint também consolidou a API REST de leitura, a proteção da rota `/dashboard`, a navegação para os serviços monitorados e a documentação de UI/UX.

---

## 🧩 Itens Planejados (Sprint Backlog)

| ID | Atividade | Disciplina | Requisito |
|----|-----------|------------|-----------|
| S2-01 | Expor API REST de serviços, coletas e dashboard | TP | RF08, RF10, RF14 |
| S2-02 | Implementar autenticação JWT no backend com usuários persistidos | TP / BD | RF16, RP07 |
| S2-03 | Integrar a tela de login do frontend à API e proteger `/dashboard` | DW | RF16 |
| S2-04 | Integrar todos os cards e gráficos do dashboard ao backend | DW / TP | RF08, RF09, RF12 |
| S2-05 | Integrar o mapa de serviços ao backend (Leaflet) | DW | RF13 |
| S2-06 | Adicionar navegação para a seção de Serviços monitorados | DW | RF09 |
| S2-07 | Padronizar interações visuais (hover) | DW | RP09 |
| S2-08 | Produzir documentação e evidências de UI/UX | ES | RP09 |
| S2-09 | Containerizar o frontend no Docker Compose | ES | RP05 |

---

## ✅ Itens Entregues

| ID | Atividade | Status | Evidência |
|----|-----------|--------|-----------|
| S2-01 | API REST de serviços, coletas e dashboard | ✅ | PR #34 `feat/api-rest-servicos-coletas` ([#34](https://github.com/devmaster-organizations/greener/pull/34)); `backend/src/{servicos,coletas,dashboard}/*.controller.ts` |
| S2-02 | Autenticação JWT no backend | ✅ | PR #35 `feat/login-backend` ([#35](https://github.com/devmaster-organizations/greener/pull/35)); `backend/src/auth/`; migration `20261103224423_add_usuarios` |
| S2-03 | Login frontend integrado e rota protegida | ✅ | PR #35; `frontend/src/lib/{api,auth}.ts`; `frontend/src/proxy.ts`; `frontend/src/app/login/page.tsx` |
| S2-04 | Dashboard integrado ao backend | ✅ | PR #36 `feat/backend-card-main` ([#36](https://github.com/devmaster-organizations/greener/pull/36)); remoção de `frontend/src/data/mockDashboard.ts` |
| S2-05 | Mapa de serviços com dados reais | ✅ | PR #36; `MapaServicos.tsx`, `MapaServicosLeaflet.tsx`, `mapa-servicos.types.ts` |
| S2-06 | Navegação para Serviços monitorados | ✅ | PR #102 `feat/navegacao-servicos` ([#102](https://github.com/devmaster-organizations/greener/pull/102)); commit `b4b2dbb` |
| S2-07 | Ajuste visual de hover | ✅ | PR #103 `Luis` ([#103](https://github.com/devmaster-organizations/greener/pull/103)); commit `40a3b87` |
| S2-08 | Documentação de UI/UX | ✅ | PR #35; `docs/atividade-ui-ux/ATIVIDADE_UI_UX.md` + 5 prints |
| S2-09 | Container do frontend | ✅ | PR #35; `frontend/Dockerfile`, `frontend/.dockerignore`, `compose.yml` |

### Detalhamento por entrega

#### API REST (S2-01)

Endpoints expostos no backend:

| Endpoint | Descrição |
|----------|-----------|
| `GET /servicos` | Lista os serviços descobertos. |
| `GET /servicos/:id` | Detalha um serviço. |
| `GET /coletas` | Lista coletas com filtros `servicoId`, `de`, `ate` e `limit` (1–500, padrão 50). |
| `GET /dashboard/indicadores` | Energia total, CO₂e total, coletas, serviços monitorados e indisponíveis. |
| `GET /dashboard/historico` | Série diária de CO₂e. |
| `GET /dashboard/impacto-por-servico` | Ranking de impacto por serviço. |

A camada `backend/src/api/serializacao.ts` padroniza valores numéricos nulos. Foram adicionados testes de controller e de integração para os três módulos.

#### Autenticação (S2-02 e S2-03)

- Novo modelo `Usuario` no Prisma e migration `20261103224423_add_usuarios`.
- `POST /auth/login` valida e-mail/senha com `bcryptjs` e emite JWT via `@nestjs/jwt`.
- Resposta com `access_token` e dados do usuário.
- Frontend armazena token/usuário e cria cookie de sessão.
- `frontend/src/proxy.ts` redireciona `/dashboard/*` para `/login` quando não há cookie.

#### Dashboard integrado (S2-04 e S2-05)

- `mockDashboard.ts` removido.
- Cards conectados à API: energia, emissões, serviços monitorados e indisponíveis.
- Gráficos de histórico e impacto por serviço conectados aos endpoints reais.
- Tabelas de serviços monitorados e últimas coletas atualizadas com dados do backend.
- Mapa Leaflet usando latitude/longitude e estado dos serviços.

---

## 🚧 Trabalhos em Andamento (não contabilizados como entrega da Sprint 2)

| Item | Situação | Evidência |
|------|----------|-----------|
| Worker: filtro de serviços `REMOVIDO`, UML e documentação | PR aberto | PR #101 `feat/worker` ([#101](https://github.com/devmaster-organizations/greener/pull/101)); commits `8da6e19`, `939e295` |
| Página de Comparações | PR aberto | PR #104 `feature/pagina-comparacoes` ([#104](https://github.com/devmaster-organizations/greener/pull/104)); commit `a998846` |
| Modal e contrato de comparações | Branch sem PR | `feat/tela-comparacoes-servicos`; commits `b4352b2`, `b56339b` |
| Tela de Serviços | Branch sem PR | `feat/services_filter`; commit `59e9ce8` |
| Link do Figma no README | Fora do período | Commit `2e85529` (12/11/2026) |

O PR #101 também resolve a issue #37 ao filtrar serviços com status `REMOVIDO` no `GET /servicos`.

---

## 📋 RFs e RNFs Cobertos

| Requisito | Descrição | Status | Evidência |
|-----------|-----------|--------|-----------|
| **RF08** | Indicadores agregados | ✅ | `GET /dashboard/indicadores`; cards do dashboard; PRs #34 e #36 |
| **RF09** | Dashboard operacional | ✅ | Dashboard integrado; PR #36 |
| **RF10** | Histórico de coletas | ✅ | `GET /coletas`; gráfico de histórico; PR #34 |
| **RF11** | Atualização contínua sem recarregar | ⚠️ | Worker contínuo; frontend ainda busca uma única vez |
| **RF12** | Localização dos serviços | ✅ | `pais`, `regiao`, `cidade`, `latitude`, `longitude`; dashboard e mapa |
| **RF13** | Visualização geográfica | ✅ | `MapaServicosLeaflet.tsx`; PR #36 |
| **RF14** | Ranking de impacto | ⚠️ | `GET /dashboard/impacto-por-servico`; sem tela dedicada nem seleção de período |
| **RF15** | Comparação entre serviços | ❌ | PR #104 em andamento; ainda não mergeado |
| **RF16** | Autenticação e configuração | ⚠️ | Login JWT e proteção de `/dashboard`; sem guard nas rotas de escrita e configurações ainda simuladas |
| **RNF03** | Atualização periódica | ✅ | Worker com `@nestjs/schedule`; intervalo configurável |
| **RNF05** | Tolerância a falhas | ✅ | Coleta isolada por serviço; falhas não derrubam o Worker |
| **RNF07** | Manutenibilidade e testes | ✅ | Testes de controller, integração e autenticação adicionados |
| **RNF08** | Documentação técnica | ⚠️ | README e docs de UI/UX atualizados; documentação de API/Worker depende do PR #101 |
| **RP01** | Frontend React + TypeScript | ✅ | Next.js + React + TypeScript |
| **RP02** | Backend NestJS/TS | ⚠️ | Módulos/controllers/services ✅; DTOs ainda são interfaces sem `class-validator` |
| **RP03** | PostgreSQL + ORM | ✅ | Prisma + `@prisma/adapter-pg` |
| **RP04** | Separação de responsabilidades | ✅ | `dominio/`, repositórios, clients e controllers separados |
| **RP05** | Execução containerizada | ✅ | `compose.yml` com postgres, migrate, backend, worker e frontend |
| **RP06** | MVP funcional | ✅ | Backend + Worker + Frontend integrados |
| **RP07** | Autenticação JWT | ✅ | `AuthModule`, `AuthService`, `JwtService`, `bcryptjs`; PR #35 |
| **RP08** | Gestão ágil | ⚠️ | Backlog criado em `docs/backlog-greener.md`, mas ainda não mergeado |
| **RP09** | Evidências de IHC | ✅ | `docs/atividade-ui-ux/`; PR #35 |

---

## 🔗 PRs e Issues Relacionadas

### Pull Requests

| PR | Título | Status | Link |
|----|--------|--------|------|
| #34 | feat(backend): expõe API REST de serviços, coletas e dashboard | Merged em 03/11/2026 | [#34](https://github.com/devmaster-organizations/greener/pull/34) |
| #35 | Feat/login backend | Merged em 03/11/2026 | [#35](https://github.com/devmaster-organizations/greener/pull/35) |
| #36 | feat: conexões com o backend em todos os cards | Merged em 04/11/2026 | [#36](https://github.com/devmaster-organizations/greener/pull/36) |
| #102 | feat: adiciona navegação para serviços monitorados | Merged em 10/11/2026 | [#102](https://github.com/devmaster-organizations/greener/pull/102) |
| #103 | Alteração de visual hover e verificação | Merged em 10/11/2026 | [#103](https://github.com/devmaster-organizations/greener/pull/103) |
| #101 | Feat/worker | Aberto | [#101](https://github.com/devmaster-organizations/greener/pull/101) |
| #104 | feat(frontend): add comparisons page | Aberto | [#104](https://github.com/devmaster-organizations/greener/pull/104) |

### Issues

| Issue | Título | Status | Link |
|-------|--------|--------|------|
| #26 | [TASK][US01] Implementar cliente HTTP do Agregador de Métricas | Closed | [#26](https://github.com/devmaster-organizations/greener/issues/26) |
| #28 | [E03] Implementação do dashboard operacional GreenER | Closed | [#28](https://github.com/devmaster-organizations/greener/issues/28) |
| #37 | [F01.1] Ciclo de vida e remoção de serviços (RF02) | Open | [#37](https://github.com/devmaster-organizations/greener/issues/37) |
| #100 | [T06.6.1] Revisar e alinhar as issues existentes com o código | Open | [#100](https://github.com/devmaster-organizations/greener/issues/100) |

---

## 📊 Evidências

### Ambiente de verificação

- Backend verificado na `develop` (código idêntico ao da `main`).
- Frontend verificado na branch `chore/sprint-2-docs-nextjs`, criada a partir da `main`.
- Dependências sincronizadas com `npm ci` no backend.
- PostgreSQL 16 em container (`localhost:5434`).
- Banco de testes: `greener_test`, com as 3 migrations aplicadas.
- Data da execução: 17/11/2026.
- Next.js atualizado de `16.4.0` para `16.4.6`.

### Comandos de verificação

```bash
# Subir o PostgreSQL
docker compose up -d postgres

# Preparar o banco de testes
docker compose exec -T postgres psql -U greener -d greener \
  -c "CREATE DATABASE greener_test;"

cd backend
DATABASE_URL="postgresql://greener:greener_dev@localhost:5434/greener_test?schema=public" \
  npx prisma migrate deploy

# Backend
npm run build
npm run lint
DATABASE_URL_TEST="postgresql://greener:greener_dev@localhost:5434/greener_test?schema=public" \
  npm test
DATABASE_URL_TEST="postgresql://greener:greener_dev@localhost:5434/greener_test?schema=public" \
  npm run test:e2e

# Frontend
cd ../frontend
npm run build
npm run lint
```

### Resultados

| Verificação | Resultado |
|-------------|-----------|
| `npm run build` (backend) | ✅ OK — `prisma generate` + `nest build` concluídos |
| `npm run lint` (backend) | ✅ 0 erros, 1 warning — `AgregadorModule` importado e não usado em `app.module.ts` |
| `npm test` (backend) | ✅ 61/61 testes em 15 arquivos (6,76 s) |
| `npm run test:e2e` (backend) | ✅ 1/1 teste em 1 arquivo |
| `npm run build` (frontend) | ✅ OK — build do Next.js 16.4.6 concluído |
| `npm run lint` (frontend) | ✅ 0 erros, 0 warnings |

### Saída resumida dos testes

```text
Test Files  15 passed (15)
     Tests  61 passed (61)
```

```text
Test Files  1 passed (1)
     Tests  1 passed (1)
```

### Evidências de UI/UX

- `docs/atividade-ui-ux/ATIVIDADE_UI_UX.md`
- Prints: `01-landing-page.png`, `02-login.png`, `03-dashboard-indicadores-graficos.png`, `04-dashboard-completo.png`, `05-configuracoes.png`
- Protótipo: [Figma do GreenER](https://www.figma.com/design/q8Zd81ZqRhZyYqby7jBFwK/Untitled?node-id=17-74&t=htUJCF3jCncI5bd5-1)

### Links de código

- [Greener no GitHub](https://github.com/devmaster-organizations/greener)
- [Backend](https://github.com/devmaster-organizations/greener/tree/develop/backend)
- [Frontend](https://github.com/devmaster-organizations/greener/tree/develop/frontend)
- [Infra e documentação](https://github.com/devmaster-organizations/greener/tree/develop)

---

## 🔧 Manutenção Pós-Sprint (17/11/2026)

Após o encerramento da Sprint 2, foram aplicadas as seguintes correções:

| Item | Alteração |
|------|-----------|
| Next.js | Atualizado de `16.4.0` para `16.4.6`, removendo o aviso de vulnerabilidade conhecida. |
| `eslint-config-next` | Atualizado de `16.4.0` para `16.4.6`. |
| Lint do frontend | `<a href="/">` substituído por `Link` na `Sidebar.tsx` e removido import não utilizado em `page.tsx`. |
| Resultado | `npm run build` e `npm run lint` do frontend passaram sem erros. |

---

## ⚠️ Pendências para a Sprint 3

| Item | Descrição | Motivo |
|------|-----------|--------|
| RF11 | Atualização automática do dashboard | Sem polling/WebSocket no frontend |
| RF14 | Ranking com seleção de período e indicador | Endpoint existe, mas sem tela dedicada |
| RF15 | Comparação entre serviços | PR #104 ainda aberto |
| RF16 | Guards JWT e configuração persistida | Apenas login; `/configuracoes` ainda simulada |
| RNF03 | Exibir intervalo e última atualização na UI | Não implementado |
| RNF06 | Remover segredos placeholder (`YOUR_APP_KEY`, `JWT_SECRET`) | Valores default ainda no código |
| RNF08 | Documentar API e Worker | Depende do merge do PR #101 |
| RP02 | DTOs com `class-validator` | Interfaces TypeScript sem validação declarativa |
| RP08 | Backlog priorizado no repositório | `docs/backlog-greener.md` está em branch não mergeada |
| Testes frontend | Configurar testes automatizados no frontend | Projeto não possui suíte de testes no frontend |
| — | Tela de Serviços | Branch `feat/services_filter` sem PR |
| — | Modal de comparações | Branch `feat/tela-comparacoes-servicos` sem PR |

---

## 🔄 Retrospectiva da Sprint 2

### O que funcionou

- A API REST permitiu substituir os dados simulados do dashboard por dados reais do PostgreSQL.
- A autenticação JWT foi entregue de ponta a ponta: migration de usuários, backend e login no frontend.
- A proteção da rota `/dashboard` via cookie e `proxy.ts` melhorou o fluxo de acesso.
- O dashboard passou a reutilizar os endpoints de indicadores, histórico, impacto por serviço, coletas e serviços.
- O mapa Leaflet foi conectado aos dados reais de localização dos serviços.
- A documentação de UI/UX com prints e o link do Figma ampliaram as evidências de IHC.
- O frontend foi incluído no Docker Compose, permitindo subir a stack completa com um comando.
- O backend passou em build, lint (com um warning) e 61 testes automatizados.

### O que melhorar

- Os PRs #34 e #35 foram mergeados no mesmo momento, no fim do período, concentrando a integração.
- O PR #101 permaneceu aberto com documentação e correções importantes do Worker.
- A tela de Serviços e a página de Comparações não foram mergeadas dentro da sprint.
- O dashboard ainda não atualiza automaticamente (RF11) e não há indicador de última atualização.
- O ranking não permite alternar entre energia e CO₂e nem selecionar período (RF14).
- Ainda existem credenciais placeholder no `AppModule` (`YOUR_APP_KEY`/`YOUR_APP_SECRET`) e `JWT_SECRET` padrão (RNF06).
- O lint do frontend falhava com um erro de navegação (`<a>` em vez de `Link`) e um import não utilizado; ambos foram corrigidos na manutenção pós-sprint.
- A versão do Next.js estava afetada por uma vulnerabilidade conhecida; foi atualizada para `16.4.6` na manutenção pós-sprint.
- Não há CI configurado para lint, testes e build.
- A branch `develop` ficou atrás da `main`, o que dificultou a leitura do estado real do código.
- Não foram registradas sprint reviews formais.
