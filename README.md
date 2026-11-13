# GreenER

Projeto acadêmico ABP desenvolvido pela equipe DevMaster.

O GreenER tem como objetivo monitorar serviços de software e estimar
seu consumo energético e suas emissões de CO₂ equivalente (CO₂e)
a partir de métricas operacionais.

# Figma

Link: https://www.figma.com/design/q8Zd81ZqRhZyYqby7jBFwK/Untitled?node-id=17-74&t=htUJCF3jCncI5bd5-1

## Funcionamento previsto

1. O backend consulta o Agregador de Métricas para descobrir os serviços disponíveis.
2. Os serviços descobertos são registrados no PostgreSQL.
3. As métricas de cada serviço são coletadas periodicamente.
4. O sistema utiliza essas métricas para estimar consumo energético e emissões de CO₂e.
5. As coletas e os resultados são armazenados para consulta histórica.
6. O frontend apresenta indicadores, comparação de serviços e visualização geográfica.

O monitoramento deverá reconhecer novos serviços, remoções e retornos,
preservando o histórico. Também deverá distinguir serviços indisponíveis
de serviços ativos que não exportam métricas.

Os valores de energia e emissões são estimativas, dependentes das
fórmulas, dos fatores e das métricas utilizados.

## Funcionalidades planejadas

- Descoberta automática de serviços.
- Monitoramento dinâmico e coleta periódica de métricas.
- Identificação de indisponibilidade e ausência de métricas.
- Estimativas de consumo energético e emissões de CO₂e.
- Dashboard operacional.
- Histórico e comparação entre serviços.
- Autenticação e configuração do monitoramento.
- Visualização geográfica dos serviços.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js e TypeScript |
| Backend | NestJS e TypeScript |
| Persistência | Prisma ORM |
| Banco de dados | PostgreSQL |
| Ambiente local | Docker Compose |
| Testes do backend | Vitest |

## Estrutura do repositório

| Pasta ou arquivo | Responsabilidade |
|---|---|
| `frontend/` | Interface web desenvolvida em Next.js. |
| `backend/` | API, integrações, regras do sistema e persistência. |
| `backend/prisma/` | Schema do banco e migrations. |
| `backend/src/prisma/` | Integração do Prisma com o NestJS. |
| `backend/src/worker/` | Entrypoint do Worker (coleta em background, sem HTTP). |
| `request/` | Requisições de referência para as APIs externas. |
| `compose.yml` | Configuração dos containers (PostgreSQL, migrations, backend e Worker). |

## Estado atual

- Estrutura inicial do frontend e backend criada.
- PostgreSQL configurado para desenvolvimento local.
- Prisma integrado ao NestJS.
- Modelo inicial de serviços e migration criados.
- Teste de integração da conexão com PostgreSQL implementado.
- Worker de coleta implementado: descoberta de serviços, coleta de métricas,
  cálculo de energia e CO₂e, persistência do histórico e classificação de estado.
- Execução containerizada: PostgreSQL, migrations, backend e Worker.

O dashboard ainda utiliza dados simulados no frontend. A autenticação
de login já está integrada à API (`POST /auth/login`).

## Executar localmente

### Stack completa (Docker Compose) — jeito recomendado

Na raiz do repositório, **um único comando** sobe tudo: PostgreSQL, aplica as
migrations, inicia o backend, o Worker e o frontend:

```bash
docker compose up -d --build
```

| Serviço | O que faz | Endereço |
|---|---|---|
| `frontend` | Next.js | http://localhost:3000 |
| `backend` | API REST (NestJS) | http://localhost:3001 |
| `worker` | Coleta em background (sem porta) | — |
| `migrate` | Aplica migrations e encerra | — |
| `postgres` | PostgreSQL 16 | localhost:5434 |

Comandos úteis:

```bash
docker compose ps                  # status dos containers
docker compose logs -f worker      # acompanhar os ciclos de coleta (a cada 30s)
docker compose logs -f backend     # logs da API
docker compose down                # para tudo (mantém os dados)
docker compose down -v             # para tudo e apaga o banco
docker compose up -d --build       # sobe de novo após mudanças
```

O Worker usa a **mesma imagem** do backend, porém com `command` diferente
(`node dist/worker/main.js`) e **sem expor porta HTTP**. Ele consome o
Agregador de Métricas e a API de Carbono externos, portanto precisa de
acesso à internet para coletar dados.

Para conferir se está tudo funcionando:

```bash
curl localhost:3001/servicos            # serviços descobertos pelo Worker
curl localhost:3001/dashboard/indicadores  # energia, CO₂e e contagens
```

### Backend (desenvolvimento, fora do Docker)

Consulte o [guia do backend](backend/README.md) para instalar
as dependências, configurar o ambiente, preparar o banco e executar os testes.

### Frontend (desenvolvimento, fora do Docker)

Na pasta `frontend` (com o backend acessível em `http://localhost:3001`):

```bash
npm ci
npm run dev
```

A interface estará disponível em http://localhost:3000.

Usuário padrão criado pelas migrations:

```text
E-mail: admin@greener.com
Senha:  greener123
```

### Endereços locais

| Componente | Endereço |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:3001 |
| PostgreSQL | localhost:5434 |
| Worker | sem porta (processo de background em container) |

As portas devem corresponder à configuração local do projeto.

## Equipe

Preencha os nomes, perfis e responsabilidades acordadas pela equipe.
As responsabilidades indicam o foco de cada integrante e podem ser compartilhadas.

| Integrante | Papel | Responsabilidades | GitHub |
|---|---|---|---|
| Caio Julião | Desenvolvedor | Desenvolvedor | [Github](https://github.com/caiao93guitar) |
| Lucas dos Santos Ribeiro | Desenvolvedor | A definir | [Github](https://github.com/LucassantosR25) |
| Luis Gustavo | Desenvolvedor | Desenvolvedor | [Github](https://github.com/LuisGustavo9) |
| Jocelio Gomes Silva | Desenvolvedor | Desenvolvedor | [Github](https://github.com/Git-Jocelio) |
| Ricardo Ladeira | Scrum Master | Scrum Master | [Github](https://github.com/rladeiraFatec) |
| Victor Ramos | Product Owner | Product Owner | [Github](https://github.com/victorramos887/victorramos887) |

## Organização do trabalho

O trabalho é organizado em épicos, histórias de usuário e tarefas
nas Issues do GitHub.

- Cada tarefa deve possuir escopo e critérios de aceite claros.
- As alterações são realizadas em branches e submetidas por pull requests.
- Cada pull request deve indicar a tarefa relacionada e as validações executadas.
- Testes acompanham a implementação dos comportamentos.
- TDD é aplicado pelo ciclo: teste falhando, implementação e refatoração.

## Documentação e planejamento

- [Issues do projeto](https://github.com/devmaster-organizations/greener/issues)
- [Pull requests](https://github.com/devmaster-organizations/greener/pulls)
- [Proposta do projeto](https://docs.unilaunch.org/share/x29w8jgwdb/p/greener-abp-2-semestre-b7FiqU6UC1)
