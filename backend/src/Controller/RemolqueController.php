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

    #[Route('/{id}', methods: ['GET'])]
    public function show(?Remolque $remolque): JsonResponse
    {
        if (!$remolque) {
            return $this->json([
                'success' => false,
                'message' => 'Remolque no encontrado',
            ], 404);
        }

        return $this->json($remolque);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        // Validación básica
        if (empty($data['matricula'])) {
            return $this->json([
                'success' => false,
                'message' => 'La matrícula es obligatoria',
            ], 400);
        }

        $remolque = new Remolque();
        $remolque->setMatricula($data['matricula']);
        $remolque->setTipo($data['tipo'] ?? null);
        $remolque->setCapacidad($data['capacidad'] ?? null);

        // Carga inicial 0 si no se especifica
        $remolque->setCarga($data['carga'] ?? 0);

        $entityManager->persist($remolque);
        $entityManager->flush();

        return $this->json($remolque, 201);
    }

    #[Route('/{id}', methods: ['PUT', 'PATCH'])]
    public function update(Request $request, ?Remolque $remolque, EntityManagerInterface $entityManager): JsonResponse
    {
        if (!$remolque) {
            return $this->json([
                'success' => false,
                'message' => 'Remolque no encontrado',
            ], 404);
        }

        $data = json_decode($request->getContent(), true) ?? [];

        if (array_key_exists('matricula', $data)) {
            $remolque->setMatricula($data['matricula']);
        }
        if (array_key_exists('tipo', $data)) {
            $remolque->setTipo($data['tipo']);
        }
        if (array_key_exists('capacidad', $data)) {
            $remolque->setCapacidad($data['capacidad']);
        }
        if (array_key_exists('carga', $data)) {
            $remolque->setCarga($data['carga']);
        }

        $entityManager->flush();

        return $this->json($remolque);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(?Remolque $remolque, EntityManagerInterface $entityManager): JsonResponse
    {
        if (!$remolque) {
            return $this->json([
                'success' => false,
                'message' => 'Remolque no encontrado',
            ], 404);
        }

        $entityManager->remove($remolque);
        $entityManager->flush();

        return $this->json(null, 204);
    }
}