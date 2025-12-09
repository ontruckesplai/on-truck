<?php

namespace App\Dto;

/**
 * Datos que vienen directamente del frontend (con OpenStreetMap).
 */
final class DatosSimulacionContratos
{
    public function __construct(
        public readonly int $idContratoPrincipal,
        public readonly float $kmContratoPrincipal,
        public readonly int $plazoPrincipalDias,

        public readonly int $idContratoSecundario,
        public readonly float $kmContratoSecundario,
        public readonly int $plazoSecundarioDias,

        public readonly float $kmSubruta,
        public readonly \DateTimeImmutable $fechaInicio
    ) {}
}
