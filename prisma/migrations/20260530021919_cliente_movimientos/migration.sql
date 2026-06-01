-- CreateTable
CREATE TABLE "public"."auth_providers" (
    "id_provider" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,

    CONSTRAINT "auth_providers_pkey" PRIMARY KEY ("id_provider")
);

-- CreateTable
CREATE TABLE "public"."clientes" (
    "id_cliente" BIGSERIAL NOT NULL,
    "id_empresa" BIGINT NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100),
    "razon_social" VARCHAR(150),
    "documento" VARCHAR(30),
    "cuit" VARCHAR(20),
    "telefono" VARCHAR(50),
    "email" VARCHAR(150),
    "direccion" TEXT,
    "estado" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "public"."empresas" (
    "id_empresa" BIGSERIAL NOT NULL,
    "razon_social" VARCHAR(150) NOT NULL,
    "nombre_comercial" VARCHAR(150),
    "cuit" VARCHAR(20),
    "email" VARCHAR(150),
    "telefono" VARCHAR(50),
    "direccion" TEXT,
    "estado" BOOLEAN DEFAULT true,
    "plan_saas" VARCHAR(50) DEFAULT 'TRIAL',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id_empresa")
);

-- CreateTable
CREATE TABLE "public"."roles" (
    "id_rol" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "public"."usuario_auth" (
    "id_usuario_auth" BIGSERIAL NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "id_provider" BIGINT NOT NULL,
    "provider_user_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_auth_pkey" PRIMARY KEY ("id_usuario_auth")
);

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id_usuario" BIGSERIAL NOT NULL,
    "id_empresa" BIGINT NOT NULL,
    "id_rol" BIGINT NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100),
    "email" VARCHAR(150) NOT NULL,
    "password_hash" VARCHAR(255),
    "avatar_url" TEXT,
    "estado" BOOLEAN DEFAULT true,
    "email_verificado" BOOLEAN DEFAULT false,
    "ultimo_acceso" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),
    "proveedor_auth" VARCHAR(50),
    "proveedor_id" VARCHAR(255),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "public"."articulos" (
    "id_articulo" BIGSERIAL NOT NULL,
    "id_empresa" BIGINT NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(200) NOT NULL,
    "precio_final" DECIMAL(12,2) NOT NULL,
    "stock_actual" DECIMAL(12,2) DEFAULT 0,
    "stock_minimo" DECIMAL(12,2) DEFAULT 0,
    "estado" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "articulos_pkey" PRIMARY KEY ("id_articulo")
);

-- CreateTable
CREATE TABLE "public"."auditoria_logs" (
    "id_log" BIGSERIAL NOT NULL,
    "id_empresa" BIGINT,
    "id_usuario" BIGINT,
    "tabla_afectada" VARCHAR(100),
    "accion" VARCHAR(50),
    "registro_id" BIGINT,
    "ip_origen" VARCHAR(100),
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_logs_pkey" PRIMARY KEY ("id_log")
);

