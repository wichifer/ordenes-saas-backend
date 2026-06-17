-- AlterTable
ALTER TABLE "articulos" ADD COLUMN     "unidad_medida" VARCHAR(10) NOT NULL DEFAULT 'UN';

-- CreateTable
CREATE TABLE "facturas" (
    "id_factura" BIGSERIAL NOT NULL,
    "id_empresa" BIGINT NOT NULL,
    "id_cliente" BIGINT NOT NULL,
    "numero_factura" TEXT NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "saldo" DECIMAL(65,30) NOT NULL,
    "estado" TEXT NOT NULL,
    "id_orden_compra" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("id_factura")
);

-- CreateTable
CREATE TABLE "cuentas_por_cobrar" (
    "id_cxc" BIGSERIAL NOT NULL,
    "id_empresa" BIGINT NOT NULL,
    "id_cliente" BIGINT NOT NULL,
    "id_factura" BIGINT NOT NULL,
    "saldo" DECIMAL(65,30) NOT NULL,
    "estado" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cuentas_por_cobrar_pkey" PRIMARY KEY ("id_cxc")
);

-- CreateTable
CREATE TABLE "pagos_clientes" (
    "id_pago" BIGSERIAL NOT NULL,
    "id_empresa" BIGINT NOT NULL,
    "id_cliente" BIGINT NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "metodo" TEXT NOT NULL,
    "referencia" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_clientes_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "pagos_aplicados" (
    "id" BIGSERIAL NOT NULL,
    "id_pago" BIGINT NOT NULL,
    "id_factura" BIGINT NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "pagos_aplicados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asientos_contables" (
    "id_asiento" BIGSERIAL NOT NULL,
    "id_empresa" BIGINT NOT NULL,
    "cuenta" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "referencia" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asientos_contables_pkey" PRIMARY KEY ("id_asiento")
);
