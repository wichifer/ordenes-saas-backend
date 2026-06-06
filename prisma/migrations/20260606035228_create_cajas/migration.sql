-- CreateTable
CREATE TABLE "cajas" (
    "id_caja" BIGSERIAL NOT NULL,
    "id_empresa" BIGINT NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "fecha_apertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_cierre" TIMESTAMP(3),
    "saldo_inicial" DECIMAL(12,2) NOT NULL,
    "saldo_final" DECIMAL(12,2),
    "estado" TEXT NOT NULL DEFAULT 'ABIERTA',

    CONSTRAINT "cajas_pkey" PRIMARY KEY ("id_caja")
);

-- AddForeignKey
ALTER TABLE "cajas" ADD CONSTRAINT "cajas_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresas"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cajas" ADD CONSTRAINT "cajas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
