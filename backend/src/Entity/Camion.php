<?php

namespace App\Entity;

use App\Repository\CamionRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: CamionRepository::class)]
#[ORM\Table(name: "camiones")]
class Camion implements \JsonSerializable
{
    public function __construct()
    {
        $this->asignaciones = new ArrayCollection();
    }

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer", options: ["unsigned" => true])]
    private ?int $id = null;

    #[ORM\Column(type: "string", length: 20, unique: true)]
    private ?string $matricula = null;

    #[ORM\Column(type: "integer")]
    private int $kms;

    #[ORM\Column(type: "integer", nullable: true)]
    private ?int $km_ultima_revision = null;

    #[ORM\Column(type: "integer", nullable: true)]
    private ?int $combustible = null;

    #[ORM\Column(type: "integer", nullable: true)]
    private ?int $cv = null;

    #[ORM\Column(type: "float", nullable: true)]
    private ?float $consumo_medio = null;

    #[ORM\Column(type: "string", length: 100, nullable: true)]
    private ?string $inicio = null;

    #[ORM\Column(type: "string", length: 100, nullable: true)]
    private ?string $fin = null;

    #[ORM\Column(type: "text", nullable: true)]
    private ?string $notas = null;

    #[ORM\Column(type: "boolean")]
    private bool $tiene_remolque = false;

    #[ORM\OneToOne(targetEntity: Remolque::class)]
    #[ORM\JoinColumn(name: "remolque_id", referencedColumnName: "id", nullable: true, onDelete: "SET NULL")]
    private ?Remolque $remolque = null;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    private ?string $modelo = null;

    #[ORM\Column(type: "date", nullable: true)]
    private ?\DateTimeInterface $fecha_itv = null;

    #[ORM\OneToMany(mappedBy: 'camion', targetEntity: CamionContrato::class, orphanRemoval: true)]
    private Collection $asignaciones;


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

    public function getKms(): int
    {
        return $this->kms;
    }

    public function setKms(int $kms): self
    {
        $this->kms = $kms;
        return $this;
    }

    public function getKmUltimaRevision(): ?int
    {
        return $this->km_ultima_revision;
    }

    public function setKmUltimaRevision(?int $km): self
    {
        $this->km_ultima_revision = $km;
        return $this;
    }

    public function getCombustible(): ?int
    {
        return $this->combustible;
    }

    public function setCombustible(?int $combustible): self
    {
        $this->combustible = $combustible;
        return $this;
    }

    public function getCv(): ?int
    {
        return $this->cv;
    }

    public function setCv(?int $cv): self
    {
        $this->cv = $cv;
        return $this;
    }

    public function getConsumoMedio(): ?float
    {
        return $this->consumo_medio;
    }

    public function setConsumoMedio(?float $consumo): self
    {
        $this->consumo_medio = $consumo;
        return $this;
    }

    public function getInicio(): ?string
    {
        return $this->inicio;
    }

    public function setInicio(?string $inicio): self
    {
        $this->inicio = $inicio;
        return $this;
    }

    public function getFin(): ?string
    {
        return $this->fin;
    }

    public function setFin(?string $fin): self
    {
        $this->fin = $fin;
        return $this;
    }

    public function getNotas(): ?string
    {
        return $this->notas;
    }

    public function setNotas(?string $notas): self
    {
        $this->notas = $notas;
        return $this;
    }

    public function getTieneRemolque(): bool
    {
        return $this->tiene_remolque;
    }

    public function setTieneRemolque(bool $valor): self
    {
        $this->tiene_remolque = $valor;
        return $this;
    }

    public function getRemolque(): ?Remolque
    {
        return $this->remolque;
    }

    public function setRemolque(?Remolque $remolque): self
    {
        $this->remolque = $remolque;
        return $this;
    }

    public function getModelo(): ?string
    {
        return $this->modelo;
    }

    public function setModelo(?string $modelo): self
    {
        $this->modelo = $modelo;
        return $this;
    }

    public function getFechaItv(): ?\DateTimeInterface
    {
        return $this->fecha_itv;
    }

    public function setFechaItv(?\DateTimeInterface $fecha_itv): self
    {
        $this->fecha_itv = $fecha_itv;
        return $this;
    }

    /**
     * @return Collection<int, CamionContrato>
     */
    public function getAsignaciones(): Collection
    {
        return $this->asignaciones;
    }

    public function addAsignacion(CamionContrato $asignacion): self
    {
        if (!$this->asignaciones->contains($asignacion)) {
            $this->asignaciones->add($asignacion);
            $asignacion->setCamion($this);
        }

        return $this;
    }

    public function removeAsignacion(CamionContrato $asignacion): self
    {
        if ($this->asignaciones->removeElement($asignacion)) {
            // set the owning side to null (unless already changed)
            if ($asignacion->getCamion() === $this) {
                $asignacion->setCamion(null);
            }
        }

        return $this;
    }


    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'matricula' => $this->matricula,
            'kms' => $this->kms,
            'kmUltimaRevision' => $this->km_ultima_revision,
            'combustible' => $this->combustible,
            'cv' => $this->cv,
            'consumoMedio' => $this->consumo_medio,
            'inicio' => $this->inicio,
            'fin' => $this->fin,
            'notas' => $this->notas,
            'tieneRemolque' => $this->tiene_remolque,
            'remolque' => $this->remolque,
            'modelo' => $this->modelo,
            'fechaItv' => $this->fecha_itv?->format('Y-m-d'),
            'asignaciones' => $this->asignaciones->map(fn($a) => $a->jsonSerialize())->toArray(),
        ];
    }
}