-- CreateTable
CREATE TABLE "public"."detalle_orden_compra" (
    "id_detalle_orden" BIGSERIAL NOT NULL,
    "id_orden_compra" BIGINT NOT NULL,
    "id_articulo" BIGINT NOT NULL,
    "descripcion_articulo" VARCHAR(200) NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "precio_unitario" DECIMAL(12,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "detalle_orden_compra_pkey" PRIMARY KEY ("id_detalle_orden")
);

-- CreateTable
CREATE TABLE "public"."ordenes_compra" (
    "id_orden_compra" BIGSERIAL NOT NULL,
    "id_empresa" BIGINT NOT NULL,
    "id_cliente" BIGINT NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "numero_orden" VARCHAR(50) NOT NULL,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "observaciones" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "ordenes_compra_pkey" PRIMARY KEY ("id_orden_compra")
);

-- CreateTable
CREATE TABLE "public"."pagos" (
    "id_pago" BIGSERIAL NOT NULL,
    "id_empresa" BIGINT NOT NULL,
    "id_orden_compra" BIGINT NOT NULL,
    "id_cliente" BIGINT NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "metodo_pago" TEXT,
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "public"."cliente_movimientos" (
    "id_movimiento_cliente" BIGSERIAL NOT NULL,
    "id_empresa" BIGINT NOT NULL,
    "id_cliente" BIGINT NOT NULL,
    "tipo_movimiento" TEXT NOT NULL,
    "monto" DECIMAL(18,2) NOT NULL,
    "observacion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cliente_movimientos_pkey" PRIMARY KEY ("id_movimiento_cliente")
);

-- CreateTable
CREATE TABLE "public"."stock_movimientos" (
    "id_movimiento_stock" BIGSERIAL NOT NULL,
    "id_empresa" BIGINT NOT NULL,
    "id_articulo" BIGINT NOT NULL,
    "tipo_movimiento" VARCHAR(30) NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "referencia" VARCHAR(100),
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movimientos_pkey" PRIMARY KEY ("id_movimiento_stock")
);

-- CreateTable
CREATE TABLE "public"."suscripciones" (
    "id_suscripcion" BIGSERIAL NOT NULL,
    "id_empresa" BIGINT NOT NULL,
    "plan" VARCHAR(50) NOT NULL,
    "estado" VARCHAR(30) NOT NULL,
    "fecha_inicio" TIMESTAMP(6) NOT NULL,
    "fecha_vencimiento" TIMESTAMP(6) NOT NULL,
    "max_usuarios" INTEGER DEFAULT 1,
    "max_ordenes" INTEGER DEFAULT 100,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suscripciones_pkey" PRIMARY KEY ("id_suscripcion")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_providers_codigo_key" ON "public"."auth_providers"("codigo");

-- CreateIndex
CREATE INDEX "idx_cliente_empresa" ON "public"."clientes"("id_empresa");

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "public"."roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email");

-- CreateIndex
CREATE INDEX "idx_usuario_email" ON "public"."usuarios"("email");

-- CreateIndex
CREATE INDEX "idx_usuario_empresa" ON "public"."usuarios"("id_empresa");

-- CreateIndex
CREATE INDEX "idx_articulo_codigo" ON "public"."articulos"("codigo");

-- CreateIndex
CREATE INDEX "idx_articulo_empresa" ON "public"."articulos"("id_empresa");

-- CreateIndex
CREATE INDEX "idx_orden_empresa" ON "public"."ordenes_compra"("id_empresa");

-- CreateIndex
CREATE INDEX "idx_orden_fecha" ON "public"."ordenes_compra"("fecha");

-- CreateIndex
CREATE INDEX "idx_pago_empresa" ON "public"."pagos"("id_empresa");

-- CreateIndex
CREATE INDEX "idx_pago_orden" ON "public"."pagos"("id_orden_compra");

-- CreateIndex
CREATE INDEX "cliente_movimientos_id_empresa_idx" ON "public"."cliente_movimientos"("id_empresa");

-- CreateIndex
CREATE INDEX "cliente_movimientos_id_cliente_idx" ON "public"."cliente_movimientos"("id_cliente");

-- CreateIndex
CREATE INDEX "idx_stock_articulo" ON "public"."stock_movimientos"("id_articulo");

-- AddForeignKey
ALTER TABLE "public"."clientes" ADD CONSTRAINT "fk_cliente_empresa" FOREIGN KEY ("id_empresa") REFERENCES "public"."empresas"("id_empresa") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."usuario_auth" ADD CONSTRAINT "fk_usuario_auth_provider" FOREIGN KEY ("id_provider") REFERENCES "public"."auth_providers"("id_provider") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."usuario_auth" ADD CONSTRAINT "fk_usuario_auth_usuario" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "fk_usuario_empresa" FOREIGN KEY ("id_empresa") REFERENCES "public"."empresas"("id_empresa") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "fk_usuario_rol" FOREIGN KEY ("id_rol") REFERENCES "public"."roles"("id_rol") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."articulos" ADD CONSTRAINT "fk_articulo_empresa" FOREIGN KEY ("id_empresa") REFERENCES "public"."empresas"("id_empresa") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."auditoria_logs" ADD CONSTRAINT "fk_log_empresa" FOREIGN KEY ("id_empresa") REFERENCES "public"."empresas"("id_empresa") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."auditoria_logs" ADD CONSTRAINT "fk_log_usuario" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."detalle_orden_compra" ADD CONSTRAINT "fk_detalle_articulo" FOREIGN KEY ("id_articulo") REFERENCES "public"."articulos"("id_articulo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."detalle_orden_compra" ADD CONSTRAINT "fk_detalle_orden" FOREIGN KEY ("id_orden_compra") REFERENCES "public"."ordenes_compra"("id_orden_compra") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ordenes_compra" ADD CONSTRAINT "fk_orden_cliente" FOREIGN KEY ("id_cliente") REFERENCES "public"."clientes"("id_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ordenes_compra" ADD CONSTRAINT "fk_orden_empresa" FOREIGN KEY ("id_empresa") REFERENCES "public"."empresas"("id_empresa") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ordenes_compra" ADD CONSTRAINT "fk_orden_usuario" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."pagos" ADD CONSTRAINT "pagos_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "public"."empresas"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pagos" ADD CONSTRAINT "pagos_id_orden_compra_fkey" FOREIGN KEY ("id_orden_compra") REFERENCES "public"."ordenes_compra"("id_orden_compra") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pagos" ADD CONSTRAINT "pagos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "public"."clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cliente_movimientos" ADD CONSTRAINT "cliente_movimientos_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "public"."empresas"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cliente_movimientos" ADD CONSTRAINT "cliente_movimientos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "public"."clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stock_movimientos" ADD CONSTRAINT "fk_stock_articulo" FOREIGN KEY ("id_articulo") REFERENCES "public"."articulos"("id_articulo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."stock_movimientos" ADD CONSTRAINT "fk_stock_empresa" FOREIGN KEY ("id_empresa") REFERENCES "public"."empresas"("id_empresa") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."suscripciones" ADD CONSTRAINT "fk_suscripcion_empresa" FOREIGN KEY ("id_empresa") REFERENCES "public"."empresas"("id_empresa") ON DELETE NO ACTION ON UPDATE NO ACTION;
