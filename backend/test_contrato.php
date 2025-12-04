<?php

require __DIR__ . '/vendor/autoload.php';

use App\Service\ServicioTiempoConduccion;
use App\Service\ServicioCompatibilidadContratos;

$tiempo = new ServicioTiempoConduccion();
$servicio = new ServicioCompatibilidadContratos($tiempo);

$distancia = 300;        // km A->B
$kg = 200000;            // peso total
$cap = 20000;            // capacidad remolque
$plazo = 240;            // horas de plazo

$horas = $servicio->calcularHorasContratoCompleto($distancia, $kg, $cap);
$ok = $servicio->puedeCumplirseContratoSolo($distancia, $kg, $cap, $plazo);

echo "Horas totales: $horas\n";
echo "Cumple plazo: " . ($ok ? 'SI' : 'NO') . "\n";
