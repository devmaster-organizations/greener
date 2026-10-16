# Síntese — Worker do GreenER

Resumo para o grupo sobre o que é o Worker, o que ele faz e o que já foi
implementado nesta entrega.

## Em uma frase

O Worker é o **motor de monitoramento** do GreenER: um serviço de background,
isolado em seu próprio container, que descobre serviços, coleta métricas,
calcula energia e CO₂e e persiste o histórico — mantendo o dashboard atualizado
sozinho.

## O que ele faz (a cada ciclo)

1. **Descobre** os serviços no Agregador (`GET /services`).
2. **Coleta** as métricas de cada um (`GET /metrics/{id}`).
3. **Consulta** a intensidade de carbono da região (`Carbon API`).
4. **Calcula** potência, energia e emissão de CO₂e.
5. **Persiste** a coleta no histórico (PostgreSQL).
6. **Reclassifica** o estado: `ATIVO`, `INDISPONIVEL`, `SEM_METRICAS` ou `REMOVIDO`.

## Como ele se conecta ao projeto

- **PostgreSQL** — o Worker **escreve**, o backend **lê**. É a conexão principal.
- **APIs externas** — só o Worker consome o Agregador e a Carbon API.
- **Backend/Frontend** — o Worker **não fala HTTP** com eles; não expõe porta.

No Docker, backend e Worker usam a **mesma imagem**, mudando só o comando:
`node dist/main.js` (backend) e `node dist/worker/main.js` (worker).

## Estados de um serviço

| Estado | Quando acontece |
|---|---|
| `ATIVO` | Listado e retornando métricas (HTTP 200). |
| `SEM_METRICAS` | Listado, mas sem métricas (HTTP 404). |
| `INDISPONIVEL` | Listado, mas indisponível (HTTP 500) ou falha de rede. |
| `REMOVIDO` | Deixou de aparecer em `/services`. |

## Fórmulas usadas

```
potência_W  = (cpu_percent/100)·100 + memory_gb·0,375 + disk_gb·0,01 + network_gb·0,02
energia_kWh = potência_W · (intervalo_segundos / 3600) / 1000
CO₂e_g      = energia_kWh · intensidade_carbono(gCO₂e/kWh)
```

## O que já está pronto (nesta entrega)

- Modelo e persistência de **coletas** (histórico) no PostgreSQL.
- Cliente do **Agregador** e cliente da **Carbon API** (com cache por região).
- Módulo de **cálculo ambiental** (com testes unitários).
- **Serviço de monitoramento** com agendamento e proteção contra sobreposição.
- **Entrypoint do Worker** (`worker/main.ts`) e módulo próprio (`WorkerModule`).
- Dependências do Prisma declaradas e configuradas corretamente.
- Testes: **21 aprovados** (unitários + integração + e2e).

Validação real: o Worker rodou e persistiu **7 serviços** e **28 coletas**,
com estados e cálculos corretos por região.

## Como rodar

O Worker roda em **container próprio**. Na raiz do repositório:

```bash
docker compose up -d --build
docker compose logs -f worker
```

Isso sobe o PostgreSQL, aplica as migrations e inicia o backend e o Worker. O
Worker usa a mesma imagem do backend, mas com `command` diferente
(`node dist/worker/main.js`) e **sem porta HTTP**.

Alternativa sem container (na pasta `backend`): `npm run start:worker`.
O intervalo de coleta é configurável por `COLETA_INTERVALO_MS` (padrão 30000 ms).

## Requisitos do desafio atendidos

RF01, RF02, RF03, RF04, RF05, RF06, RF07, RF10, RNF03, RNF05, RNF07 e a base do
RP05 (container). Ficam para as próximas entregas: endpoints de leitura
(RF08, RF09, RF12–RF15), autenticação (RF16) e o consumo pelo frontend.

## Próximos passos

1. Endpoints de leitura no backend (dashboard, ranking, comparação).
2. Frontend consumindo os indicadores (e seu container).
3. Tratar as pendências anotadas em `OBSERVACOES.md` (AppModule e observe).
