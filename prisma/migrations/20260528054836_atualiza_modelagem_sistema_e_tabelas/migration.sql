/*
  Warnings:

  - Made the column `bairro` on table `endereco` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `cliente_nome` to the `pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cliente_telefone` to the `pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entrega_bairro` to the `pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entrega_logradouro` to the `pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entrega_numero` to the `pedido` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pedido` DROP FOREIGN KEY `fk_cliente_pedido`;

-- DropForeignKey
ALTER TABLE `pedido` DROP FOREIGN KEY `fk_endereco_pedido`;

-- DropForeignKey
ALTER TABLE `pedido` DROP FOREIGN KEY `fk_entregador_pedido`;

-- DropForeignKey
ALTER TABLE `pedido` DROP FOREIGN KEY `fk_pizzaiolo_pedido`;

-- AlterTable
ALTER TABLE `endereco` MODIFY `bairro` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `ingrediente` MODIFY `unidade_medida` ENUM('un', 'kg', 'g', 'ml', 'L') NULL DEFAULT 'un';

-- AlterTable
ALTER TABLE `pedido` ADD COLUMN `cliente_nome` VARCHAR(255) NOT NULL,
    ADD COLUMN `cliente_telefone` VARCHAR(30) NOT NULL,
    ADD COLUMN `entrega_bairro` VARCHAR(100) NOT NULL,
    ADD COLUMN `entrega_cep` VARCHAR(8) NULL,
    ADD COLUMN `entrega_cidade` VARCHAR(100) NULL,
    ADD COLUMN `entrega_complemento` VARCHAR(255) NULL,
    ADD COLUMN `entrega_logradouro` VARCHAR(255) NOT NULL,
    ADD COLUMN `entrega_numero` VARCHAR(10) NOT NULL,
    ADD COLUMN `observacoes` VARCHAR(500) NULL,
    ADD COLUMN `taxa_entrega` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    MODIFY `cliente_id` VARCHAR(12) NULL,
    MODIFY `endereco_id` VARCHAR(12) NULL;

-- AlterTable
ALTER TABLE `produto` ADD COLUMN `ativo` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `categoria` ENUM('pizza', 'bebida', 'sobremesa') NOT NULL DEFAULT 'pizza';

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `ativo` BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE `pedido` ADD CONSTRAINT `pedido_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `cliente`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedido` ADD CONSTRAINT `pedido_endereco_id_fkey` FOREIGN KEY (`endereco_id`) REFERENCES `endereco`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedido` ADD CONSTRAINT `pedido_pizzaiolo_id_fkey` FOREIGN KEY (`pizzaiolo_id`) REFERENCES `usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedido` ADD CONSTRAINT `pedido_entregador_id_fkey` FOREIGN KEY (`entregador_id`) REFERENCES `usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `pedido` RENAME INDEX `fk_cliente_pedido` TO `pedido_cliente_id_idx`;

-- RenameIndex
ALTER TABLE `pedido` RENAME INDEX `fk_endereco_pedido` TO `pedido_endereco_id_idx`;

-- RenameIndex
ALTER TABLE `pedido` RENAME INDEX `fk_entregador_pedido` TO `pedido_entregador_id_idx`;

-- RenameIndex
ALTER TABLE `pedido` RENAME INDEX `fk_pizzaiolo_pedido` TO `pedido_pizzaiolo_id_idx`;
