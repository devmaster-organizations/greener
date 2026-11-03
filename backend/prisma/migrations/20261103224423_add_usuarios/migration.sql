-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- Seed do usuário administrador padrão (admin@greener.com / greener123).
INSERT INTO "usuarios" ("id", "nome", "email", "senha_hash", "created_at", "updated_at")
VALUES (
    '00000000-0000-4000-8000-000000000001',
    'Administrador GreenER',
    'admin@greener.com',
    '$2b$10$4eCkcpPE156SfpJ5kUDOK.wmC1qlliKatHpgB9ensPB6wgvz45JDi',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("email") DO NOTHING;
