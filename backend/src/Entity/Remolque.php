<?php

namespace App\Entity;

use App\Repository\RemolqueRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RemolqueRepository::class)]
#[ORM\Table(name: "remolques")]
class Remolque implements \JsonSerializable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer", options: ["unsigned" => true])]
    private ?int $id = null;

    #[ORM\Column(type: "string", length: 20, unique: true)]
    private ?string $matricula = null;

    #[ORM\Column(type: "string", length: 50, nullable: true)]
    private ?string $tipo = null;

    #[ORM\Column(type: "integer", nullable: true)]
    private ?int $capacidad = null;

    #[ORM\Column(type: "integer", nullable: true)]
    private ?int $carga = null;

    // --------------------
    // Getters / Setters
    // --------------------

    public function getId(): ?int
    {
        return $this->id ?? null;
    }

    public function getMatricula(): ?string
    {
        return $this->matricula;
    }

    public function setMatricula(string $matricula): self
    {
        $this->matricula = $matricula;
        return $this;
    }

    public function getTipo(): ?string
    {
        return $this->tipo;
    }

    public function setTipo(?string $tipo): self
    {
        $this->tipo = $tipo;
        return $this;
    }

    public function getCapacidad(): ?int
    {
        return $this->capacidad;
    }

    public function setCapacidad(?int $capacidad): self
    {
        $this->capacidad = $capacidad;
        return $this;
    }

    public function getCarga(): ?int
    {
        return $this->carga;
    }

    public function setCarga(?int $carga): self
    {
        $this->carga = $carga;
        return $this;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'matricula' => $this->matricula,
            'tipo' => $this->tipo,
            'capacidad' => $this->capacidad,
            'carga' => $this->carga,
        ];
    }
}
