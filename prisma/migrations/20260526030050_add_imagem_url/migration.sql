/*
  Warnings:

  - The primary key for the `cliente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `endereco` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ingrediente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `itens_pedido` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pedido` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `produto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `produtos_ingredientes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `logradouro` on table `endereco` required. This step will fail if there are existing NULL values in that column.
  - Made the column `numero` on table `endereco` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ativo` on table `endereco` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `nome_snapshot` to the `itens_pedido` table without a default value. This is not possible if the table is not empty.
  - Made the column `descricao` on table `produto` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `endereco` DROP FOREIGN KEY `fk_endereco_cliente`;

-- DropForeignKey
ALTER TABLE `itens_pedido` DROP FOREIGN KEY `fk_pedido_item_pedido`;

-- DropForeignKey
ALTER TABLE `itens_pedido` DROP FOREIGN KEY `fk_produto_item_pedido`;

-- DropForeignKey
ALTER TABLE `pedido` DROP FOREIGN KEY `fk_cliente_pedido`;

-- DropForeignKey
ALTER TABLE `pedido` DROP FOREIGN KEY `fk_endereco_pedido`;

-- DropForeignKey
ALTER TABLE `pedido` DROP FOREIGN KEY `fk_entregador_pedido`;

-- DropForeignKey
ALTER TABLE `pedido` DROP FOREIGN KEY `fk_pizzaiolo_pedido`;

-- DropForeignKey
ALTER TABLE `produtos_ingredientes` DROP FOREIGN KEY `fk_ingrediente_prod_ing`;

-- DropForeignKey
ALTER TABLE `produtos_ingredientes` DROP FOREIGN KEY `fk_produto_prod_ing`;

-- AlterTable
ALTER TABLE `cliente` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(12) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `endereco` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(12) NOT NULL,
    MODIFY `cliente_id` VARCHAR(12) NOT NULL,
    MODIFY `logradouro` VARCHAR(255) NOT NULL,
    MODIFY `numero` VARCHAR(10) NOT NULL,
    MODIFY `ativo` BOOLEAN NOT NULL DEFAULT true,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `ingrediente` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(12) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `itens_pedido` DROP PRIMARY KEY,
    ADD COLUMN `descricao_snapshot` VARCHAR(255) NULL,
    ADD COLUMN `nome_snapshot` VARCHAR(100) NOT NULL,
    MODIFY `id` VARCHAR(12) NOT NULL,
    MODIFY `pedido_id` VARCHAR(12) NOT NULL,
    MODIFY `produto_id` VARCHAR(12) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `pedido` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(12) NOT NULL,
    MODIFY `cliente_id` VARCHAR(12) NOT NULL,
    MODIFY `endereco_id` VARCHAR(12) NOT NULL,
    MODIFY `pizzaiolo_id` VARCHAR(12) NULL,
    MODIFY `entregador_id` VARCHAR(12) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `produto` DROP PRIMARY KEY,
    ADD COLUMN `imagem_url` VARCHAR(255) NULL,
    MODIFY `id` VARCHAR(12) NOT NULL,
    MODIFY `descricao` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `produtos_ingredientes` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(12) NOT NULL,
    MODIFY `produto_id` VARCHAR(12) NOT NULL,
    MODIFY `ingrediente_id` VARCHAR(12) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `usuario` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(12) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `endereco` ADD CONSTRAINT `fk_endereco_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `cliente`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `itens_pedido` ADD CONSTRAINT `fk_pedido_item_pedido` FOREIGN KEY (`pedido_id`) REFERENCES `pedido`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `itens_pedido` ADD CONSTRAINT `fk_produto_item_pedido` FOREIGN KEY (`produto_id`) REFERENCES `produto`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pedido` ADD CONSTRAINT `fk_cliente_pedido` FOREIGN KEY (`cliente_id`) REFERENCES `cliente`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pedido` ADD CONSTRAINT `fk_endereco_pedido` FOREIGN KEY (`endereco_id`) REFERENCES `endereco`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pedido` ADD CONSTRAINT `fk_entregador_pedido` FOREIGN KEY (`entregador_id`) REFERENCES `usuario`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pedido` ADD CONSTRAINT `fk_pizzaiolo_pedido` FOREIGN KEY (`pizzaiolo_id`) REFERENCES `usuario`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `produtos_ingredientes` ADD CONSTRAINT `fk_ingrediente_prod_ing` FOREIGN KEY (`ingrediente_id`) REFERENCES `ingrediente`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `produtos_ingredientes` ADD CONSTRAINT `fk_produto_prod_ing` FOREIGN KEY (`produto_id`) REFERENCES `produto`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
