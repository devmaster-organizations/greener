-- CreateTable
CREATE TABLE "coletas" (
    "id" TEXT NOT NULL,
    "servico_id" VARCHAR(100) NOT NULL,
    "coletada_at" TIMESTAMPTZ(3) NOT NULL,
    "cpu_percent" DECIMAL(5,2),
    "memory_gb" DECIMAL(10,3),
    "disk_gb" DECIMAL(10,3),
    "network_gb" DECIMAL(10,3),
    "potencia_w" DECIMAL(12,4),
    "energia_kwh" DECIMAL(18,10),
    "carbon_intensity" DECIMAL(10,3),
    "co2e_g" DECIMAL(18,10),
    "status" VARCHAR(30) NOT NULL,
    "erro" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coletas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "coletas_servico_id_coletada_at_idx" ON "coletas"("servico_id", "coletada_at");

-- AddForeignKey
ALTER TABLE "coletas" ADD CONSTRAINT "coletas_servico_id_fkey" FOREIGN KEY ("servico_id") REFERENCES "servicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
