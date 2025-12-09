<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251209084356 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE camion_contratos DROP FOREIGN KEY FK_FACB93DF2576E0FD');
        $this->addSql('ALTER TABLE camion_contratos DROP FOREIGN KEY FK_FACB93DF3A706D3');
        $this->addSql('DROP TABLE camion_contratos');
        $this->addSql('ALTER TABLE users ADD password_plain VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE camion_contratos (id INT AUTO_INCREMENT NOT NULL, camion_id INT UNSIGNED NOT NULL, contract_id INT NOT NULL, fecha_inicio DATETIME NOT NULL, fecha_fin_estimada DATETIME NOT NULL, estado VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, INDEX IDX_FACB93DF3A706D3 (camion_id), INDEX IDX_FACB93DF2576E0FD (contract_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE camion_contratos ADD CONSTRAINT FK_FACB93DF2576E0FD FOREIGN KEY (contract_id) REFERENCES contract (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE camion_contratos ADD CONSTRAINT FK_FACB93DF3A706D3 FOREIGN KEY (camion_id) REFERENCES camiones (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE users DROP password_plain');
    }
}
