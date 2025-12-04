<?php

namespace App\Service;

use App\Dto\DatosSimulacionContratos;
use App\Dto\ResultadoCompatibilidad;
use App\Service\ServicioTiempoConduccion;


final class ServicioCompatibilidadContratos
{
    public function __construct(
        private readonly ServicioTiempoConduccion $servicioTiempoConduccion
    ) {}
    /**
     * Calcula cuántas horas se tarda en cumplir un contrato completo
     * teniendo en cuenta:
     *  - distancia A→B de la ruta base
     *  - peso total a mover (kgTotales)
     *  - capacidad del remolque (kgCapacidadRemolque)
     *  - que siempre se vuelve vacío: A→B cargado, B→A vacío.
     *
     * Devuelve las horas reales totales (con descansos incluidos).
     */
    public function calcularContratoCompleto(
        float $distanciaRutaKm,
        float $kgTotales,
        float $kgCapacidadRemolque
    ): array {
        if ($kgCapacidadRemolque <= 0) {
            throw new \InvalidArgumentException('La capacidad del remolque debe ser mayor que 0');
        }

        // 1) ciclos necesarios (cada ciclo = ida cargado + vuelta vacío)
        $ciclos = (int) ceil($kgTotales / $kgCapacidadRemolque);

        // 2) distancia de un ciclo
        $distanciaCicloKm = 2 * $distanciaRutaKm;

        // 3) km totales
        $kmTotales = $ciclos * $distanciaCicloKm;

        // 4) horas reales
        $horasTotales = $this->servicioTiempoConduccion->calcularHorasParaKm($kmTotales);

        return [
            'ciclos' => $ciclos,
            'kmTotales' => $kmTotales,
            'horasTotales' => $horasTotales
        ];
    }

    /**
     * Devuelve true/false según si el contrato se puede cumplir
     * dentro del plazo máximo (en horas).
     */
       public function puedeCumplirseContratoSolo(
        float $distanciaRutaKm,
        float $kgTotales,
        float $kgCapacidadRemolque,
        float $plazoMaximoHoras
    ): array {
        $resultado = $this->calcularContratoCompleto(
            $distanciaRutaKm,
            $kgTotales,
            $kgCapacidadRemolque
        );

        $cumple = $resultado['horasTotales'] <= $plazoMaximoHoras;

        return [
            'cumple' => $cumple,
            'ciclos' => $resultado['ciclos'],
            'kmTotales' => $resultado['kmTotales'],
            'horasTotales' => $resultado['horasTotales']
        ];
    }

//---------------------------------------------------------------------------------------------------------------
    public function comprobarCompatibilidadDesdeFront(DatosSimulacionContratos $datos): ResultadoCompatibilidad
    {
        $horasPrincipal = $this->servicioTiempoConduccion->calcularHorasParaKm($datos->kmContratoPrincipal);
        $horasSubruta   = $this->servicioTiempoConduccion->calcularHorasParaKm($datos->kmSubruta);
        $horasSecundario = $this->servicioTiempoConduccion->calcularHorasParaKm($datos->kmContratoSecundario);
// Arreglo de formato horas
        $segundosPrincipal = (int) round($horasPrincipal * 3600);
$fechaEntregaPrincipal = $datos->fechaInicio->modify("+$segundosPrincipal seconds");

$segundosTotalB = (int) round(($horasSubruta + $horasSecundario) * 3600);
$fechaEntregaSecundario = $fechaEntregaPrincipal->modify("+$segundosTotalB seconds");

        $limitePrincipal = $datos->fechaInicio->modify(sprintf('+%d days',$datos->plazoPrincipalDias));
        $limiteSecundario = $datos->fechaInicio->modify(sprintf('+%d days',$datos->plazoSecundarioDias));

        $okPrincipal = $fechaEntregaPrincipal <= $limitePrincipal;
        $okSecundario = $fechaEntregaSecundario <= $limiteSecundario;

        return new ResultadoCompatibilidad(
            compatible: $okPrincipal && $okSecundario,
            fechaEntregaContratoPrincipal: $fechaEntregaPrincipal,
            fechaEntregaContratoSecundario: $fechaEntregaSecundario,
            kmSubrutaEntreContratos: $datos->kmSubruta,
            horasTotales: $horasPrincipal + $horasSubruta + $horasSecundario,
            detallesPlazos: [
                'principal_ok' => $okPrincipal,
                'secundario_ok' => $okSecundario,
                'limite_principal' => $limitePrincipal->format(DATE_ATOM),
                'limite_secundario' => $limiteSecundario->format(DATE_ATOM)
            ]
        );
    }
    //Hay que calcular camion - contrato y cuanto tarda


    public function comprobarCompatibilidadBidireccional(
    DatosSimulacionContratos $datosAB,
    DatosSimulacionContratos $datosBA
): ResultadoCompatibilidad {

    $resultadoAB = $this->comprobarCompatibilidadDesdeFront($datosAB);
    $resultadoBA = $this->comprobarCompatibilidadDesdeFront($datosBA);

    // Caso 1: solo A→B es válido
    if ($resultadoAB->compatible && !$resultadoBA->compatible) {
        return $resultadoAB;
    }

    // Caso 2: solo B→A es válido
    if ($resultadoBA->compatible && !$resultadoAB->compatible) {
        return $resultadoBA;
    }

    // Caso 3: los dos son válidos → el más rápido
    if ($resultadoAB->compatible && $resultadoBA->compatible) {
        return ($resultadoAB->horasTotales <= $resultadoBA->horasTotales)
            ? $resultadoAB
            : $resultadoBA;
    }

    // Caso 4: ninguno es válido → devuelve el "menos malo"
    return ($resultadoAB->horasTotales <= $resultadoBA->horasTotales)
        ? $resultadoAB
        : $resultadoBA;
}

}
