<?php

namespace App\Entity;

use App\Repository\ContractRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: ContractRepository::class)]
class Contract implements \JsonSerializable
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

    #[ORM\OneToMany(mappedBy: 'contract', targetEntity: CamionContrato::class)]
    private Collection $asignaciones;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->asignaciones = new ArrayCollection();
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

    /**
     * @return Collection<int, CamionContrato>
     */
    public function getAsignaciones(): Collection
    {
        return $this->asignaciones;
    }

    public function addAsignacion(CamionContrato $asignacion): static
    {
        if (!$this->asignaciones->contains($asignacion)) {
            $this->asignaciones->add($asignacion);
            $asignacion->setContract($this);
        }

        return $this;
    }

    public function removeAsignacion(CamionContrato $asignacion): static
    {
        if ($this->asignaciones->removeElement($asignacion)) {
            // set the owning side to null (unless already changed)
            if ($asignacion->getContract() === $this) {
                $asignacion->setContract(null);
            }
        }

        return $this;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'client_name' => $this->clientName,
            'total_quantity' => $this->totalQuantity,
            'product_type' => $this->productType,
            'deadline' => $this->deadline?->format('Y-m-d'),
            'origin_address' => $this->originAddress,
            'origin_lat' => $this->originLat,
            'origin_lon' => $this->originLon,
            'destination_address' => $this->destinationAddress,
            'destination_lat' => $this->destinationLat,
            'destination_lon' => $this->destinationLon,
            'status' => $this->status,
            'distance_km' => $this->distanceKm,
            'delivered_quantity' => $this->deliveredQuantity,
            'created_at' => $this->createdAt?->format('Y-m-d H:i:s'),
            'asignaciones' => $this->asignaciones->map(fn($a) => $a->jsonSerialize())->toArray(),
        ];
    }
}
