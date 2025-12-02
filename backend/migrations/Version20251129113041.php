<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251129113041 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE contract (id INT AUTO_INCREMENT NOT NULL, client_name VARCHAR(255) NOT NULL, total_quantity INT NOT NULL, product_type VARCHAR(100) NOT NULL, deadline DATE NOT NULL, origin_address VARCHAR(255) NOT NULL, origin_lat NUMERIC(10, 8) DEFAULT NULL, origin_lon NUMERIC(11, 8) DEFAULT NULL, destination_address VARCHAR(255) NOT NULL, destination_lat NUMERIC(10, 8) DEFAULT NULL, destination_lon NUMERIC(11, 8) DEFAULT NULL, status VARCHAR(20) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('DROP TABLE contracts');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE contracts (id INT AUTO_INCREMENT NOT NULL, client_name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, total_quantity INT NOT NULL COMMENT \'Cantidad total en kg o litros\', product_type VARCHAR(100) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci` COMMENT \'Ej: Grano, Arena, Agua\', deadline DATE NOT NULL COMMENT \'Fecha límite del contrato\', origin_address VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, origin_lat NUMERIC(10, 8) DEFAULT NULL, origin_lon NUMERIC(11, 8) DEFAULT NULL, destination_address VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, destination_lat NUMERIC(10, 8) DEFAULT NULL, destination_lon NUMERIC(11, 8) DEFAULT NULL, status VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'pending\' COLLATE `utf8mb4_0900_ai_ci`, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_0900_ai_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('DROP TABLE contract');
    }
}
