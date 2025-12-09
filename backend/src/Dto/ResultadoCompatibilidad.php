<?php

namespace App\Dto;

/**
 * Resultado de la simulación de compatibilidad entre dos contratos.
 */
final class ResultadoCompatibilidad
{
    public function __construct(
        public readonly bool $compatible,
        public readonly \DateTimeImmutable $fechaEntregaContratoPrincipal,
        public readonly \DateTimeImmutable $fechaEntregaContratoSecundario,
        public readonly float $kmSubrutaEntreContratos,
        public readonly float $horasTotales,
        public readonly array $detallesPlazos // info extra para frontend/informes
    ) {
    }
}
