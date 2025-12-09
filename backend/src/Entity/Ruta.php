<?php

namespace App\Entity;

use App\Repository\RutaRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Camion;

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

    #[ORM\Column(name: "ubicacion_recogida", type: "string", length: 100, nullable: true)]
    private ?string $ubicacionRecogida = null;

    #[ORM\Column(name: "ubicacion_entrega", type: "string", length: 100, nullable: true)]
    private ?string $ubicacionEntrega = null;

    #[ORM\Column(name: "recogida_lat", type: "decimal_float", precision: 10, scale: 8, nullable: true)]
    private ?float $recogidaLat = null;

    #[ORM\Column(name: "recogida_lng", type: "decimal_float", precision: 11, scale: 8, nullable: true)]
    private ?float $recogidaLng = null;

    #[ORM\Column(name: "entrega_lat", type: "decimal_float", precision: 10, scale: 8, nullable: true)]
    private ?float $entregaLat = null;

    #[ORM\Column(name: "entrega_lng", type: "decimal_float", precision: 11, scale: 8, nullable: true)]
    private ?float $entregaLng = null;

    #[ORM\ManyToOne(targetEntity: Camion::class)]
    #[ORM\JoinColumn(name: "camion_id", referencedColumnName: "id", nullable: false, onDelete: "CASCADE")]
    private ?Camion $camion = null;

    // --------------------
    // GETTERS / SETTERS
    // --------------------

    public function getId(): ?int { return $this->id; }

    public function getDistancia(): int { return $this->distancia; }
    public function setDistancia(int $v): self { $this->distancia = $v; return $this; }

    public function getDuracion(): ?int { return $this->duracion; }
    public function setDuracion(?int $v): self { $this->duracion = $v; return $this; }

    public function getUbicacion(): ?string { return $this->ubicacion; }
    public function setUbicacion(?string $v): self { $this->ubicacion = $v; return $this; }

    public function getUbicacionRecogida(): ?string { return $this->ubicacionRecogida; }
    public function setUbicacionRecogida(?string $v): self { $this->ubicacionRecogida = $v; return $this; }

    public function getUbicacionEntrega(): ?string { return $this->ubicacionEntrega; }
    public function setUbicacionEntrega(?string $v): self { $this->ubicacionEntrega = $v; return $this; }

    public function getRecogidaLat(): ?float { return $this->recogidaLat; }
    public function setRecogidaLat(?float $v): self { $this->recogidaLat = $v; return $this; }

    public function getRecogidaLng(): ?float { return $this->recogidaLng; }
    public function setRecogidaLng(?float $v): self { $this->recogidaLng = $v; return $this; }

    public function getEntregaLat(): ?float { return $this->entregaLat; }
    public function setEntregaLat(?float $v): self { $this->entregaLat = $v; return $this; }

    public function getEntregaLng(): ?float { return $this->entregaLng; }
    public function setEntregaLng(?float $v): self { $this->entregaLng = $v; return $this; }

    public function getCamion(): ?Camion { return $this->camion; }
    public function setCamion(Camion $v): self { $this->camion = $v; return $this; }
}
