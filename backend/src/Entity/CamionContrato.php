<?php

namespace App\Entity;

use App\Repository\CamionContratoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CamionContratoRepository::class)]
#[ORM\Table(name: "camion_contratos")]
class CamionContrato implements \JsonSerializable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'asignaciones')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Camion $camion = null;

    #[ORM\ManyToOne(inversedBy: 'asignaciones')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Contract $contract = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $fechaInicio = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $fechaFinEstimada = null;

    #[ORM\Column(length: 50)]
    private ?string $estado = 'PROGRAMADO'; // PROGRAMADO, EN_CURSO, COMPLETADO

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCamion(): ?Camion
    {
        return $this->camion;
    }

    public function setCamion(?Camion $camion): static
    {
        $this->camion = $camion;

        return $this;
    }

    public function getContract(): ?Contract
    {
        return $this->contract;
    }

    public function setContract(?Contract $contract): static
    {
        $this->contract = $contract;

        return $this;
    }

    public function getFechaInicio(): ?\DateTimeInterface
    {
        return $this->fechaInicio;
    }

    public function setFechaInicio(\DateTimeInterface $fechaInicio): static
    {
        $this->fechaInicio = $fechaInicio;

        return $this;
    }

    public function getFechaFinEstimada(): ?\DateTimeInterface
    {
        return $this->fechaFinEstimada;
    }

    public function setFechaFinEstimada(\DateTimeInterface $fechaFinEstimada): static
    {
        $this->fechaFinEstimada = $fechaFinEstimada;

        return $this;
    }

    public function getEstado(): ?string
    {
        return $this->estado;
    }

    public function setEstado(string $estado): static
    {
        $this->estado = $estado;

        return $this;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'camion_id' => $this->camion?->getId(),
            'contract_id' => $this->contract?->getId(),
            'contract_client' => $this->contract?->getClientName(),
            'fecha_inicio' => $this->fechaInicio?->format('Y-m-d\TH:i:s'),
            'fecha_fin_estimada' => $this->fechaFinEstimada?->format('Y-m-d\TH:i:s'),
            'estado' => $this->estado,
        ];
    }
}
