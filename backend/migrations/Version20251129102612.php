<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251129102612 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE contratos (id INT UNSIGNED AUTO_INCREMENT NOT NULL, assigned_camion_id INT UNSIGNED DEFAULT NULL, origin VARCHAR(255) NOT NULL, destination VARCHAR(255) NOT NULL, origin_lat NUMERIC(10, 8) DEFAULT NULL, origin_lng NUMERIC(11, 8) DEFAULT NULL, dest_lat NUMERIC(10, 8) DEFAULT NULL, dest_lng NUMERIC(11, 8) DEFAULT NULL, cargo_type VARCHAR(50) NOT NULL, cargo_weight INT NOT NULL, deadline_date DATE NOT NULL, status VARCHAR(20) NOT NULL, distance_km INT DEFAULT NULL, INDEX IDX_B90FD71C7A06B371 (assigned_camion_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE contratos ADD CONSTRAINT FK_B90FD71C7A06B371 FOREIGN KEY (assigned_camion_id) REFERENCES camiones (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contratos DROP FOREIGN KEY FK_B90FD71C7A06B371');
        $this->addSql('DROP TABLE contratos');
    }
}
