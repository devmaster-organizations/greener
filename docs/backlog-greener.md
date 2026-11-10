# Backlog GreenER — Epics, Features e Tasks

Documento de planejamento para importar no GitHub Projects do repositório
`devmaster-organizations/greener`.

Base da auditoria:

- Requisitos Funcionais RF01–RF15 da página pública do Docmost.
- RF16, RNFs e RPs referenciados nas issues `#5` e `#6`.
- Código atual do repositório, issues e PRs já existentes.
- Data da auditoria: 04/11/2026.

Observação: a página pública do Docmost contém apenas RF01–RF15. RF16, RNF01–RNF08
e RP01–RP09 não estão no share público; por isso, as tasks de RNF/RP usam os
critérios das issues e devem ser confirmadas com o documento privado da equipe.

## Status da importação

Importado em 04/11/2026 no GitHub Project GreenER (#9):

- Epics reutilizados: `#1`–`#7`.
- Features criadas: `#37`–`#57` (21).
- Tasks criadas: `#58`–`#100` (43).
- Os 64 itens novos estão no Project com `Status = BackLog`.
- Cada task é sub-issue da sua feature; cada feature é sub-issue do seu epic.
- Issues concluídas fechadas em 04/11/2026: `#10`, `#12`, `#13` e `#26`;
  `#28` foi fechada como duplicata de `#29`.
- Permanecem abertas `#9` e `#11` por pendências de RF02 e RF04.

## Como manter no GitHub Projects

1. Novas tasks devem ser criadas como sub-issues da feature correspondente.
2. O Project não possui campos de Tipo/RF/Prioridade/Área; use as labels
   `feature`, `task`, `sprint-3`, `P0`–`P2`, `rf-XX` e de área.
3. Atualize o `Status` do item no Project conforme o fluxo disponível:
   `BackLog`, `Todo`, `In progress` ou `Done`.
4. O responsável pela task deve abrir PR e solicitar review do responsável pelo
   repositório. Não fazer commit direto na branch principal.

## Prioridades

- **P0**: bloqueia o fechamento de um RF ou épico, ou corrige segurança,
  integridade de dados ou erro funcional.
- **P1**: necessário para concluir o requisito, mas não bloqueia uma demonstração.
- **P2**: qualidade, documentação, testes e melhoria de processo.

## Definition of Done padrão

Uma task só pode ser considerada concluída quando:

- [ ] O código compila e passa em lint/typecheck.
- [ ] Os testes existentes continuam passando.
- [ ] Foram adicionados testes para o comportamento novo ou corrigido.
- [ ] A documentação afetada foi atualizada.
- [ ] A issue foi atualizada com o link do PR.
- [ ] O PR foi revisado e aprovado pelo responsável do repositório.
- [ ] Não há segredos, tokens ou credenciais no código.

## Cobertura resumida dos requisitos

| Requisito | Status atual | Onde está / o que falta |
|---|---|---|
| RF01 — Descoberta de serviços | Concluído | Worker e cliente do Agregador. |
| RF02 — Monitoramento dinâmico | Parcial | Remoção e retorno implementados; serviços REMOVIDO ainda aparecem na tela de Serviços. |
| RF03 — Coleta periódica | Concluído | Worker com intervalo configurável. |
| RF04 — Variação das métricas | Parcial | Histórico existe; falta distinguir última coleta válida de tentativa com falha. |
| RF05 — Indisponibilidade | Concluído | Classificação e histórico; falta reforçar testes de ciclo de vida. |
| RF06 — Ausência de métricas | Concluído | Classificação SEM_METRICAS; falta reforçar testes de ciclo de vida. |
| RF07 — Cálculo individual | Concluído | Domínio de cálculo e testes. |
| RF08 — Indicadores agregados | Parcial | Faltam contagens por estado e semântica de dados ausentes. |
| RF09 — Dashboard operacional | Parcial | Dashboard existe; faltam atualização automática, última atualização, stale e mobile. |
| RF10 — Histórico de coletas | Concluído na base | Endpoint e gráfico existem; filtro de período e lacunas ficam no E04. |
| RF11 — Atualização contínua | Parcial | Worker é contínuo; frontend busca apenas uma vez. |
| RF12 — Localização dos serviços | Concluído | Exibida no dashboard e na tela de Serviços. |
| RF13 — Visualização geográfica | Concluído | Mapa implementado. |
| RF14 — Ranking de impacto | Parcial | Só ranking por CO₂e, sem opção por energia e sem período explícito. |
| RF15 — Comparação entre serviços | Pendente | Não existe endpoint nem tela. |
| RF16 — Autenticação/configuração | Parcial | Login JWT existe; configuração é mock, não há guard no backend e não há persistência. |

## Epics

| Epic | RFs relacionados | Status |
|---|---|---|
| E01 — Monitoramento de serviços | RF01–RF06 | Parcial |
| E02 — Estimativas ambientais e dados ausentes | RF07, RF08 | Parcial |
| E03 — Dashboard operacional e atualização contínua | RF09, RF11, RF12, RNF01–RNF04 | Parcial |
| E04 — Histórico, ranking e comparação | RF10, RF14, RF15 | Parcial |
| E05 — Autenticação e configuração | RF16, RNF06 | Parcial |
| E06 — Qualidade, documentação e avaliação | RNF07, RNF08, RP01–RP09 | Parcial |
| E07 — Visualização geográfica | RF13 | Concluído |

---

## E01 — Monitoramento de serviços

**RFs:** RF01, RF02, RF03, RF04, RF05, RF06.

**Status:** parcial. RF01, RF03, RF05 e RF06 estão implementados no worker. RF02
tem uma pendência de apresentação de serviços removidos. RF04 precisa distinguir
a última coleta válida da última tentativa de coleta.

**Objetivo do épico:** manter a relação de serviços atualizada, coletar métricas
periodicamente e preservar o histórico mesmo quando um serviço falha ou deixa de
existir.

**Critérios de conclusão do épico:**

- [ ] Serviços removidos não aparecem como monitorados nas telas operacionais.
- [ ] Inclusão, remoção e retorno de serviços são cobertos por testes.
- [ ] A última coleta válida é identificável na API e na interface.
- [ ] Falhas do Agregador não removem serviços.
- [ ] As issues US02–US06 refletem o estado real do código.

### F01.1 — Ciclo de vida e remoção de serviços (RF02)

**Status:** parcial.

**Descrição:** o backend já marca serviços ausentes como `REMOVIDO` e preserva o
histórico. Porém, `GET /servicos` retorna todos os serviços, inclusive removidos,
e a tela `/servicos` não filtra esse status. Hoje o problema não aparece porque
todos os serviços estão `ATIVO`, mas aparecerá quando houver remoção.

#### T01.1.1 — Filtrar serviços removidos na API e na tela de Serviços

- **Tipo:** Task
- **RF:** RF02
- **Sprint:** 3
- **Prioridade:** P0
- **Área:** backend + frontend
- **Depende de:** —

**O que fazer:**

1. Alterar `GET /servicos` para aceitar o query param
   `incluirRemovidos` (booleano, padrão `false`).
2. Ajustar `ServicosRepository.listar` para receber esse filtro. Quando
   `incluirRemovidos=false`, excluir `status = REMOVIDO`.
3. Manter `GET /servicos/:id` retornando serviços removidos, porque o detalhe
   pode ser necessário para consultar o histórico.
4. Atualizar `ServicosDashboard.buscarDados` para consumir a API já filtrada.
5. Remover ou manter o filtro client-side como proteção adicional, mas garantir
   que `ResumoServicos` não conte nem liste serviços removidos.
6. Adicionar testes de controller/repository para:
   - listagem padrão sem removidos;
   - listagem com `incluirRemovidos=true`;
   - detalhe de serviço removido ainda acessível.
7. Atualizar a documentação do endpoint.

**Critérios de aceite:**

- [ ] `GET /servicos` não retorna `REMOVIDO` por padrão.
- [ ] `GET /servicos?incluirRemovidos=true` retorna todos.
- [ ] A tela `/servicos` não conta nem exibe serviços removidos.
- [ ] O total “Serviços monitorados” ignora removidos.
- [ ] O detalhe de um serviço removido continua acessível para histórico.
- [ ] Testes cobrem os três cenários.

**Arquivos prováveis:** `backend/src/servicos/servicos.controller.ts`,
`backend/src/servicos/servicos.repository.ts`,
`frontend/src/components/servicos/ServicosDashboard.tsx`,
`frontend/src/components/servicos/ResumoServicos.tsx`.

#### T01.1.2 — Cobrir ciclo de vida dos serviços com testes de integração

- **Tipo:** Task
- **RF:** RF02, RF05, RF06
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** backend + testes
- **Depende de:** T01.1.1

**O que fazer:**

1. Criar testes de integração do `MonitoramentoService` cobrindo:
   - serviço novo é salvo e monitorado;
   - serviço que some é marcado como `REMOVIDO`;
   - serviço que retorna volta para `ATIVO`;
   - falha do Agregador não marca todos como removidos;
   - HTTP 404 gera `SEM_METRICAS`;
   - HTTP 500/timeout gera `INDISPONIVEL`;
   - uma falha individual não interrompe os demais serviços.
2. Usar mocks dos clients HTTP e um banco de teste ou repositórios em memória,
   seguindo o padrão dos testes existentes.
3. Atualizar as checklists das issues `#9`, `#10`, `#11`, `#12` e `#13`.
4. Atualizar a issue `#1` quando US02–US06 estiverem verificadas.

**Critérios de aceite:**

- [ ] Todos os cenários acima têm teste automatizado.
- [ ] Os testes passam em `npm run test` no backend.
- [ ] As issues US02–US06 refletem os critérios realmente atendidos.
- [ ] A issue E01 só é fechada após a verificação dos testes.

**Arquivos prováveis:** `backend/src/monitoramento/monitoramento.service.spec.ts`,
`backend/src/servicos/servicos.repository.integration.spec.ts`.

### F01.2 — Última coleta válida (RF04)

**Status:** parcial.

**Descrição:** `DetalheServico` usa `coletas[0]`, que pode ser uma tentativa com
falha e métricas nulas. O requisito pede para disponibilizar os dados da coleta
válida mais recente e não apresentar valores antigos como se fossem de uma coleta
que falhou.

#### T01.2.1 — Expor e exibir a última coleta válida

- **Tipo:** Task
- **RF:** RF04
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** backend + frontend
- **Depende de:** —

**O que fazer:**

1. Adicionar o filtro `apenasValidas` em `GET /coletas` (booleano, padrão
   `false`).
2. Considerar coleta válida aquela com `status = ATIVO` e métricas não nulas.
3. Garantir que `GET /coletas?servicoId=...&apenasValidas=true&limit=1` retorne
   a coleta válida mais recente.
4. Na tela de detalhe, buscar a última coleta válida e exibir:
   - “Última coleta válida: data/hora”;
   - os cards de métricas com os valores dessa coleta;
   - se a última tentativa falhou, mostrar um aviso separado com a data da
     tentativa e o erro, sem sobrescrever os dados válidos.
5. Na lista de serviços, usar a coleta válida mais recente para os valores de
   CPU/memória e manter “Última coleta” separada, se necessário.
6. Adicionar testes de controller e de componente.

**Critérios de aceite:**

- [ ] A API consegue retornar apenas coletas válidas.
- [ ] A tela diferencia “última tentativa” de “última coleta válida”.
- [ ] Uma falha recente não apaga nem substitui os últimos valores válidos.
- [ ] A data/hora dos dados exibidos fica visível.
- [ ] Testes cobrem coleta válida, coleta com 404 e coleta com 500.

**Arquivos prováveis:** `backend/src/coletas/coletas.repository.ts`,
`backend/src/coletas/coletas.controller.ts`,
`frontend/src/components/servicos/DetalheServico.tsx`,
`frontend/src/components/servicos/ServicosDashboard.tsx`.

---

## E02 — Estimativas ambientais e dados ausentes

**RFs:** RF07, RF08.

**Status:** parcial. O cálculo individual está implementado e testado. Faltam a
semântica de dados ausentes, contagens por estado e documentação das premissas.

**Objetivo do épico:** disponibilizar indicadores individuais e consolidados sem
transformar ausência de dados em zero.

**Critérios de conclusão do épico:**

- [ ] Dados ausentes são representados como ausentes, não como zero.
- [ ] Os indicadores agregados informam a quantidade de serviços por estado.
- [ ] As fórmulas, unidades, premissas e limitações estão documentadas.
- [ ] As regras de cálculo continuam separadas dos controllers e com testes.

### F02.1 — Semântica de dados ausentes (RF07, RF08)

**Status:** pendente.

**Descrição:** o backend usa `?? 0` e `COALESCE(..., 0)` em agregações. O
dashboard também usa `impacto?.energiaKwh ?? 0` e `impacto?.co2eG ?? 0`. Isso
transforma falha de coleta ou ausência de carbon intensity em consumo/emissão
zero, contrariando o critério “dados ausentes não são apresentados como zero”.

#### T02.1.1 — Preservar `null` nas agregações do backend

- **Tipo:** Task
- **RF:** RF07, RF08
- **Sprint:** 3
- **Prioridade:** P0
- **Área:** backend
- **Depende de:** —

**O que fazer:**

1. Alterar `TotalColetas`, `ImpactoServico` e `ColetaPorDia` para aceitar
   `number | null` em energia e CO₂e.
2. Em `somarTotais` e `agruparPorServico`, não converter `null` para zero.
3. Em `co2ePorDia`, remover `COALESCE(..., 0)` e retornar `null` quando a soma
   do dia for nula.
4. Manter no `WHERE` apenas dias que tenham ao menos um valor não nulo.
5. Atualizar `IndicadoresResponse` e os tipos do frontend.
6. Ajustar testes existentes e adicionar casos com todos os valores nulos.
7. Documentar no contrato da API que `null` significa “sem dado”, diferente de
   zero.

**Critérios de aceite:**

- [ ] Agregações retornam `null` quando não há dados.
- [ ] Zero real continua retornando `0`.
- [ ] Dias sem dados não aparecem como zero no histórico.
- [ ] Testes cobrem mistura de valores nulos e não nulos.
- [ ] A alteração de contrato está documentada.

**Arquivos prováveis:** `backend/src/coletas/coletas.repository.ts`,
`backend/src/dashboard/dashboard.controller.ts`,
`frontend/src/components/dashboard/*.tsx`,
`frontend/src/components/servicos/*.tsx`.

#### T02.1.2 — Exibir ausência de dados corretamente no frontend

- **Tipo:** Task
- **RF:** RF07, RF08
- **Sprint:** 3
- **Prioridade:** P0
- **Área:** frontend
- **Depende de:** T02.1.1

**O que fazer:**

1. Remover os fallbacks `?? 0` de `ServicosMonitorados` e de qualquer outro
   componente que transforme impacto ausente em zero.
2. Criar uma função/componente único para exibir números opcionais:
   `—` ou “Sem dados” quando `null`/`undefined`.
3. Aplicar o padrão em:
   - cards de energia e CO₂e;
   - tabela de serviços do dashboard;
   - tabela e ranking da tela de Serviços;
   - gráficos de histórico e impacto por serviço.
4. Adicionar testes de componente para os estados `null`, zero e valor válido.

**Critérios de aceite:**

- [ ] Nenhum componente exibe zero quando o dado é ausente.
- [ ] Zero real continua sendo exibido como zero.
- [ ] Gráficos não inventam pontos zero para dias sem dados.
- [ ] Testes cobrem os três estados.

**Arquivos prováveis:** `frontend/src/lib/formatacao.ts`,
`frontend/src/components/dashboard/ServicosMonitorados.tsx`,
`frontend/src/components/servicos/ResumoServicos.tsx`,
`frontend/src/components/dashboard/HistoricoImpacto.tsx`,
`frontend/src/components/dashboard/ImpactoPorServico.tsx`.

### F02.2 — Indicadores por estado (RF08)

**Status:** pendente.

**Descrição:** `GET /dashboard/indicadores` retorna apenas `servicosMonitorados`
e `servicosIndisponiveis`. O requisito pede a consolidação da quantidade de
serviços por estado, incluindo ativos e sem métricas.

#### T02.2.1 — Adicionar contagens por estado na API

- **Tipo:** Task
- **RF:** RF08
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** backend
- **Depende de:** —

**O que fazer:**

1. Adicionar ao `ServicosRepository` métodos para contar:
   - `ATIVO`;
   - `INDISPONIVEL`;
   - `SEM_METRICAS`;
   - `REMOVIDO` (se fizer sentido para auditoria).
2. Estender `IndicadoresResponse` com:
   - `servicosAtivos`;
   - `servicosSemMetricas`;
   - `servicosRemovidos` (opcional, documentar).
3. Atualizar `DashboardController.indicadores` para retornar os novos campos.
4. Adicionar testes de controller/repository.
5. Atualizar a documentação do endpoint.

**Critérios de aceite:**

- [ ] A API retorna a contagem de cada estado.
- [ ] Serviços removidos não entram em “monitorados”.
- [ ] Testes cobrem cada estado.
- [ ] O contrato da API está documentado.

**Arquivos prováveis:** `backend/src/servicos/servicos.repository.ts`,
`backend/src/dashboard/dashboard.controller.ts`.

#### T02.2.2 — Exibir contagens por estado no dashboard e na tela de Serviços

- **Tipo:** Task
- **RF:** RF08
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** frontend
- **Depende de:** T02.2.1

**O que fazer:**

1. Atualizar os tipos de `IndicadoresApi`.
2. Adicionar cards/indicadores para “Ativos” e “Sem métricas” na tela de
   Serviços, sem remover os cards existentes.
3. No dashboard, garantir que “Serviços monitorados” e “Indisponíveis” usem os
   novos campos quando disponíveis.
4. Exibir estado de carregamento, erro e ausência de dados.
5. Adicionar testes de componente.

**Critérios de aceite:**

- [ ] A tela mostra ativos, indisponíveis e sem métricas separadamente.
- [ ] Os totais batem com a API.
- [ ] Cards têm loading/erro/estado vazio.
- [ ] Testes cobrem a renderização dos novos cards.

**Arquivos prováveis:** `frontend/src/components/dashboard/Indicador*.tsx`,
`frontend/src/components/servicos/ResumoServicos.tsx`.

### F02.3 — Documentação do modelo de cálculo (RF07, RF08)

#### T02.3.1 — Documentar fórmulas, unidades, premissas e limitações

- **Tipo:** Task
- **RF:** RF07, RF08
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** docs
- **Depende de:** —

**O que fazer:**

1. Criar `docs/calculo-ambiental.md`.
2. Documentar:
   - fórmula de potência estimada;
   - fórmula de energia por intervalo;
   - unidade de energia (kWh);
   - uso da intensidade de carbono por região;
   - fórmula de CO₂e (g);
   - intervalo de coleta usado no cálculo;
   - o que acontece quando a API de carbono falha;
   - diferença entre zero real e dado ausente;
   - premissas e limitações.
3. Linkar o documento no `README.md` e no `docs/worker/README.md`.
4. Revisar os nomes de campos e unidades usados na API.

**Critérios de aceite:**

- [ ] O documento explica as fórmulas com unidades.
- [ ] As premissas e limitações estão explícitas.
- [ ] O tratamento de falha da API de carbono está documentado.
- [ ] O README aponta para o documento.

**Arquivos prováveis:** `docs/calculo-ambiental.md`, `README.md`,
`docs/worker/README.md`.

---

## E03 — Dashboard operacional e atualização contínua

**RFs:** RF09, RF11, RF12. **RNFs relacionados:** RNF01–RNF04.

**Status:** parcial. O dashboard e a tela de Serviços existem, mas o frontend
não atualiza sozinho, não mostra a data/hora da última atualização, não sinaliza
dados desatualizados e não funciona bem em telas móveis.

**Objetivo do épico:** apresentar uma visão operacional atualizada, responsiva e
com estados de carregamento, erro e ausência de dados bem definidos.

**Critérios de conclusão do épico:**

- [ ] Dashboard e Serviços atualizam automaticamente sem recarregar a página.
- [ ] A data/hora da última atualização fica visível.
- [ ] Falhas e dados desatualizados são sinalizados.
- [ ] A interface funciona em desktop e mobile.
- [ ] Estados são identificáveis por texto, não apenas por cor.
- [ ] A ausência de localização não impede a consulta.

### F03.1 — Atualização automática e indicador de atualização (RF09, RF11)

**Status:** pendente.

**Descrição:** todos os componentes do frontend fazem a busca inicial em
`useEffect` e nunca atualizam novamente. O worker coleta continuamente, mas a
interface só vê dados novos após recarregar a página.

#### T03.1.1 — Criar mecanismo de polling configurável

- **Tipo:** Task
- **RF:** RF09, RF11
- **Sprint:** 3
- **Prioridade:** P0
- **Área:** frontend
- **Depende de:** —

**O que fazer:**

1. Criar um hook reutilizável, por exemplo
   `frontend/src/hooks/useAtualizacaoAutomatica.ts`.
2. O hook deve:
   - receber uma função de busca e um intervalo;
   - executar a busca imediatamente;
   - repetir no intervalo configurado;
   - impedir requisições sobrepostas;
   - pausar quando a aba estiver oculta (`document.hidden`);
   - limpar timers no unmount;
   - expor `ultimaAtualizacao`, `atualizando` e `erro`.
3. Criar a variável `NEXT_PUBLIC_REFRESH_INTERVAL_MS` com padrão de 30000 ms.
4. Aplicar o hook nos componentes do dashboard e na tela de Serviços.
5. Evitar disparar todos os endpoints no mesmo instante; se necessário, usar um
   provider único para o dashboard ou escalonar os intervalos.
6. Adicionar testes com fake timers para: atualização, pausa em aba oculta,
   limpeza e não sobreposição.

**Critérios de aceite:**

- [ ] Os dados atualizam sem reload.
- [ ] Não há requisições sobrepostas.
- [ ] O timer é limpo ao desmontar.
- [ ] A aba oculta pausa as requisições.
- [ ] O intervalo é configurável por env.
- [ ] Testes com fake timers cobrem o comportamento.

**Arquivos prováveis:** `frontend/src/hooks/`,
`frontend/src/components/dashboard/*.tsx`,
`frontend/src/components/servicos/*.tsx`, `frontend/.env.example`,
`README.md`.

#### T03.1.2 — Exibir última atualização e sinalizar dados desatualizados

- **Tipo:** Task
- **RF:** RF09, RF11
- **Sprint:** 3
- **Prioridade:** P0
- **Área:** frontend
- **Depende de:** T03.1.1

**O que fazer:**

1. Exibir no topo do dashboard e da tela de Serviços:
   - “Atualizado às HH:MM:SS” quando a última busca foi bem-sucedida;
   - “Falha ao atualizar. Exibindo dados de HH:MM:SS” quando a busca falhar.
2. Manter os últimos dados válidos na tela durante uma falha, mas deixar claro
   que estão desatualizados.
3. Usar `aria-live="polite"` para anunciar mudanças de estado.
4. Não mostrar “atualizado agora” quando a requisição falhou.
5. Adicionar testes de componente para sucesso, erro e recuperação.

**Critérios de aceite:**

- [ ] A data/hora da última atualização fica visível.
- [ ] Uma falha é sinalizada sem apagar os dados anteriores.
- [ ] O estado de erro desaparece após uma atualização bem-sucedida.
- [ ] Leitores de tela recebem o anúncio de atualização.
- [ ] Testes cobrem os três estados.

**Arquivos prováveis:** `frontend/src/components/layout/Header.tsx`,
`frontend/src/app/dashboard/page.tsx`,
`frontend/src/app/servicos/page.tsx`.

### F03.2 — Responsividade e acessibilidade (RNF01–RNF04)

**Status:** pendente.

**Descrição:** a `Sidebar` tem largura fixa de 256 px e fica sempre visível. Em
um viewport de 360–390 px, sobra muito pouco espaço para o conteúdo. As tabelas
têm largura mínima de 700–980 px e dependem de scroll horizontal. O mapa e os
gráficos também precisam de ajuste.

#### T03.2.1 — Criar navegação mobile

- **Tipo:** Task
- **RF:** RF09
- **Sprint:** 3
- **Prioridade:** P0
- **Área:** frontend
- **Depende de:** —

**O que fazer:**

1. Em telas menores que `lg`, esconder a `Sidebar` fixa.
2. Adicionar um botão de menu (hambúrguer) no topo.
3. Implementar a sidebar como drawer com overlay.
4. Fechar o drawer ao clicar em um link, pressionar `Esc` ou clicar no overlay.
5. Bloquear o scroll do body enquanto o drawer estiver aberto.
6. Garantir foco visível e navegação por teclado.
7. Manter o layout desktop atual.
8. Testar em 360 px, 390 px, 768 px e 1280 px.

**Critérios de aceite:**

- [ ] Em mobile, o conteúdo ocupa a largura disponível.
- [ ] O menu abre e fecha por toque, teclado e `Esc`.
- [ ] O foco não fica preso atrás do overlay.
- [ ] O layout desktop não regride.
- [ ] Teste manual ou automatizado cobre os breakpoints.

**Arquivos prováveis:** `frontend/src/components/layout/Sidebar.tsx`,
`frontend/src/components/layout/Header.tsx`,
`frontend/src/app/dashboard/page.tsx`,
`frontend/src/app/servicos/page.tsx`,
`frontend/src/app/configuracoes/page.tsx`.

#### T03.2.2 — Ajustar conteúdo para mobile

- **Tipo:** Task
- **RF:** RF09
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** frontend
- **Depende de:** T03.2.1

**O que fazer:**

1. Trocar `p-8` fixo por `p-4 sm:p-6 lg:p-8`.
2. Revisar grids de cards para 1 coluna em mobile e 2/4 em telas maiores.
3. Garantir scroll horizontal acessível nas tabelas, com indicador visual.
4. Ajustar altura dos gráficos e labels para não cortar.
5. Ajustar o mapa para altura mínima e largura total.
6. Revisar o cabeçalho de detalhe do serviço e os botões.
7. Testar em 360 px, 390 px, 768 px e 1280 px.

**Critérios de aceite:**

- [ ] Nenhum conteúdo essencial fica inacessível em 360 px.
- [ ] Tabelas têm scroll horizontal utilizável.
- [ ] Gráficos e mapa não estouram o container.
- [ ] Botões e selects têm área de toque adequada.
- [ ] Teste manual ou automatizado cobre os breakpoints.

**Arquivos prováveis:** `frontend/src/app/**/page.tsx`,
`frontend/src/components/**/*.tsx`.

#### T03.2.3 — Revisar acessibilidade do dashboard

- **Tipo:** Task
- **RF:** RF09
- **Sprint:** 3
- **Prioridade:** P2
- **Área:** frontend
- **Depende de:** T03.2.1, T03.2.2

**O que fazer:**

1. Garantir que todos os botões de ícone tenham `aria-label`.
2. Garantir foco visível em links, botões, selects e no mapa.
3. Adicionar `caption` ou `aria-label` nas tabelas.
4. Fornecer alternativa textual para gráficos (resumo ou tabela).
5. Verificar contraste de texto e badges.
6. Garantir que estados não dependem apenas de cor.
7. Rodar uma ferramenta de auditoria (axe, Lighthouse) e registrar os achados.
8. Corrigir os problemas encontrados e documentar o que ficou fora do escopo.

**Critérios de aceite:**

- [ ] Navegação principal funciona por teclado.
- [ ] Botões de ícone têm nome acessível.
- [ ] Tabelas e gráficos têm descrição textual.
- [ ] Contraste atende ao mínimo WCAG AA.
- [ ] Relatório de auditoria anexado à issue.

**Arquivos prováveis:** `frontend/src/components/**/*.tsx`,
`docs/acessibilidade.md`.

### F03.3 — Estados de UI padronizados (RF09)

#### T03.3.1 — Padronizar loading, erro e vazio

- **Tipo:** Task
- **RF:** RF09
- **Sprint:** 3
- **Prioridade:** P2
- **Área:** frontend
- **Depende de:** —

**O que fazer:**

1. Criar componentes reutilizáveis para:
   - carregando;
   - erro com botão “Tentar novamente”;
   - vazio (“Sem dados no período”).
2. Aplicar nos cards, gráficos, tabelas, mapa e detalhe do serviço.
3. Garantir que o erro não apague os últimos dados válidos.
4. Adicionar testes de componente para cada estado.

**Critérios de aceite:**

- [ ] Todos os blocos usam o mesmo padrão visual e de texto.
- [ ] O botão de retry funciona em todos os blocos.
- [ ] Erro e vazio são distintos.
- [ ] Testes cobrem os estados.

**Arquivos prováveis:** `frontend/src/components/ui/`,
`frontend/src/components/**/*.tsx`.

---

## E04 — Histórico, ranking e comparação

**RFs:** RF10, RF14, RF15.

**Status:** parcial. O histórico existe, mas não há filtro de período na
interface, o ranking só usa CO₂e, não há comparação e não há detecção de lacunas.

**Objetivo do épico:** permitir análise temporal, ranking configurável,
comparação entre serviços e identificação de períodos incompletos.

**Critérios de conclusão do épico:**

- [ ] O usuário consegue consultar um período definido.
- [ ] O ranking informa período e indicador.
- [ ] É possível comparar dois ou mais serviços no mesmo período.
- [ ] Lacunas de coleta são identificadas.
- [ ] Períodos sem dados mostram mensagem adequada.

### F04.1 — Filtro de período reutilizável (RF10, RF14, RF15)

**Status:** pendente.

**Descrição:** o backend aceita `de` e `ate` em `/dashboard/indicadores`,
`/dashboard/historico`, `/dashboard/impacto-por-servico` e `/coletas`, mas o
frontend nunca envia esses parâmetros. Não há controle de período na interface.

#### T04.1.1 — Criar componente de filtro de período

- **Tipo:** Task
- **RF:** RF10, RF14, RF15
- **Sprint:** 3
- **Prioridade:** P0
- **Área:** frontend
- **Depende de:** —

**O que fazer:**

1. Criar `frontend/src/components/filtros/FiltroPeriodo.tsx`.
2. Oferecer presets: últimas 24 horas, últimos 7 dias, últimos 30 dias e
   período personalizado.
3. Permitir informar data inicial e final.
4. Validar `de <= ate` e impedir datas futuras.
5. Refletir o período na URL (`?de=...&ate=...`) para permitir compartilhar.
6. Criar um contexto/provider para que todos os blocos do dashboard usem o mesmo
   período.
7. Passar `de`/`ate` para os endpoints.
8. Exibir o período selecionado nos títulos dos gráficos e do ranking.
9. Adicionar testes de componente e de integração.

**Critérios de aceite:**

- [ ] O usuário consegue selecionar um período.
- [ ] Todos os blocos do dashboard usam o mesmo período.
- [ ] A URL preserva o período.
- [ ] Datas inválidas são rejeitadas com mensagem.
- [ ] Gráficos e ranking mostram o período usado.
- [ ] Testes cobrem presets e período personalizado.

**Arquivos prováveis:** `frontend/src/components/filtros/`,
`frontend/src/app/dashboard/page.tsx`,
`frontend/src/app/servicos/page.tsx`,
`frontend/src/lib/api.ts`.

#### T04.1.2 — Validar e testar o período no backend

- **Tipo:** Task
- **RF:** RF10, RF14, RF15
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** backend
- **Depende de:** —

**O que fazer:**

1. Garantir que `parseData` rejeite datas inválidas.
2. Rejeitar `de > ate` com `BadRequestException`.
3. Definir e documentar o comportamento quando apenas `de` ou apenas `ate` for
   enviado.
4. Documentar o timezone usado nas agregações (UTC).
5. Adicionar testes de controller para:
   - período válido;
   - data inválida;
   - `de` maior que `ate`;
   - período sem dados.
6. Atualizar a documentação dos endpoints.

**Critérios de aceite:**

- [ ] Datas inválidas retornam 400.
- [ ] `de > ate` retorna 400.
- [ ] O comportamento com apenas um limite está documentado.
- [ ] Testes cobrem os cenários.
- [ ] A documentação da API está atualizada.

**Arquivos prováveis:** `backend/src/coletas/coletas.controller.ts`,
`backend/src/dashboard/dashboard.controller.ts`.

### F04.2 — Ranking configurável (RF14)

**Status:** pendente.

**Descrição:** o ranking atual em `ResumoServicos` filtra `co2eG > 0`, ordena por
CO₂e e mostra os 6 primeiros. Não há opção por energia nem indicação de período.

#### T04.2.1 — Permitir ordenação do ranking por energia ou CO₂e

- **Tipo:** Task
- **RF:** RF14
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** backend
- **Depende de:** T04.1.2

**O que fazer:**

1. Estender `GET /dashboard/impacto-por-servico` com o parâmetro
   `ordenarPor=energia|co2e` (padrão `co2e`).
2. Validar o valor e retornar 400 para opções inválidas.
3. Ordenar no backend pelo campo escolhido.
4. Manter os dois valores (`energiaKwh` e `co2eG`) na resposta.
5. Adicionar testes para ordenação por energia, por CO₂e e valor inválido.
6. Atualizar a documentação do endpoint.

**Critérios de aceite:**

- [ ] O endpoint aceita `ordenarPor=energia` e `ordenarPor=co2e`.
- [ ] A ordenação é feita no backend.
- [ ] Valor inválido retorna 400.
- [ ] Testes cobrem as duas ordenações.
- [ ] A documentação está atualizada.

**Arquivos prováveis:** `backend/src/dashboard/dashboard.controller.ts`,
`backend/src/coletas/coletas.repository.ts`.

#### T04.2.2 — Adicionar seletor de indicador e período ao ranking

- **Tipo:** Task
- **RF:** RF14
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** frontend
- **Depende de:** T04.1.1, T04.2.1

**O que fazer:**

1. Adicionar um select “Ordenar por: CO₂e / Energia”.
2. Passar `ordenarPor` e `de`/`ate` para a API.
3. Alterar o título para deixar claro o indicador e o período:
   “Maiores emissões de CO₂e — últimos 7 dias”.
4. Exibir a unidade correta (g CO₂e ou kWh).
5. Tratar loading, erro, vazio e dados ausentes.
6. Adicionar testes de componente.

**Critérios de aceite:**

- [ ] O usuário alterna entre energia e CO₂e.
- [ ] O ranking usa o período selecionado.
- [ ] O título e a unidade refletem o indicador.
- [ ] Estados de loading/erro/vazio funcionam.
- [ ] Testes cobrem a troca de indicador.

**Arquivos prováveis:** `frontend/src/components/servicos/ResumoServicos.tsx`,
`frontend/src/components/dashboard/ImpactoPorServico.tsx`.

### F04.3 — Comparação entre serviços (RF15)

**Status:** pendente.

**Descrição:** não existe endpoint nem tela para comparar dois ou mais serviços.
A comparação precisa usar o mesmo período para todos.

#### T04.3.1 — Criar endpoint de comparação entre serviços

- **Tipo:** Task
- **RF:** RF15
- **Sprint:** 3
- **Prioridade:** P0
- **Área:** backend
- **Depende de:** T04.1.2

**O que fazer:**

1. Criar `GET /dashboard/comparacao`.
2. Aceitar:
   - `servicos`: lista de IDs separada por vírgula, com no mínimo 2;
   - `de` e `ate`.
3. Validar:
   - no mínimo 2 serviços;
   - no máximo um limite definido (ex.: 10);
   - IDs existentes;
   - `de <= ate`.
4. Retornar, para cada serviço:
   - nome;
   - energia total;
   - CO₂e total;
   - CPU média/máxima;
   - memória média/máxima;
   - disco médio/máximo;
   - rede total;
   - quantidade de coletas válidas.
5. Usar exatamente o mesmo período para todos.
6. Retornar 400 para entrada inválida e 404 para serviço inexistente.
7. Adicionar testes de controller/service.
8. Documentar o contrato no `docs/api.md`.

**Critérios de aceite:**

- [ ] O endpoint aceita 2 ou mais serviços.
- [ ] Todos usam o mesmo período.
- [ ] Entradas inválidas retornam 400/404.
- [ ] Os dados retornados permitem comparar energia, CO₂e e recursos.
- [ ] Testes cobrem sucesso e erros.
- [ ] Contrato documentado.

**Arquivos prováveis:** `backend/src/dashboard/`,
`backend/src/coletas/coletas.repository.ts`.

#### T04.3.2 — Criar tela de comparação entre serviços

- **Tipo:** Task
- **RF:** RF15
- **Sprint:** 3
- **Prioridade:** P0
- **Área:** frontend
- **Depende de:** T04.1.1, T04.3.1

**O que fazer:**

1. Criar a rota `/comparacoes`.
2. Adicionar o link “Comparações” na `Sidebar`.
3. Criar multi-select de serviços (mínimo 2).
4. Reutilizar o `FiltroPeriodo`.
5. Exibir:
   - tabela comparativa;
   - gráfico de barras de energia;
   - gráfico de barras de CO₂e;
   - destaque para maior/menor consumo.
6. Mostrar loading, erro, vazio e aviso de período incompleto.
7. Adicionar testes de componente e um teste e2e básico.

**Critérios de aceite:**

- [ ] O usuário seleciona 2 ou mais serviços.
- [ ] A comparação usa o mesmo período.
- [ ] A tabela e os gráficos mostram os dados corretamente.
- [ ] A tela funciona em mobile.
- [ ] Estados de loading/erro/vazio estão implementados.
- [ ] Testes cobrem a seleção e a renderização.

**Arquivos prováveis:** `frontend/src/app/comparacoes/`,
`frontend/src/components/comparacoes/`,
`frontend/src/components/layout/Sidebar.tsx`.

### F04.4 — Identificação de lacunas de coleta (E04)

**Status:** pendente.

**Descrição:** o histórico retorna apenas dias com dados. Não há indicação de
quais períodos esperados não tiveram coleta, o que pode levar a interpretações
incorretas.

#### T04.4.1 — Detectar lacunas de coleta no backend

- **Tipo:** Task
- **RF:** RF10
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** backend
- **Depende de:** —

**O que fazer:**

1. Persistir o intervalo de coleta usado em cada coleta ou serviço. Hoje o worker
   recebe `intervaloColetaSegundos` da API, mas não o armazena.
2. Adicionar coluna/campo `intervaloSegundos` em `Coleta` ou `Servico` por meio
   de migration Prisma.
3. Atualizar o worker para gravar esse valor.
4. Criar um método que, para um serviço e período, calcule os intervalos
   esperados e identifique lacunas.
5. Expor lacunas em `GET /dashboard/historico` ou em um endpoint próprio.
6. Retornar também um indicador `completo: boolean`.
7. Adicionar testes com intervalo fixo e lacunas conhecidas.

**Critérios de aceite:**

- [ ] O intervalo de coleta fica persistido.
- [ ] A API identifica lacunas no período.
- [ ] O endpoint informa se o período está completo.
- [ ] Testes cobrem período completo e incompleto.
- [ ] A migration está versionada.

**Arquivos prováveis:** `backend/prisma/schema.prisma`,
`backend/src/monitoramento/monitoramento.service.ts`,
`backend/src/coletas/coletas.repository.ts`,
`backend/src/dashboard/dashboard.controller.ts`.

#### T04.4.2 — Exibir aviso de período incompleto no frontend

- **Tipo:** Task
- **RF:** RF10, RF14, RF15
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** frontend
- **Depende de:** T04.1.1, T04.4.1

**O que fazer:**

1. Atualizar os tipos da API para incluir lacunas e `completo`.
2. Exibir um aviso nos gráficos/ranking/comparação quando houver lacunas:
   “Período incompleto: X intervalos sem coleta”.
3. Não preencher lacunas com zero.
4. Mostrar mensagem específica quando o período não tiver nenhum dado.
5. Adicionar testes de componente.

**Critérios de aceite:**

- [ ] O aviso aparece quando há lacunas.
- [ ] O aviso não aparece em período completo.
- [ ] Lacunas não são convertidas em zero.
- [ ] Período vazio tem mensagem própria.
- [ ] Testes cobrem os estados.

**Arquivos prováveis:** `frontend/src/components/dashboard/HistoricoImpacto.tsx`,
`frontend/src/components/servicos/ResumoServicos.tsx`,
`frontend/src/components/comparacoes/`.

---

## E05 — Autenticação e configuração

**RFs:** RF16. **RNFs relacionados:** RNF06.

**Status:** parcial. O login JWT e o hash de senha existem. Não há guard nas
rotas do backend, não há persistência de configuração, a tela de configurações é
mock e a rota `/configuracoes` não está protegida no proxy.

**Objetivo do épico:** permitir que usuários autenticados configurem o
monitoramento e proteger as operações de alteração.

**Critérios de conclusão do épico:**

- [ ] O usuário autentica e recebe um JWT.
- [ ] Rotas de alteração exigem JWT válido.
- [ ] Tokens ausentes, inválidos ou expirados são rejeitados.
- [ ] Configurações são validadas, persistidas e aplicadas ao worker.
- [ ] Senhas não são armazenadas em texto puro.
- [ ] Segredos não estão no repositório.
- [ ] A tela de configurações usa a API real.

### F05.1 — Autorização JWT no backend (RF16, RNF06)

#### T05.1.1 — Implementar guard JWT e proteger rotas de alteração

- **Tipo:** Task
- **RF:** RF16
- **Sprint:** 3
- **Prioridade:** P0
- **Área:** backend
- **Depende de:** —

**O que fazer:**

1. Criar `JwtAuthGuard` usando `JwtService.verifyAsync`.
2. Criar o decorator `@Public()` para rotas que não exigem token, como
   `POST /auth/login` e health check.
3. Registrar o guard globalmente via `APP_GUARD` ou aplicá-lo explicitamente
   nas rotas de configuração.
4. Proteger:
   - `PUT /configuracoes`;
   - futuras rotas de alteração;
   - `GET /auth/me` (se criado).
5. Retornar 401 para token ausente, inválido ou expirado.
6. Anexar o usuário autenticado ao request.
7. Adicionar testes de guard:
   - sem token;
   - token inválido;
   - token expirado;
   - token válido.
8. Documentar quais rotas são públicas e quais são protegidas.

**Critérios de aceite:**

- [ ] Rotas de alteração retornam 401 sem token.
- [ ] Token válido permite a operação.
- [ ] Token inválido/expirado é rejeitado.
- [ ] Rotas públicas continuam acessíveis.
- [ ] Testes cobrem os quatro cenários.
- [ ] Documentação de rotas atualizada.

**Arquivos prováveis:** `backend/src/auth/`,
`backend/src/main.ts`, `backend/src/app.module.ts`.

#### T05.1.2 — Remover segredo JWT padrão do código

- **Tipo:** Task
- **RF:** RF16
- **Sprint:** 3
- **Prioridade:** P0
- **Área:** backend + docs
- **Depende de:** T05.1.1

**O que fazer:**

1. Remover o fallback `'greener-dev-secret'` de `AuthModule`.
2. Exigir `JWT_SECRET` no ambiente e falhar no boot se ele não existir.
3. Atualizar `.env.example`, `compose.yml` e documentação com instruções para
   gerar um segredo forte.
4. Garantir que nenhum segredo real esteja versionado.
5. Adicionar teste de configuração, se viável.

**Critérios de aceite:**

- [ ] O código não contém segredo JWT padrão.
- [ ] A aplicação não inicia sem `JWT_SECRET`.
- [ ] A documentação explica como configurar o segredo.
- [ ] Nenhum segredo real está no repositório.
- [ ] Testes/build passam com a variável configurada.

**Arquivos prováveis:** `backend/src/auth/auth.module.ts`,
`.env.example`, `compose.yml`, `README.md`.

### F05.2 — Persistência e aplicação das configurações (RF16)

#### T05.2.1 — Criar modelo, API e validação de configurações

- **Tipo:** Task
- **RF:** RF16
- **Sprint:** 3
- **Prioridade:** P0
- **Área:** backend
- **Depende de:** T05.1.1

**O que fazer:**

1. Criar o modelo Prisma `ConfiguracaoMonitoramento` com:
   - `id` (fixo ou singleton);
   - `intervaloColetaSegundos`;
   - `timeoutMs` (opcional, se fizer sentido);
   - `atualizadoEm`;
   - `atualizadoPor` (opcional).
2. Criar migration.
3. Criar repositório, service e controller:
   - `GET /configuracoes`;
   - `PUT /configuracoes`.
4. Validar:
   - intervalo inteiro entre 30 e 3600 segundos (ou faixa definida);
   - timeout positivo, se existir;
   - corpo inválido retorna 400.
5. Proteger `PUT` com o guard JWT.
6. Adicionar testes de service/controller.
7. Documentar o contrato.

**Critérios de aceite:**

- [ ] A configuração é persistida no banco.
- [ ] `GET` retorna a configuração atual.
- [ ] `PUT` valida e atualiza.
- [ ] `PUT` exige JWT.
- [ ] Valores inválidos retornam 400.
- [ ] Testes cobrem leitura, escrita e validação.
- [ ] Migration e documentação estão versionadas.

**Arquivos prováveis:** `backend/prisma/schema.prisma`,
`backend/src/configuracoes/`, `backend/src/auth/`.

#### T05.2.2 — Aplicar a configuração ao worker

- **Tipo:** Task
- **RF:** RF16
- **Sprint:** 3
- **Prioridade:** P0
- **Área:** backend
- **Depende de:** T05.2.1

**O que fazer:**

1. Fazer o worker ler a configuração persistida no início.
2. Usar `SchedulerRegistry` para recriar o intervalo quando a configuração
   mudar.
3. Manter `COLETA_INTERVALO_MS` como fallback quando não houver configuração.
4. Evitar sobreposição de ciclos durante a troca de intervalo.
5. Adicionar logs claros sobre o intervalo aplicado.
6. Adicionar testes com configuração inicial e atualização em tempo de execução.
7. Documentar a precedência: banco > variável de ambiente > padrão.

**Critérios de aceite:**

- [ ] O worker usa o intervalo persistido.
- [ ] Alterar a configuração muda o intervalo sem reiniciar o worker.
- [ ] O fallback por env continua funcionando.
- [ ] Não há ciclos sobrepostos.
- [ ] Testes cobrem a troca de intervalo.
- [ ] A precedência está documentada.

**Arquivos prováveis:** `backend/src/monitoramento/monitoramento.service.ts`,
`backend/src/configuracoes/`, `backend/src/worker/`.

### F05.3 — Frontend de autenticação e configuração (RF16)

#### T05.3.1 — Proteger `/configuracoes` e validar a sessão

- **Tipo:** Task
- **RF:** RF16
- **Sprint:** 3
- **Prioridade:** P0
- **Área:** frontend + backend
- **Depende de:** T05.1.1

**O que fazer:**

1. Adicionar `/configuracoes/:path*` ao matcher do `proxy.ts`.
2. Criar `GET /auth/me` no backend, protegido pelo guard, para validar o token.
3. No proxy, chamar `/auth/me` com o cookie e redirecionar para `/login` se a
   resposta for 401.
4. Não confiar apenas na presença do cookie.
5. Tratar indisponibilidade do backend sem criar loop de redirecionamento.
6. Adicionar teste e2e de acesso sem token e com token inválido.

**Critérios de aceite:**

- [ ] `/configuracoes` sem token redireciona para `/login`.
- [ ] Token inválido é rejeitado.
- [ ] Token válido permite acesso.
- [ ] O proxy não entra em loop quando o backend está fora.
- [ ] Teste e2e cobre os cenários.

**Arquivos prováveis:** `frontend/src/proxy.ts`,
`backend/src/auth/`, `frontend/src/lib/auth.ts`.

#### T05.3.2 — Integrar a tela de configurações com a API

- **Tipo:** Task
- **RF:** RF16
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** frontend
- **Depende de:** T05.2.1, T05.3.1

**O que fazer:**

1. Substituir o `alert` por chamadas reais a `GET /configuracoes` e
   `PUT /configuracoes`.
2. Carregar o valor atual ao abrir a tela.
3. Exibir loading, erro e sucesso.
4. Desabilitar o botão enquanto salva.
5. Validar o intervalo no cliente e mostrar mensagem clara.
6. Atualizar a mensagem de sucesso com o valor salvo.
7. Adicionar testes de componente.

**Critérios de aceite:**

- [ ] A tela carrega a configuração real.
- [ ] Salvar persiste via API.
- [ ] Erros são exibidos sem perder o valor digitado.
- [ ] O botão não permite duplo envio.
- [ ] Testes cobrem carregar, salvar e erro.

**Arquivos prováveis:** `frontend/src/app/configuracoes/page.tsx`,
`frontend/src/lib/api.ts`.

#### T05.3.3 — Adicionar logout e tratamento de 401

- **Tipo:** Task
- **RF:** RF16
- **Sprint:** 3
- **Prioridade:** P2
- **Área:** frontend
- **Depende de:** T05.3.1

**O que fazer:**

1. Exibir o usuário autenticado no menu.
2. Adicionar botão “Sair” que chama `logout()` e redireciona para `/login`.
3. Em `apiFetch`, tratar 401:
   - limpar sessão;
   - redirecionar para `/login`, evitando loop.
4. Adicionar teste de componente/e2e.

**Critérios de aceite:**

- [ ] O usuário consegue sair.
- [ ] Após logout, rotas protegidas redirecionam para login.
- [ ] Token expirado é tratado sem loop.
- [ ] Teste cobre logout e 401.

**Arquivos prováveis:** `frontend/src/lib/auth.ts`,
`frontend/src/lib/api.ts`, `frontend/src/components/layout/Sidebar.tsx`.

---

## E06 — Qualidade, documentação e avaliação

**RNFs/RPs:** RNF07, RNF08, RP01–RP09.

**Status:** parcial. O backend tem testes; o frontend não tem. A documentação
está desatualizada em pontos importantes. Não foi localizado registro de
avaliação de usabilidade com resultados nem de sprint reviews. O backend tem
controllers usando repositories diretamente em alguns módulos.

**Objetivo do épico:** garantir documentação executável, testes, evidências de
processo e padronização arquitetural.

**Critérios de conclusão do épico:**

- [ ] Documentação de execução, arquitetura, API e configuração está atualizada.
- [ ] Frontend tem testes automatizados.
- [ ] Há avaliação de usabilidade planejada, executada e documentada.
- [ ] Sprint reviews estão registradas.
- [ ] Controllers não acessam repositories diretamente.
- [ ] Issues antigas refletem o estado real do projeto.

### F06.1 — Documentação das sprints 1, 2 e 3

**Status:** pendente.

**Descrição:** criar documentos de sprint com o que foi feito, evidências e o que
ficou pendente. Usar como base os PRs e issues já existentes, mas confirmar datas
e escopo com o histórico do repositório.

#### T06.1.1 — Documentar a Sprint 1

- **Tipo:** Task
- **RF:** RNF08, RP01–RP09
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** docs
- **Depende de:** —

**O que fazer:**

1. Criar `docs/sprints/sprint-1.md`.
2. Incluir:
   - período da sprint (confirmar no board);
   - objetivo;
   - itens planejados;
   - itens entregues;
   - RFs/RNFs cobertos;
   - PRs e issues relacionadas;
   - evidências (links, prints, comandos, testes);
   - pendências;
   - retrospectiva (o que funcionou, o que melhorar).
3. Usar como base os PRs de ambiente, Prisma, persistência, worker e cliente do
   Agregador.
4. Não afirmar que um RF está concluído sem link de código/teste.
5. Revisar os links antes de fechar a task.

**Critérios de aceite:**

- [ ] O documento existe e segue o template.
- [ ] Contém o que foi feito e o que ficou pendente.
- [ ] Todos os links de PR/issue são válidos.
- [ ] Os RFs citados têm evidência.
- [ ] A retrospectiva está registrada.

**Arquivos prováveis:** `docs/sprints/sprint-1.md`.

#### T06.1.2 — Documentar a Sprint 2

- **Tipo:** Task
- **RF:** RNF08, RP01–RP09
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** docs
- **Depende de:** —

**O que fazer:**

1. Criar `docs/sprints/sprint-2.md`.
2. Incluir os mesmos tópicos da Sprint 1.
3. Usar como base:
   - API REST de serviços/coletas/dashboard;
   - login;
   - dashboard integrado;
   - mapa;
   - tela de Serviços.
4. Registrar o que foi entregue e o que ficou para a Sprint 3.
5. Incluir evidências de build, lint e testes.
6. Registrar a retrospectiva.

**Critérios de aceite:**

- [ ] O documento existe e segue o template.
- [ ] Contém o que foi feito e o que ficou pendente.
- [ ] Todos os links de PR/issue são válidos.
- [ ] Os RFs citados têm evidência.
- [ ] A retrospectiva está registrada.

**Arquivos prováveis:** `docs/sprints/sprint-2.md`.

#### T06.1.3 — Documentar a Sprint 3 e o plano de conclusão

- **Tipo:** Task
- **RF:** RNF08, RP01–RP09
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** docs
- **Depende de:** —

**O que fazer:**

1. Criar `docs/sprints/sprint-3.md`.
2. Registrar:
   - objetivo da sprint;
   - itens planejados;
   - o que já foi feito;
   - o que ainda falta (linkar este backlog);
   - riscos e dependências;
   - critérios de conclusão;
   - retrospectiva final.
3. Linkar as issues/tasks deste backlog.
4. Atualizar o documento ao final da sprint.
5. Registrar a sprint review com data, participantes, demonstração, feedback e
   ajustes no backlog.

**Critérios de aceite:**

- [ ] O documento existe e segue o template.
- [ ] O que foi feito e o que falta está claro.
- [ ] As pendências apontam para issues deste backlog.
- [ ] A sprint review está registrada.
- [ ] O documento é atualizado ao final da sprint.

**Arquivos prováveis:** `docs/sprints/sprint-3.md`.

### F06.2 — Testes automatizados e CI (RNF07)

**Status:** parcial. O backend tem Vitest; o frontend não tem suíte.

#### T06.2.1 — Configurar testes no frontend

- **Tipo:** Task
- **RF:** RNF07
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** frontend + testes
- **Depende de:** —

**O que fazer:**

1. Adicionar ao frontend:
   - `vitest`;
   - `@testing-library/react`;
   - `@testing-library/jest-dom`;
   - `jsdom`.
2. Criar `vitest.config.ts` e arquivo de setup.
3. Adicionar scripts `test`, `test:watch` e `test:cov`.
4. Criar testes iniciais para:
   - `formatarNumero`/`formatarDataHora`;
   - `ResumoServicos` com dados nulos;
   - `ServicosDashboard` em loading/erro/sucesso;
   - `FiltroPeriodo`;
   - hook de atualização automática.
5. Documentar como rodar os testes.

**Critérios de aceite:**

- [ ] `npm run test` funciona no frontend.
- [ ] Existem testes para os componentes/funções acima.
- [ ] Testes não dependem de API real.
- [ ] README do frontend explica os comandos.
- [ ] CI executa os testes.

**Arquivos prováveis:** `frontend/package.json`,
`frontend/vitest.config.ts`, `frontend/src/**/*.test.tsx`.

#### T06.2.2 — Criar testes e2e dos fluxos principais

- **Tipo:** Task
- **RF:** RNF07
- **Sprint:** 3
- **Prioridade:** P2
- **Área:** testes
- **Depende de:** T06.2.1

**O que fazer:**

1. Adicionar Playwright ao repositório.
2. Criar testes para:
   - login válido e inválido;
   - acesso ao dashboard sem token;
   - dashboard com dados;
   - tela de Serviços e detalhe;
   - filtro de período;
   - comparação entre serviços;
   - configurações;
   - viewport mobile.
3. Usar dados de teste ou mock de API quando necessário.
4. Documentar como subir a stack e rodar os testes.
5. Adicionar os testes ao CI.

**Critérios de aceite:**

- [ ] Os fluxos principais têm teste e2e.
- [ ] Os testes rodam contra a stack local.
- [ ] Teste mobile cobre o menu.
- [ ] README explica como rodar.
- [ ] CI executa os testes.

**Arquivos prováveis:** `e2e/`, `playwright.config.ts`,
`frontend/package.json`.

#### T06.2.3 — Configurar CI para lint, testes e build

- **Tipo:** Task
- **RF:** RNF07
- **Sprint:** 3
- **Prioridade:** P2
- **Área:** processo
- **Depende de:** T06.2.1

**O que fazer:**

1. Criar `.github/workflows/ci.yml`.
2. Executar:
   - frontend: install, lint, build, test;
   - backend: install, lint, test, build;
   - e2e, se estável.
3. Usar PostgreSQL de serviço para testes de integração.
4. Não expor segredos; usar variáveis de CI.
5. Documentar o status do CI no README.

**Critérios de aceite:**

- [ ] O workflow roda em pull requests.
- [ ] Lint, testes e build são verificados.
- [ ] Testes de integração têm banco disponível.
- [ ] Nenhum segredo real está no workflow.
- [ ] O README mostra o badge/status.

**Arquivos prováveis:** `.github/workflows/ci.yml`, `README.md`.

### F06.3 — Avaliação de usabilidade e sprint reviews (RP01–RP09)

#### T06.3.1 — Planejar, executar e registrar a avaliação de usabilidade

- **Tipo:** Task
- **RF:** RNF08, RP01–RP09
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** processo + docs
- **Depende de:** T03.2.1, T04.3.2

**O que fazer:**

1. Criar `docs/usabilidade/plano.md` com:
   - objetivo;
   - perfil dos participantes;
   - quantidade de participantes (sugestão: 3 a 5);
   - tarefas (login, dashboard, serviços, comparação, configurações);
   - roteiro;
   - métricas (sucesso, tempo, erros, satisfação);
   - termo de consentimento;
   - cronograma.
2. Executar as sessões e registrar observações.
3. Criar `docs/usabilidade/resultados.md` com:
   - resultados por tarefa;
   - problemas encontrados;
   - evidências (prints/notas);
   - prioridade de correção.
4. Transformar os problemas em issues/tasks.
5. Registrar as melhorias feitas após a avaliação.

**Critérios de aceite:**

- [ ] O plano está documentado.
- [ ] As sessões foram executadas e registradas.
- [ ] Os resultados contêm problemas e evidências.
- [ ] As melhorias viraram tasks.
- [ ] O documento final está linkado no README.

**Arquivos prováveis:** `docs/usabilidade/`.

#### T06.3.2 — Registrar as sprint reviews

- **Tipo:** Task
- **RF:** RNF08, RP01–RP09
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** processo + docs
- **Depende de:** T06.1.1, T06.1.2, T06.1.3

**O que fazer:**

1. Criar uma seção de review em cada documento de sprint ou um arquivo
   `docs/sprints/reviews.md`.
2. Registrar:
   - data;
   - participantes;
   - itens demonstrados;
   - feedback recebido;
   - decisões;
   - ajustes no backlog;
   - responsáveis.
3. Linkar as issues criadas/alteradas.
4. Garantir que cada review tenha evidência (ata, print ou link).

**Critérios de aceite:**

- [ ] As três sprints têm review registrada.
- [ ] O feedback e os ajustes estão documentados.
- [ ] As issues criadas/alteradas estão linkadas.
- [ ] As atas estão acessíveis no repositório.

**Arquivos prováveis:** `docs/sprints/`.

### F06.4 — Documentação técnica atualizada (RNF08)

#### T06.4.1 — Atualizar o README principal

- **Tipo:** Task
- **RF:** RNF08
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** docs
- **Depende de:** —

**O que fazer:**

1. Remover a frase “O dashboard ainda utiliza dados simulados no frontend”.
2. Atualizar o estado atual com:
   - dashboard integrado;
   - tela de Serviços;
   - mapa;
   - login;
   - API REST.
3. Adicionar/atualizar:
   - tabela de endpoints;
   - variáveis de ambiente;
   - credenciais de desenvolvimento;
   - comandos de teste/lint/build;
   - link para este backlog.
4. Revisar os links e comandos.
5. Garantir que o README permite executar a stack do zero.

**Critérios de aceite:**

- [ ] O README não contém informação falsa sobre mock.
- [ ] A stack pode ser executada seguindo o README.
- [ ] Endpoints e envs estão documentados.
- [ ] O backlog está linkado.
- [ ] Links e comandos foram testados.

**Arquivos prováveis:** `README.md`.

#### T06.4.2 — Substituir o README padrão do frontend

- **Tipo:** Task
- **RF:** RNF08
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** docs
- **Depende de:** —

**O que fazer:**

1. Substituir o conteúdo padrão do `create-next-app`.
2. Documentar:
   - pré-requisitos;
   - `NEXT_PUBLIC_API_URL`;
   - `NEXT_PUBLIC_REFRESH_INTERVAL_MS`;
   - como rodar localmente e via Docker;
   - rotas principais;
   - autenticação;
   - scripts de lint/build/test.
3. Linkar para o README principal e para o backlog.

**Critérios de aceite:**

- [ ] O README do frontend é específico do GreenER.
- [ ] As variáveis de ambiente estão explicadas.
- [ ] As rotas e scripts estão documentados.
- [ ] Os comandos funcionam.

**Arquivos prováveis:** `frontend/README.md`.

#### T06.4.3 — Atualizar documentação do worker e criar documentação da API

- **Tipo:** Task
- **RF:** RNF08
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** docs
- **Depende de:** —

**O que fazer:**

1. Atualizar `docs/worker-sintese.md`:
   - remover “próximas entregas” que já foram feitas;
   - atualizar RFs atendidos;
   - linkar o backlog.
2. Criar `docs/api.md` com:
   - todas as rotas;
   - método, query params e corpo;
   - exemplos de request/response;
   - códigos de erro;
   - autenticação;
   - semântica de `null`.
3. Atualizar `docs/worker/README.md` se necessário.
4. Revisar os diagramas e links.

**Critérios de aceite:**

- [ ] A documentação do worker não está desatualizada.
- [ ] Todas as rotas estão em `docs/api.md`.
- [ ] Exemplos e erros estão documentados.
- [ ] A semântica de `null` está clara.
- [ ] Links e diagramas estão corretos.

**Arquivos prováveis:** `docs/worker-sintese.md`, `docs/api.md`,
`docs/worker/README.md`.

#### T06.4.4 — Criar matriz de rastreabilidade dos requisitos

- **Tipo:** Task
- **RF:** RNF08, RP01–RP09
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** docs
- **Depende de:** —

**O que fazer:**

1. Criar `docs/requisitos.md`.
2. Incluir uma tabela com:
   - RF/RNF/RP;
   - descrição;
   - status;
   - issue/PR;
   - teste/evidência;
   - observações.
3. Cobrir RF01–RF16 e os RNFs/RPs referenciados nas issues.
4. Indicar explicitamente onde a definição de RF16/RNF/RP foi obtida.
5. Atualizar a matriz ao concluir cada task.

**Critérios de aceite:**

- [ ] A matriz cobre todos os RFs.
- [ ] RNFs/RPs estão mapeados ou marcados como pendentes de fonte.
- [ ] Cada requisito tem issue/evidência ou lacuna explícita.
- [ ] A matriz é atualizada durante a sprint.

**Arquivos prováveis:** `docs/requisitos.md`.

### F06.5 — Padronização arquitetural do backend

**Status:** pendente.

**Descrição:** alguns controllers acessam repositories diretamente:

- `ServicosController` injeta `ServicosRepository`.
- `ColetasController` injeta `ColetasRepository`.
- `DashboardController` injeta `ColetasRepository` e `ServicosRepository` e faz
  orquestração.

O `AuthController` já usa `AuthService`, que é o padrão desejado.

#### T06.5.1 — Introduzir camada de service nos módulos com acesso direto ao repository

- **Tipo:** Task
- **RF:** RNF08 (arquitetura)
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** backend + tech-debt
- **Depende de:** —

**O que fazer:**

1. Criar `ServicosService` com:
   - `listar(incluirRemovidos)`;
   - `buscarPorId(id)` lançando `NotFoundException`;
   - contagens por estado, se ainda estiverem no controller.
2. Criar `ColetasService` com:
   - `listar(filtros)`;
   - validação de período/limite;
   - regra de coleta válida, se aplicável.
3. Criar `DashboardService` com:
   - `indicadores(de, ate)`;
   - `historico(de, ate)`;
   - `impactoPorServico(de, ate, ordenarPor)`;
   - `comparacao(...)`, quando existir.
4. Mover para os services a orquestração que hoje está nos controllers.
5. Manter os repositories responsáveis apenas por acesso a dados/Prisma.
6. Atualizar os módulos para prover/exportar os services.
7. Atualizar os controllers para depender apenas dos services.
8. Atualizar testes de controller para mockar services e criar testes unitários
   dos services.
9. Garantir que os endpoints e respostas não mudem.
10. Verificar com busca no código que nenhum controller importa repository.

**Critérios de aceite:**

- [ ] `ServicosController`, `ColetasController` e `DashboardController` não
      importam repositories.
- [ ] Controllers só cuidam de HTTP/validação de entrada.
- [ ] Services concentram orquestração e regras de aplicação.
- [ ] Repositories continuam focados em persistência.
- [ ] Testes de controller e service passam.
- [ ] Nenhum contrato de API foi alterado sem documentação.
- [ ] A mudança está em PR separado, sem novas features.

**Arquivos prováveis:** `backend/src/servicos/`,
`backend/src/coletas/`, `backend/src/dashboard/`,
`backend/src/**/*.module.ts`.

### F06.6 — Higiene de issues e rastreabilidade do board

#### T06.6.1 — Revisar e alinhar as issues existentes com o código

- **Tipo:** Task
- **RF:** RNF08, RP01–RP09
- **Sprint:** 3
- **Prioridade:** P1
- **Área:** processo
- **Depende de:** —

**O que fazer:**

1. Revisar as issues abertas e fechadas:
   - `#1` E01;
   - `#2` E02;
   - `#3` E03;
   - `#4` E04;
   - `#5` E05;
   - `#6` E06;
   - `#9` a `#13` US02–US06;
   - `#26` task do cliente do Agregador;
   - `#28` duplicata de `#29`.
2. Para cada issue:
   - verificar se os critérios estão realmente atendidos;
   - fechar as concluídas;
   - reabrir ou criar follow-up para as que foram fechadas com pendência;
   - marcar duplicatas;
   - linkar PRs e tasks deste backlog.
3. Atualizar as checklists de US02–US06.
4. Garantir que cada issue aberta tenha critérios de aceite e responsável.
5. Não apagar histórico; usar comentários para justificar fechamentos.

**Critérios de aceite:**

- [ ] Nenhuma issue concluída continua aberta sem motivo.
- [ ] Nenhuma issue fechada esconde pendência conhecida.
- [ ] Duplicatas estão marcadas.
- [ ] US02–US06 refletem o estado real.
- [ ] Cada issue aberta está ligada a um épico/task.

**Arquivos prováveis:** issues do GitHub.

---

## E07 — Visualização geográfica

**RF:** RF13.

**Status:** concluído. O mapa está implementado e integrado ao dashboard.

**Tasks pendentes:** nenhuma task funcional. Manter um teste de regressão no e2e
para garantir que serviços com coordenadas aparecem e que a falha do mapa não
bloqueia o restante da página.

---

## Ordem sugerida de execução

1. **Fechar o PR atual da tela de Serviços** sem ampliar o escopo.
2. **T01.1.1, T02.1.1, T02.1.2** — corrigir removidos e dados ausentes.
3. **T03.1.1, T03.1.2** — atualização automática, última atualização e stale.
4. **T03.2.1, T03.2.2** — responsividade mobile.
5. **T04.1.1, T04.1.2, T04.2.1, T04.2.2** — período e ranking.
6. **T04.3.1, T04.3.2** — comparação.
7. **T04.4.1, T04.4.2** — lacunas.
8. **T05.1.1, T05.1.2, T05.2.1, T05.2.2, T05.3.1, T05.3.2** — auth/config.
9. **T06.1.1–T06.1.3, T06.3.1, T06.3.2** — documentação de sprints e usabilidade.
10. **T06.2.1–T06.2.3, T06.4.1–T06.4.4, T06.5.1, T06.6.1** — qualidade e
    fechamento.

## Observação sobre o PR atual

O PR atual deve conter apenas a tela de Serviços e os ajustes já feitos
(`dashboard/page.tsx`, `ServicosMonitorados.tsx`, `Sidebar.tsx`, `proxy.ts`,
`app/servicos/`, `components/servicos/` e `lib/formatacao.ts`).

Antes de abrir:

- [ ] Revisar `git status` e garantir que todos os arquivos novos foram incluídos.
- [ ] Rodar build, typecheck e lint no frontend.
- [ ] Rodar lint e testes no backend, se o PR tocar o backend.
- [ ] Não incluir tasks deste backlog no PR atual.
- [ ] Descrever no PR o que foi entregue, prints e limitações conhecidas.
- [ ] Solicitar review do responsável pelo repositório.

As correções de removidos e de dados ausentes podem entrar em PRs separados para
não misturar escopo.
