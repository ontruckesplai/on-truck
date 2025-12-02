<?php

namespace App\Entity;

use App\Repository\ContractRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ContractRepository::class)]
class Contract
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $clientName = null;

    #[ORM\Column]
    private ?int $totalQuantity = null;

    #[ORM\Column(length: 100)]
    private ?string $productType = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTime $deadline = null;

    #[ORM\Column(length: 255)]
    private ?string $originAddress = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 8, nullable: true)]
    private ?string $originLat = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 11, scale: 8, nullable: true)]
    private ?string $originLon = null;

    #[ORM\Column(length: 255)]
    private ?string $destinationAddress = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 8, nullable: true)]
    private ?string $destinationLat = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 11, scale: 8, nullable: true)]
    private ?string $destinationLon = null;

    #[ORM\Column(length: 20)]
    private ?string $status = 'pending';

    #[ORM\Column(type: 'float', nullable: true)]
    private ?float $distanceKm = null;

    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    private ?int $deliveredQuantity = 0;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDistanceKm(): ?float
    {
        return $this->distanceKm;
    }

    public function setDistanceKm(?float $distanceKm): static
    {
        $this->distanceKm = $distanceKm;

        return $this;
    }

    public function getDeliveredQuantity(): ?int
    {
        return $this->deliveredQuantity;
    }

    public function setDeliveredQuantity(int $deliveredQuantity): static
    {
        $this->deliveredQuantity = $deliveredQuantity;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getClientName(): ?string
    {
        return $this->clientName;
    }

    public function setClientName(string $clientName): static
    {
        $this->clientName = $clientName;

        return $this;
    }

    public function getTotalQuantity(): ?int
    {
        return $this->totalQuantity;
    }

    public function setTotalQuantity(int $totalQuantity): static
    {
        $this->totalQuantity = $totalQuantity;

        return $this;
    }

    public function getProductType(): ?string
    {
        return $this->productType;
    }

    public function setProductType(string $productType): static
    {
        $this->productType = $productType;

        return $this;
    }

    public function getDeadline(): ?\DateTime
    {
        return $this->deadline;
    }

    public function setDeadline(\DateTime $deadline): static
    {
        $this->deadline = $deadline;

        return $this;
    }

    public function getOriginAddress(): ?string
    {
        return $this->originAddress;
    }

    public function setOriginAddress(string $originAddress): static
    {
        $this->originAddress = $originAddress;

        return $this;
    }

    public function getOriginLat(): ?string
    {
        return $this->originLat;
    }

    public function setOriginLat(?string $originLat): static
    {
        $this->originLat = $originLat;

        return $this;
    }

    public function getOriginLon(): ?string
    {
        return $this->originLon;
    }

    public function setOriginLon(?string $originLon): static
    {
        $this->originLon = $originLon;

        return $this;
    }

    public function getDestinationAddress(): ?string
    {
        return $this->destinationAddress;
    }

    public function setDestinationAddress(string $destinationAddress): static
    {
        $this->destinationAddress = $destinationAddress;

        return $this;
    }

    public function getDestinationLat(): ?string
    {
        return $this->destinationLat;
    }

    public function setDestinationLat(?string $destinationLat): static
    {
        $this->destinationLat = $destinationLat;

        return $this;
    }

    public function getDestinationLon(): ?string
    {
        return $this->destinationLon;
    }

    public function setDestinationLon(?string $destinationLon): static
    {
        $this->destinationLon = $destinationLon;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }
}
