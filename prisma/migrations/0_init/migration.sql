-- CreateTable
CREATE TABLE `cliente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `telefone` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `endereco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cliente_id` INTEGER NOT NULL,
    `logradouro` VARCHAR(255) NULL,
    `numero` VARCHAR(10) NULL,
    `bairro` VARCHAR(100) NULL,
    `cidade` VARCHAR(100) NULL,
    `cep` VARCHAR(8) NULL,
    `complemento` VARCHAR(255) NULL,
    `ativo` BOOLEAN NULL DEFAULT true,

    INDEX `fk_endereco_cliente`(`cliente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingrediente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `quantidade_atual` DECIMAL(10, 3) NULL,
    `unidade_medida` ENUM('un', 'kg', 'g', 'ml', 'L') NOT NULL DEFAULT 'un',
    `estoque_minimo` DECIMAL(10, 3) NULL,
    `preco_unitario` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itens_pedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedido_id` INTEGER NOT NULL,
    `produto_id` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `preco_unitario` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NULL,

    INDEX `fk_pedido_item_pedido`(`pedido_id`),
    INDEX `fk_produto_item_pedido`(`produto_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cliente_id` INTEGER NOT NULL,
    `endereco_id` INTEGER NOT NULL,
    `pizzaiolo_id` INTEGER NULL,
    `entregador_id` INTEGER NULL,
    `status` ENUM('pendente', 'preparo', 'pronto', 'em rota', 'entregue', 'cancelado') NOT NULL DEFAULT 'pendente',
    `valor_total` DECIMAL(10, 2) NOT NULL,
    `data_pedido` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_cliente_pedido`(`cliente_id`),
    INDEX `fk_endereco_pedido`(`endereco_id`),
    INDEX `fk_entregador_pedido`(`entregador_id`),
    INDEX `fk_pizzaiolo_pedido`(`pizzaiolo_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `descricao` VARCHAR(255) NULL,
    `preco_unitario` DECIMAL(10, 2) NOT NULL,
    `categoria` ENUM('pizza', 'bebida', 'sobremesa') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produtos_ingredientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `produto_id` INTEGER NOT NULL,
    `ingrediente_id` INTEGER NOT NULL,
    `quantidade` DECIMAL(10, 3) NOT NULL,

    INDEX `fk_ingrediente_prod_ing`(`ingrediente_id`),
    INDEX `fk_produto_prod_ing`(`produto_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `telefone` VARCHAR(30) NULL,
    `cargo` ENUM('gestor', 'pizzaiolo', 'entregador') NOT NULL,
    `data_criacao` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `endereco` ADD CONSTRAINT `fk_endereco_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `cliente`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `itens_pedido` ADD CONSTRAINT `fk_pedido_item_pedido` FOREIGN KEY (`pedido_id`) REFERENCES `pedido`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `itens_pedido` ADD CONSTRAINT `fk_produto_item_pedido` FOREIGN KEY (`produto_id`) REFERENCES `produto`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

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
ALTER TABLE `produtos_ingredientes` ADD CONSTRAINT `fk_produto_prod_ing` FOREIGN KEY (`produto_id`) REFERENCES `produto`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

