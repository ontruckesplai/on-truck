<?php

namespace App\Service;

use App\Entity\Camion;
use App\Entity\Contract;

/**
 * Calcula tiempos de conducción usando bloques de:
 *  - 8 horas de conducción
 *  - 12 horas de descanso
 *  = 20h por bloque, avanzando 650 km por bloque.
 *
 * Velocidad efectiva: 650 km / 20h = 32.5 km/h.
 */
final class ServicioTiempoConduccion
{
    private const KM_POR_BLOQUE = 650.0;        // km que hace en 8h conducción + 12h descanso
    private const HORAS_POR_BLOQUE = 20.0;      // 8h + 12h
    private const VELOCIDAD_MEDIA_REAL_KM_H = self::KM_POR_BLOQUE / self::HORAS_POR_BLOQUE; // 32.5 km/h

    /**
     * Dada una distancia en km, devuelve las horas reales de viaje
     * incluyendo descansos, usando la velocidad efectiva 32.5 km/h.
     */
    public function calcularHorasParaKm(float $distanciaKm): float
    {
        return $distanciaKm / self::VELOCIDAD_MEDIA_REAL_KM_H;
    }

    public function convertirHorasADias(float $horas): float
    {
        return $horas / 24.0;
    }

    /**
     * Calcula la estimación completa del trabajo
     */
    public function calcularEstimacion(Contract $contract, Camion $camion, \DateTime $fechaInicio): array
    {
        $remolque = $camion->getRemolque();
        if (!$remolque) {
            throw new \InvalidArgumentException('El camión no tiene remolque asignado.');
        }

        $capacidad = $remolque->getCapacidad();
        if ($capacidad <= 0) {
            throw new \InvalidArgumentException('El remolque tiene capacidad 0 o inválida.');
        }

        $totalQuantity = $contract->getTotalQuantity();
        if ($totalQuantity <= 0) {
             throw new \InvalidArgumentException('El contrato no tiene cantidad de carga válida.');
        }

        // 1. Calcular Viajes
        $trips = (int) ceil($totalQuantity / $capacidad);

        // 2. Calcular Distancia Total
        $distanceOneWay = $contract->getDistanceKm() ?: 500.0; // Fallback
        
        // Si hay mas de un viaje, hay que volver (trips-1 veces) y luego ir una ultima vez
        // Distancia = (Ida + Vuelta) * (trips - 1) + Ida
        // Simplificado: Ida * 2 * (trips - 1) + Ida
        $totalDistance = ($trips > 1) 
            ? (($distanceOneWay * 2 * ($trips - 1)) + $distanceOneWay) 
            : $distanceOneWay;

        // 3. Calcular Tiempo
        $horasNecesarias = $this->calcularHorasParaKm($totalDistance);

        // 4. Calcular Fecha Fin
        $fechaFin = clone $fechaInicio;
        // Convertir a minutos para mayor precision en el modify
        $minutosNecesarios = (int) ($horasNecesarias * 60);
        $fechaFin->modify("+{$minutosNecesarios} minutes");

        return [
            'trips' => $trips,
            'total_distance' => $totalDistance,
            'hours_needed' => $horasNecesarias,
            'fecha_fin_estimada' => $fechaFin
        ];
    }
}
