<?php

namespace App\Controller;

use App\Entity\Ruta;
use App\Entity\Camion;
use App\Repository\RutaRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/rutas')]
class RutaController extends ApiController
{
    public function __construct(
        private RutaRepository $repo,
        EntityManagerInterface $em
    ) {
        parent::__construct($em);
    }

    // ------------------------
    // GET /api/rutas
    // ------------------------
    #[Route('', methods: ['GET'])]
    public function list(): JsonResponse
    {
        return $this->jsonSuccess($this->repo->findAll());
    }

    // ------------------------
    // GET /api/rutas/{id}
    // ------------------------
    #[Route('/{id}', methods: ['GET'])]
    public function one(?Ruta $ruta): JsonResponse
    {
        if (!$ruta) {
            return $this->jsonError("Ruta no encontrada", 404);
        }

        return $this->jsonSuccess($ruta);
    }

    // ------------------------
    // POST /api/rutas
    // ------------------------
    #[Route('', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = $this->getJsonBody($request);

        $ruta = new Ruta();

        $ruta->setUbicacionRecogida($data['ubicacion_recogida'] ?? null);
        $ruta->setUbicacionEntrega($data['ubicacion_entrega'] ?? null);
        $ruta->setDistancia($data['distancia'] ?? null);
        $ruta->setDuracion($data['duracion'] ?? null);

        // Asignar camión si viene
        if (!empty($data['camion_id'])) {
            $camion = $this->em->getRepository(Camion::class)->find($data['camion_id']);
            if (!$camion) {
                return $this->jsonError("Camión no existe", 404);
            }
            $ruta->setCamion($camion);
        }

        $this->em->persist($ruta);
        $this->em->flush();

        return $this->jsonSuccess($ruta, 201);
    }

    // ------------------------
    // PUT /api/rutas/{id}
    // ------------------------
    #[Route('/{id}', methods: ['PUT'])]
    public function update(Request $request, ?Ruta $ruta): JsonResponse
    {
        if (!$ruta) {
            return $this->jsonError("Ruta no encontrada", 404);
        }

        $data = $this->getJsonBody($request);

        $ruta->setUbicacionRecogida($data['ubicacion_recogida'] ?? $ruta->getUbicacionRecogida());
        $ruta->setUbicacionEntrega($data['ubicacion_entrega'] ?? $ruta->getUbicacionEntrega());
        $ruta->setDistancia($data['distancia'] ?? $ruta->getDistancia());
        $ruta->setDuracion($data['duracion'] ?? $ruta->getDuracion());

        // Cambiar camión si viene
        if (array_key_exists('camion_id', $data)) {
            $camion = $this->em->getRepository(Camion::class)->find($data['camion_id']);
            if (!$camion) {
                return $this->jsonError("Camión no existe", 404);
            }
            $ruta->setCamion($camion);
        }

        $this->em->flush();

        return $this->jsonSuccess($ruta);
    }

    // ------------------------
    // DELETE /api/rutas/{id}
    // ------------------------
    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(?Ruta $ruta): JsonResponse
    {
        if (!$ruta) {
            return $this->jsonError("Ruta no encontrada", 404);
        }

        $this->em->remove($ruta);
        $this->em->flush();

        return $this->jsonSuccess("Ruta eliminada correctamente");
    }
}
