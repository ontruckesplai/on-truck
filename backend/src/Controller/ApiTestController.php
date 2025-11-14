<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

final class ApiTestController extends AbstractController
{
    #[Route('/api/hola', name: 'api_hola')]
    public function hola(): JsonResponse
    {
        return $this->json([
            'mensaje' => 'Hola desde Symfony'
        ]);
    }
}
