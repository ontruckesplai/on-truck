<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251215115724 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE camion_contratos (id INT AUTO_INCREMENT NOT NULL, camion_id INT UNSIGNED NOT NULL, contract_id INT NOT NULL, fecha_inicio DATETIME NOT NULL, fecha_fin_estimada DATETIME NOT NULL, estado VARCHAR(50) NOT NULL, INDEX IDX_FACB93DF3A706D3 (camion_id), INDEX IDX_FACB93DF2576E0FD (contract_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE camiones (id INT UNSIGNED AUTO_INCREMENT NOT NULL, remolque_id INT UNSIGNED DEFAULT NULL, matricula VARCHAR(20) NOT NULL, kms INT NOT NULL, km_ultima_revision INT DEFAULT NULL, combustible INT DEFAULT NULL, cv INT DEFAULT NULL, consumo_medio DOUBLE PRECISION DEFAULT NULL, inicio VARCHAR(100) DEFAULT NULL, fin VARCHAR(100) DEFAULT NULL, notas LONGTEXT DEFAULT NULL, tiene_remolque TINYINT(1) NOT NULL, modelo VARCHAR(255) DEFAULT NULL, fecha_itv DATE DEFAULT NULL, UNIQUE INDEX UNIQ_C64588C315DF1885 (matricula), UNIQUE INDEX UNIQ_C64588C37642CD57 (remolque_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE contract (id INT AUTO_INCREMENT NOT NULL, client_name VARCHAR(255) NOT NULL, total_quantity INT NOT NULL, product_type VARCHAR(100) NOT NULL, deadline DATE NOT NULL, origin_address VARCHAR(255) NOT NULL, origin_lat NUMERIC(10, 8) DEFAULT NULL, origin_lon NUMERIC(11, 8) DEFAULT NULL, destination_address VARCHAR(255) NOT NULL, destination_lat NUMERIC(10, 8) DEFAULT NULL, destination_lon NUMERIC(11, 8) DEFAULT NULL, status VARCHAR(20) NOT NULL, distance_km DOUBLE PRECISION DEFAULT NULL, delivered_quantity INT DEFAULT 0 NOT NULL, created_at DATETIME DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE remolques (id INT UNSIGNED AUTO_INCREMENT NOT NULL, matricula VARCHAR(20) NOT NULL, tipo VARCHAR(50) DEFAULT NULL, capacidad INT DEFAULT NULL, carga INT DEFAULT NULL, UNIQUE INDEX UNIQ_BF6989E215DF1885 (matricula), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE rutas (id INT UNSIGNED AUTO_INCREMENT NOT NULL, camion_id INT UNSIGNED NOT NULL, distancia INT NOT NULL, duracion INT DEFAULT NULL, ubicacion VARCHAR(100) DEFAULT NULL, ubicacion_recogida VARCHAR(100) DEFAULT NULL, ubicacion_entrega VARCHAR(100) DEFAULT NULL, recogida_lat NUMERIC(10, 8) DEFAULT NULL, recogida_lng NUMERIC(11, 8) DEFAULT NULL, entrega_lat NUMERIC(10, 8) DEFAULT NULL, entrega_lng NUMERIC(11, 8) DEFAULT NULL, INDEX IDX_FFC3AEF03A706D3 (camion_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, password_plain VARCHAR(255) DEFAULT NULL, last_login DATETIME DEFAULT NULL, first_name VARCHAR(100) DEFAULT NULL, last_name VARCHAR(100) DEFAULT NULL, verification_code VARCHAR(6) DEFAULT NULL, is_verified TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_1483A5E9E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE camion_contratos ADD CONSTRAINT FK_FACB93DF3A706D3 FOREIGN KEY (camion_id) REFERENCES camiones (id)');
        $this->addSql('ALTER TABLE camion_contratos ADD CONSTRAINT FK_FACB93DF2576E0FD FOREIGN KEY (contract_id) REFERENCES contract (id)');
        $this->addSql('ALTER TABLE camiones ADD CONSTRAINT FK_C64588C37642CD57 FOREIGN KEY (remolque_id) REFERENCES remolques (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE rutas ADD CONSTRAINT FK_FFC3AEF03A706D3 FOREIGN KEY (camion_id) REFERENCES camiones (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE camion_contratos DROP FOREIGN KEY FK_FACB93DF3A706D3');
        $this->addSql('ALTER TABLE camion_contratos DROP FOREIGN KEY FK_FACB93DF2576E0FD');
        $this->addSql('ALTER TABLE camiones DROP FOREIGN KEY FK_C64588C37642CD57');
        $this->addSql('ALTER TABLE rutas DROP FOREIGN KEY FK_FFC3AEF03A706D3');
        $this->addSql('DROP TABLE camion_contratos');
        $this->addSql('DROP TABLE camiones');
        $this->addSql('DROP TABLE contract');
        $this->addSql('DROP TABLE remolques');
        $this->addSql('DROP TABLE rutas');
        $this->addSql('DROP TABLE users');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
