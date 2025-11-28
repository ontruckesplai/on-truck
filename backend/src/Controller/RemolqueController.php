<?php

namespace App\Controller;

use App\Entity\Remolque;
use App\Repository\RemolqueRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/remolques')]
class RemolqueController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(RemolqueRepository $remolqueRepository): JsonResponse
    {
        $remolques = $remolqueRepository->findAll();
        return $this->json($remolques);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $remolque = new Remolque();
        $remolque->setMatricula($data['matricula']);
        $remolque->setTipo($data['tipo'] ?? null);
        $remolque->setCapacidad($data['capacidad'] ?? null);
        
        // Carga inicial 0 si no se especifica
        $remolque->setCarga(0);

        $entityManager->persist($remolque);
        $entityManager->flush();

        return $this->json($remolque, 201);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(Request $request, Remolque $remolque, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['matricula'])) {
            $remolque->setMatricula($data['matricula']);
        }
        if (isset($data['tipo'])) {
            $remolque->setTipo($data['tipo']);
        }
        if (isset($data['capacidad'])) {
            $remolque->setCapacidad($data['capacidad']);
        }

        $entityManager->flush();

        return $this->json($remolque);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(Remolque $remolque, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($remolque);
        $entityManager->flush();

        return $this->json(null, 204);
    }
}
