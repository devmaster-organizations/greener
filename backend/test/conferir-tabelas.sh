#!/usr/bin/env bash
#
# Verifica as tabelas do banco do GreenER executando conferir-tabelas.sql
# no container do Postgres.
#
# Uso (de qualquer pasta do repositório):
#   bash backend/test/conferir-tabelas.sh
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SQL_FILE="$SCRIPT_DIR/conferir-tabelas.sql"

SERVICO="postgres"
USUARIO="greener"
BANCO="greener"

cd "$REPO_ROOT"

echo "Executando ${SQL_FILE} em ${SERVICO}/${BANCO}..."
echo

docker compose exec -T "$SERVICO" psql -U "$USUARIO" -d "$BANCO" -v ON_ERROR_STOP=1 < "$SQL_FILE"
