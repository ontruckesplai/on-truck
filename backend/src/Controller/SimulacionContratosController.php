<?php

namespace App\Controller;

use App\Dto\DatosSimulacionContratos;
use App\Service\ServicioCompatibilidadContratos;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

final class SimulacionContratosController extends AbstractController
{
    #[Route('/api/contratos/simular', name: 'api_simular_contratos', methods: ['POST'])]
    public function simular(
        Request $request,
        ServicioCompatibilidadContratos $servicio
    ): JsonResponse {

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return new JsonResponse(['error' => 'JSON inválido'], 400);
        }

        $camposRequeridos = [
            'idContratoPrincipal',
            'kmContratoPrincipal',
            'plazoPrincipalDias',
            'idContratoSecundario',
            'kmContratoSecundario',
            'plazoSecundarioDias',
            'kmSubruta',
            'fechaInicio'
        ];

        foreach ($camposRequeridos as $campo) {
            if (!isset($data[$campo])) {
                return new JsonResponse(['error' => "Falta el campo $campo"], 400);
            }
        }

        $datosAB = new DatosSimulacionContratos(
            idContratoPrincipal: (int)$data['idContratoPrincipal'],
            kmContratoPrincipal: (float)$data['kmContratoPrincipal'],
            plazoPrincipalDias: (int)$data['plazoPrincipalDias'],

            idContratoSecundario: (int)$data['idContratoSecundario'],
            kmContratoSecundario: (float)$data['kmContratoSecundario'],
            plazoSecundarioDias: (int)$data['plazoSecundarioDias'],

            kmSubruta: (float)$data['kmSubruta'],
            fechaInicio: new \DateTimeImmutable($data['fechaInicio'])
        );

        $datosBA = new DatosSimulacionContratos(
            idContratoPrincipal: (int)$data['idContratoSecundario'],
            kmContratoPrincipal: (float)$data['kmContratoSecundario'],
            plazoPrincipalDias: (int)$data['plazoSecundarioDias'],

            idContratoSecundario: (int)$data['idContratoPrincipal'],
            kmContratoSecundario: (float)$data['kmContratoPrincipal'],
            plazoSecundarioDias: (int)$data['plazoPrincipalDias'],

            kmSubruta: (float)$data['kmSubruta'],
            fechaInicio: new \DateTimeImmutable($data['fechaInicio'])
        );

        $resultado = $servicio->comprobarCompatibilidadBidireccional($datosAB, $datosBA);

        return new JsonResponse([
            'compatible' => $resultado->compatible,
            'fechaEntregaContratoPrincipal' => $resultado->fechaEntregaContratoPrincipal->format(DATE_ATOM),
            'fechaEntregaContratoSecundario' => $resultado->fechaEntregaContratoSecundario->format(DATE_ATOM),
            'kmSubrutaEntreContratos' => $resultado->kmSubrutaEntreContratos,
            'horasTotales' => round($resultado->horasTotales, 2),
            'detallesPlazos' => $resultado->detallesPlazos
        ]);
    }
}
