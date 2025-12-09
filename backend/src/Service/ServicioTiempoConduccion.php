<?php

namespace App\Service;

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
}
