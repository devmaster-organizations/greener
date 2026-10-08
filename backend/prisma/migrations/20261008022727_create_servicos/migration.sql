-- CreateTable
CREATE TABLE "servicos" (
    "id" VARCHAR(100) NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "region_code" VARCHAR(50) NOT NULL,
    "pais" VARCHAR(100),
    "regiao" VARCHAR(100),
    "cidade" VARCHAR(100),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "metrics_path" VARCHAR(255) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ATIVO',
    "ultima_coleta_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "servicos_pkey" PRIMARY KEY ("id")
);
