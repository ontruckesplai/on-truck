<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251205085320 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE camion_contratos (id INT AUTO_INCREMENT NOT NULL, camion_id INT UNSIGNED NOT NULL, contract_id INT NOT NULL, fecha_inicio DATETIME NOT NULL, fecha_fin_estimada DATETIME NOT NULL, estado VARCHAR(50) NOT NULL, INDEX IDX_FACB93DF3A706D3 (camion_id), INDEX IDX_FACB93DF2576E0FD (contract_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE camion_contratos ADD CONSTRAINT FK_FACB93DF3A706D3 FOREIGN KEY (camion_id) REFERENCES camiones (id)');
        $this->addSql('ALTER TABLE camion_contratos ADD CONSTRAINT FK_FACB93DF2576E0FD FOREIGN KEY (contract_id) REFERENCES contract (id)');
        $this->addSql('DROP TABLE users');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, roles JSON NOT NULL, password VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, password_plain VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, last_login DATETIME DEFAULT NULL, UNIQUE INDEX UNIQ_1483A5E9E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE camion_contratos DROP FOREIGN KEY FK_FACB93DF3A706D3');
        $this->addSql('ALTER TABLE camion_contratos DROP FOREIGN KEY FK_FACB93DF2576E0FD');
        $this->addSql('DROP TABLE camion_contratos');
    }
}
