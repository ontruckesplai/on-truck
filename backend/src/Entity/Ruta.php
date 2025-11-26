<?php

namespace App\Entity;

use App\Repository\RutaRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RutaRepository::class)]
#[ORM\Table(name: "rutas")]
class Ruta
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer", options: ["unsigned" => true])]
    private ?int $id = null;

    #[ORM\Column(type: "integer")]
    private int $distancia;

    #[ORM\Column(type: "integer", nullable: true)]
    private ?int $duracion = null;

    #[ORM\Column(type: "string", length: 100, nullable: true)]
    private ?string $ubicacion = null;

    #[ORM\Column(type: "string", length: 100, nullable: true)]
    private ?string $ubicacion_recogida = null;

    #[ORM\Column(type: "string", length: 100, nullable: true)]
    private ?string $ubicacion_entrega = null;

    #[ORM\Column(type: "decimal", precision: 10, scale: 8, nullable: true)]
    private ?string $recogida_lat = null;

    #[ORM\Column(type: "decimal", precision: 11, scale: 8, nullable: true)]
    private ?string $recogida_lng = null;

    #[ORM\Column(type: "decimal", precision: 10, scale: 8, nullable: true)]
    private ?string $entrega_lat = null;

    #[ORM\Column(type: "decimal", precision: 11, scale: 8, nullable: true)]
    private ?string $entrega_lng = null;

    #[ORM\ManyToOne(targetEntity: Camion::class)]
    #[ORM\JoinColumn(name: "camion_id", referencedColumnName: "id", nullable: false, onDelete: "CASCADE")]
    private ?Camion $camion = null;

    // --------------------
    // Getters / Setters
    // --------------------

    public function getId(): ?int { return $this->id; }

    public function getDistancia(): int { return $this->distancia; }
    public function setDistancia(int $v): self { $this->distancia = $v; return $this; }

    public function getDuracion(): ?int { return $this->duracion; }
    public function setDuracion(?int $v): self { $this->duracion = $v; return $this; }

    public function getUbicacion(): ?string { return $this->ubicacion; }
    public function setUbicacion(?string $v): self { $this->ubicacion = $v; return $this; }

    public function getUbicacionRecogida(): ?string { return $this->ubicacion_recogida; }
    public function setUbicacionRecogida(?string $v): self { $this->ubicacion_recogida = $v; return $this; }

    public function getUbicacionEntrega(): ?string { return $this->ubicacion_entrega; }
    public function setUbicacionEntrega(?string $v): self { $this->ubicacion_entrega = $v; return $this; }

    public function getRecogidaLat(): ?string { return $this->recogida_lat; }
    public function setRecogidaLat(?string $v): self { $this->recogida_lat = $v; return $this; }

    public function getRecogidaLng(): ?string { return $this->recogida_lng; }
    public function setRecogidaLng(?string $v): self { $this->recogida_lng = $v; return $this; }

    public function getEntregaLat(): ?string { return $this->entrega_lat; }
    public function setEntregaLat(?string $v): self { $this->entrega_lat = $v; return $this; }

    public function getEntregaLng(): ?string { return $this->entrega_lng; }
    public function setEntregaLng(?string $v): self { $this->entrega_lng = $v; return $this; }

    public function getCamion(): ?Camion { return $this->camion; }
    public function setCamion(?Camion $v): self { $this->camion = $v; return $this; }
}
