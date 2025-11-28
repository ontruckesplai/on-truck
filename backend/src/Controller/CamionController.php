<?php
namespace App\Controller;

use App\Entity\Camion;
use App\Entity\Remolque;
use App\Repository\CamionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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
        $camion->setModelo($data['modelo'] ?? null);
        if (isset($data['fecha_itv'])) {
            $camion->setFechaItv(new \DateTime($data['fecha_itv']));
        }
        $camion->setTieneRemolque(false); // Por defecto

        $this->em->persist($camion);
        $this->em->flush();

        return $this->jsonSuccess($camion);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(Request $request, Camion $camion, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['matricula'])) {
            $camion->setMatricula($data['matricula']);
        }
        if (isset($data['kms'])) {
            $camion->setKms($data['kms']);
        }
        if (isset($data['kmUltimaRevision'])) {
            $camion->setKmUltimaRevision($data['kmUltimaRevision']);
        }
        if (isset($data['combustible'])) {
            $camion->setCombustible($data['combustible']);
        }
        if (isset($data['cv'])) {
            $camion->setCv($data['cv']);
        }
        if (isset($data['consumoMedio'])) {
            $camion->setConsumoMedio($data['consumoMedio']);
        }
        if (isset($data['inicio'])) {
            $camion->setInicio($data['inicio']);
        }
        if (isset($data['fin'])) {
            $camion->setFin($data['fin']);
        }
        if (isset($data['notas'])) {
            $camion->setNotas($data['notas']);
        }
        if (isset($data['modelo'])) {
            $camion->setModelo($data['modelo']);
        }
        if (isset($data['fecha_itv'])) {
            $camion->setFechaItv(new \DateTime($data['fecha_itv']));
        }

        $entityManager->flush();

        return $this->jsonSuccess($camion);
    }

    #[Route('/{id}/link-trailer', methods: ['POST'])]
    public function linkTrailer(Request $request, Camion $camion, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $remolqueId = $data['remolque_id'] ?? null;

        if (!$remolqueId) {
            return $this->json(['error' => 'Remolque ID is required'], 400);
        }

        $remolque = $entityManager->getRepository(Remolque::class)->find($remolqueId);

        if (!$remolque) {
            return $this->json(['error' => 'Remolque not found'], 404);
        }

        $camion->setRemolque($remolque);
        $camion->setTieneRemolque(true);
        $entityManager->flush();

        return $this->jsonSuccess($camion);
    }

    #[Route('/{id}/unlink-trailer', methods: ['POST'])]
    public function unlinkTrailer(Camion $camion, EntityManagerInterface $entityManager): JsonResponse
    {
        $camion->setRemolque(null);
        $camion->setTieneRemolque(false);
        $entityManager->flush();

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


