
# Contrato da API — Comparação entre Serviços

## 1. Objetivo

Disponibilizar os dados necessários para comparar o consumo de energia e as emissões de CO2e de diferentes serviços ao longo de um período.

Atualmente, o frontend utiliza dados fictícios definidos em `mockComparacoes.ts`.

Este documento descreve o formato esperado para a futura integração com o backend.

## 2. Endpoint sugerido

GET /comparacoes/historico

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| servicos | string | Sim | IDs dos serviços separados por vírgula |
| dataInicio | string | Sim | Data inicial no formato YYYY-MM-DD |
| dataFim | string | Sim | Data final no formato YYYY-MM-DD |

### Exemplo de requisição

GET /comparacoes/historico?servicos=1,2&dataInicio=2026-11-01&dataFim=2026-11-07

## 3. Formato esperado da resposta

```json
{
  "servicos": [
    {
      "id": "1",
      "nome": "API de Usuários"
    },
    {
      "id": "2",
      "nome": "API de Pedidos"
    }
  ],
  "historico": [
    {
      "servicoId": "1",
      "data": "2026-11-01",
      "energiaKwh": 2.4,
      "co2eG": 180
    },
    {
      "servicoId": "2",
      "data": "2026-11-01",
      "energiaKwh": 3.5,
      "co2eG": 263
    }
  ]
}
```

## 4. Descrição dos campos

### servicos

| Campo | Tipo | Descrição |
|---|---|---|
| id | string | Identificador do serviço |
| nome | string | Nome do serviço |

### historico

| Campo | Tipo | Descrição |
|---|---|---|
| servicoId | string | Identificador do serviço relacionado |
| data | string | Data da medição (YYYY-MM-DD) |
| energiaKwh | number | Energia consumida em kWh |
| co2eG | number | Emissões estimadas em gramas de CO2e |

## 5. Regras esperadas

- Retornar somente os serviços solicitados e autorizados.
- Respeitar o intervalo de datas informado.
- Associar cada medição ao identificador correto do serviço.
- Retornar os valores numéricos de energia e emissões.
- Permitir que o frontend identifique os dias sem medições.
- Não retornar serviços removidos.
- Utilizar datas no formato YYYY-MM-DD.
- Retornar uma lista vazia quando não houver medições no período.

## 6. Observações

- O endpoint acima é uma proposta de contrato, não uma rota já implementada.
- Os IDs utilizados nos mocks do frontend são fictícios.
- O backend deverá utilizar os identificadores reais do banco de dados.
- A cor de cada serviço será definida pelo frontend.
- O frontend permitirá alternar entre energia (kWh) e emissões (CO2e).
