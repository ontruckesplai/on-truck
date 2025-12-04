<?php

namespace App\Dto;

/**
 * DTO sencillo para trabajar con contratos en la lógica de rutas.
 * Aquí NO metemos entidades de Doctrine, solo datos planos.
 */
final class DatosContrato
{
    public function __construct(
        public readonly int $id,
        public readonly float $distanciaKm,
        public readonly int $plazoMaximoDias,
        public readonly float $latOrigen,
        public readonly float $lngOrigen,
        public readonly float $latDestino,
        public readonly float $lngDestino,
        public readonly \DateTimeImmutable $fechaInicio
    ) {
    }
}
