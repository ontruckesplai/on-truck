<?php
namespace App\Controller;

use App\Repository\CamionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/camiones')]
class CamionController extends ApiController
{

    public function __construct(
        private CamionRepository $repo,
        EntityManagerInterface $em
    ) {
        parent::__construct($em);
    }

 #[Route('', methods: ['GET'])]
    public function list(): JsonResponse
    {
        // 1. Obtenemos todos los camiones desde la base de datos
        $camiones = $this->repo->findAll();

        // 2. Devolvemos la respuesta en formato JSON estándar
        return $this->jsonSuccess($camiones);
    }
}


