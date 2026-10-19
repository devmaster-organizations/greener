# GreenER

Projeto acadêmico ABP desenvolvido pela equipe DevMaster.

O GreenER tem como objetivo monitorar serviços de software e estimar
seu consumo energético e suas emissões de CO₂ equivalente (CO₂e)
a partir de métricas operacionais.

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

A visualização (dashboard, ranking e comparação) e a autenticação
serão desenvolvidas nas próximas entregas.

## Executar localmente

### Stack completa (Docker Compose)

Na raiz do repositório, sobe o PostgreSQL, aplica as migrations e inicia o
backend e o Worker. O Worker usa a **mesma imagem** do backend, porém com
`command` diferente (`node dist/worker/main.js`) e **sem expor porta HTTP**:

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f worker
```

O frontend ainda não está containerizado nesta etapa.

### Backend

Consulte o [guia do backend](backend/README.md) para instalar
as dependências, configurar o ambiente, preparar o banco e executar os testes.

### Frontend

Na pasta `frontend`:

```bash
npm ci
npm run dev
```

A interface estará disponível em http://localhost:3000.

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