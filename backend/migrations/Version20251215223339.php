<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251215223339 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE camion_contratos ADD CONSTRAINT FK_FACB93DF3A706D3 FOREIGN KEY (camion_id) REFERENCES camiones (id)');
        $this->addSql('ALTER TABLE camion_contratos ADD CONSTRAINT FK_FACB93DF2576E0FD FOREIGN KEY (contract_id) REFERENCES contract (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE camion_contratos DROP FOREIGN KEY FK_FACB93DF3A706D3');
        $this->addSql('ALTER TABLE camion_contratos DROP FOREIGN KEY FK_FACB93DF2576E0FD');
    }
}
