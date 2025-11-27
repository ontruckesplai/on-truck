<?php
namespace App\Controller;

use App\Repository\RemolqueRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Remolque;
use Symfony\Component\HttpFoundation\Request;


#[Route('/api/remolques')]
class RemolqueController extends ApiController
{
    public function __construct(
        private RemolqueRepository $repo,
        EntityManagerInterface $em
    ) {
        parent::__construct($em);
    }
    #[Route('', methods: ['GET'])]
public function list(): JsonResponse{
    $remolques = $this->repo->findAll();
    return $this->jsonSuccess($remolques);
}

#[Route('/{id}', methods: ['GET'])]
public function one(?Remolque $remolque): JsonResponse
{
    if (!$remolque) {
        return $this->jsonError("Remolque no encontrado", 404);
    }

    return $this->jsonSuccess($remolque);
}

#[Route('', methods: ['POST'])]
public function create(Request $request): JsonResponse
{
    $data = $this->getJsonBody($request);

    if (empty($data['matricula'])) {
        return $this->jsonError("La matrícula es obligatoria");
    }

    $remolque = new Remolque();
    $remolque->setMatricula($data['matricula'] ?? null);
    $remolque->setTipo($data['tipo'] ?? null);
    $remolque->setCapacidad($data['capacidad'] ?? null);
    $remolque->setCarga($data['carga'] ?? 0);

    $this->em->persist($remolque);
    $this->em->flush();

    return $this->jsonSuccess($remolque, 201);
}
#[Route('/{id}', methods: ['PUT'])]
public function update(Request $request, ?Remolque $remolque): JsonResponse
{
    if (!$remolque) {
        return $this->jsonError("No existe", 404);
    }

    $data = $this->getJsonBody($request);

    $remolque->setMatricula($data['matricula'] ?? $remolque->getMatricula());
    $remolque->setTipo($data['tipo'] ?? $remolque->getTipo());
    $remolque->setCapacidad($data['capacidad'] ?? $remolque->getCapacidad());
    $remolque->setCarga($data['carga'] ?? $remolque->getCarga());

    $this->em->flush();

    return $this->jsonSuccess($remolque);
}
#[Route('/{id}', methods: ['DELETE'])]
public function delete(?Remolque $remolque): JsonResponse
{
    if (!$remolque) {
        return $this->jsonError("No existe", 404);
    }

    $this->em->remove($remolque);
    $this->em->flush();

    return $this->jsonSuccess("Remolque eliminado");
}

}

