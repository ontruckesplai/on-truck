<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251126111815 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE camiones (id INT UNSIGNED AUTO_INCREMENT NOT NULL, remolque_id INT UNSIGNED DEFAULT NULL, matricula VARCHAR(20) NOT NULL, kms INT NOT NULL, km_ultima_revision INT DEFAULT NULL, combustible INT DEFAULT NULL, cv INT DEFAULT NULL, consumo_medio DOUBLE PRECISION DEFAULT NULL, inicio VARCHAR(100) DEFAULT NULL, fin VARCHAR(100) DEFAULT NULL, notas LONGTEXT DEFAULT NULL, tiene_remolque TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_C64588C315DF1885 (matricula), UNIQUE INDEX UNIQ_C64588C37642CD57 (remolque_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE remolques (id INT UNSIGNED AUTO_INCREMENT NOT NULL, matricula VARCHAR(20) NOT NULL, tipo VARCHAR(50) DEFAULT NULL, capacidad INT DEFAULT NULL, carga INT DEFAULT NULL, UNIQUE INDEX UNIQ_BF6989E215DF1885 (matricula), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE rutas (id INT UNSIGNED AUTO_INCREMENT NOT NULL, camion_id INT UNSIGNED NOT NULL, distancia INT NOT NULL, duracion INT DEFAULT NULL, ubicacion VARCHAR(100) DEFAULT NULL, ubicacion_recogida VARCHAR(100) DEFAULT NULL, ubicacion_entrega VARCHAR(100) DEFAULT NULL, recogida_lat NUMERIC(10, 8) DEFAULT NULL, recogida_lng NUMERIC(11, 8) DEFAULT NULL, entrega_lat NUMERIC(10, 8) DEFAULT NULL, entrega_lng NUMERIC(11, 8) DEFAULT NULL, INDEX IDX_FFC3AEF03A706D3 (camion_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE camiones ADD CONSTRAINT FK_C64588C37642CD57 FOREIGN KEY (remolque_id) REFERENCES remolques (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE rutas ADD CONSTRAINT FK_FFC3AEF03A706D3 FOREIGN KEY (camion_id) REFERENCES camiones (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE camiones DROP FOREIGN KEY FK_C64588C37642CD57');
        $this->addSql('ALTER TABLE rutas DROP FOREIGN KEY FK_FFC3AEF03A706D3');
        $this->addSql('DROP TABLE camiones');
        $this->addSql('DROP TABLE remolques');
        $this->addSql('DROP TABLE rutas');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
