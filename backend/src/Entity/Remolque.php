<?php

namespace App\Entity;

use App\Repository\RemolqueRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

#[ORM\Entity(repositoryClass: RemolqueRepository::class)]
#[ORM\Table(name: "remolques")]
class Remolque implements \JsonSerializable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer", options: ["unsigned" => true])]
    private ?int $id = null;

    #[Assert\NotBlank(message: "La matrícula es obligatoria")]
    #[Assert\Length(max: 20, maxMessage: "La matrícula no puede tener más de 20 caracteres")]
    #[ORM\Column(type: "string", length: 20, unique: true)]
    private ?string $matricula = null;

    #[Assert\Length(max: 50, maxMessage: "El tipo no puede superar los 50 caracteres")]
    #[ORM\Column(type: "string", length: 50, nullable: true)]
    private ?string $tipo = null;

    #[Assert\PositiveOrZero(message: "La capacidad no puede ser negativa")]
    #[ORM\Column(type: "integer", nullable: true)]
    private ?int $capacidad = null;

    #[Assert\PositiveOrZero(message: "La carga no puede ser negativa")]
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

    // --------------------
    // VALIDACIÓN DE NEGOCIO
    // --------------------

    #[Assert\Callback]
    public function validarCarga(ExecutionContextInterface $context): void
    {
        if ($this->carga !== null && $this->capacidad !== null) {
            if ($this->carga > $this->capacidad) {
                $context->buildViolation("La carga no puede superar la capacidad")
                    ->atPath('carga')
                    ->addViolation();
            }
        }
    }
}
