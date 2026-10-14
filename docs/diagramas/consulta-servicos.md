# Consulta de serviços no Agregador

O `AgregadorClient` consulta `GET /services`, verifica o status HTTP
e valida a estrutura da lista e os campos obrigatórios:
`id`, `name`, `metrics_path`, `location` e `location.region_code`.

Os dados são transformados para o formato interno do GreenER.
Uma lista vazia válida retorna `[]`. Falhas são propagadas ao chamador.

A consulta possui timeout configurável. Este fluxo ainda não
persiste os serviços nem executa a descoberta periodicamente.

```mermaid
sequenceDiagram
    participant C as Chamador
    participant A as AgregadorClient
    participant H as Agregador de Métricas

    C->>A: listarServicos()
    A->>A: Iniciar limite de tempo
    A->>H: GET /services

    alt Tempo limite excedido
        A->>H: Cancelar requisição
        A-->>C: Erro de timeout
    else Resposta recebida
        H-->>A: Status HTTP e corpo
        alt Status HTTP de erro
            A-->>C: Erro com status HTTP
        else Status HTTP de sucesso
            A->>A: Ler JSON e validar dados
            alt JSON ou estrutura inválida
                A-->>C: Propagar erro
            else Dados válidos
                A->>A: Transformar campos
                A-->>C: Lista de serviços
            end
        end
    end

    Note over A: Remover timer ao finalizar, com sucesso ou erro
```

## Configuração

| Variável | Finalidade |
|---|---|
| `AGREGADOR_BASE_URL` | Endereço base do Agregador. |
| `AGREGADOR_TIMEOUT_MS` | Timeout em milissegundos; padrão de 5000. |

## Validação

- Dez testes unitários do client.
- Um teste de disponibilização pelo módulo NestJS.
- Build do backend.

Os testes usam respostas HTTP simuladas e não comprovam
a disponibilidade da API externa.