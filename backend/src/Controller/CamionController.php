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
        $camiones = $this->repo->findAll();
        return $this->jsonSuccess($camiones);
    }

    #[Route('', methods: ['POST'])]
    public function create(\Symfony\Component\HttpFoundation\Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $camion = new \App\Entity\Camion();
        $camion->setMatricula($data['matricula']);
        $camion->setKms($data['kms'] ?? 0);
        $camion->setKmUltimaRevision($data['km_ultima_revision'] ?? null);
        $camion->setCombustible($data['combustible'] ?? null);
        $camion->setCv($data['cv'] ?? null);
        $camion->setConsumoMedio($data['consumo_medio'] ?? null);
        $camion->setInicio($data['inicio'] ?? null);
        $camion->setFin($data['fin'] ?? null);
        $camion->setNotas($data['notas'] ?? null);
        $camion->setTieneRemolque(false); // Por defecto

        $this->em->persist($camion);
        $this->em->flush();

        return $this->jsonSuccess($camion);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(int $id, \Symfony\Component\HttpFoundation\Request $request): JsonResponse
    {
        $camion = $this->repo->find($id);
        if (!$camion) {
            return $this->jsonError('Camión no encontrado', 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['matricula'])) $camion->setMatricula($data['matricula']);
        if (isset($data['kms'])) $camion->setKms($data['kms']);
        if (isset($data['km_ultima_revision'])) $camion->setKmUltimaRevision($data['km_ultima_revision']);
        if (isset($data['combustible'])) $camion->setCombustible($data['combustible']);
        if (isset($data['cv'])) $camion->setCv($data['cv']);
        if (isset($data['consumo_medio'])) $camion->setConsumoMedio($data['consumo_medio']);
        if (isset($data['inicio'])) $camion->setInicio($data['inicio']);
        if (isset($data['fin'])) $camion->setFin($data['fin']);
        if (isset($data['notas'])) $camion->setNotas($data['notas']);

        $this->em->flush();

        return $this->jsonSuccess($camion);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $camion = $this->repo->find($id);
        if (!$camion) {
            return $this->jsonError('Camión no encontrado', 404);
        }

        $this->em->remove($camion);
        $this->em->flush();

        return $this->jsonSuccess(['message' => 'Camión eliminado correctamente']);
    }
}


