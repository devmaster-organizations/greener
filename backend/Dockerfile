# Imagem única para o backend (HTTP) e o Worker (background).
# O processo executado é definido pelo `command` de cada serviço no Compose.
FROM node:24-slim

WORKDIR /app

# Instala todas as dependências (inclui o Prisma CLI, usado em `migrate deploy`).
COPY package.json package-lock.json ./
RUN npm ci

# Código-fonte, geração do Prisma Client e build (prisma generate + nest build).
# `prisma generate` lê DATABASE_URL da configuração mesmo sem conectar ao banco,
# por isso um valor provisório é informado apenas durante o build.
COPY . .
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build?schema=public" npm run build

EXPOSE 3001

# Padrão: backend HTTP. O Worker sobrescreve com `node dist/worker/main.js`.
CMD ["node", "dist/main.js"]
