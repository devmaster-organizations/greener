-- GreenER — verificação das tabelas e dos dados gravados pelo Worker.
-- Apenas SQL padrão: pode ser executado via psql ou diretamente no DBeaver.

-- 1) Tabelas existentes no schema public
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2) Contagem de linhas
SELECT 'servicos' AS tabela, count(*) AS linhas FROM servicos
UNION ALL
SELECT 'coletas', count(*) FROM coletas;

-- 3) Serviços monitorados
SELECT id, status, region_code, ultima_coleta_at
FROM servicos
ORDER BY id;

-- 4) Últimas coletas
SELECT
  servico_id,
  status,
  cpu_percent,
  potencia_w,
  energia_kwh,
  carbon_intensity,
  co2e_g,
  coletada_at
FROM coletas
ORDER BY coletada_at DESC
LIMIT 15;

-- 5) Coletas por serviço
SELECT servico_id, count(*) AS total, max(coletada_at) AS ultima
FROM coletas
GROUP BY servico_id
ORDER BY total DESC;
