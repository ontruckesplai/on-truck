<?php

namespace App\Controller;

use App\Entity\Camion;
use App\Entity\Contract;
use App\Entity\CamionContrato;
use App\Repository\CamionContratoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/assign-contract')]
class CamionContratoController extends AbstractController
{
    #[Route('', name: 'assign_contract_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $camionId = $data['camion_id'] ?? null;
        $contractId = $data['contract_id'] ?? null;
        $fechaInicioStr = $data['fecha_inicio'] ?? null;

        if (!$camionId || !$contractId || !$fechaInicioStr) {
            return $this->json(['success' => false, 'message' => 'Faltan datos'], 400);
        }

        $camion = $entityManager->getRepository(Camion::class)->find($camionId);
        $contract = $entityManager->getRepository(Contract::class)->find($contractId);

        if (!$camion || !$contract) {
            return $this->json(['success' => false, 'message' => 'Camión o Contrato no encontrado'], 404);
        }

        // Logic to calculate estimated end date
        // Constants: Speed = 650km / 20 hours = 32.5 km/h
        // Trips = ceil(TotalQuantity / TrailerCapacity)
        // Distance = (Trips - 1) * 2 * Distance + Distance
        // Time = Distance / 32.5
        
        $capacity = $camion->getRemolque() ? $camion->getRemolque()->getCapacidad() : 0;
        
        if ($capacity <= 0) {
             return $this->json(['success' => false, 'message' => 'El camión no tiene remolque o capacidad válida'], 400);
        }

        // Check for existing assignment for this truck and contract
        $existing = $entityManager->getRepository(CamionContrato::class)->findOneBy([
            'camion' => $camion,
            'contract' => $contract
        ]);

        if ($existing) {
            return $this->json(['success' => false, 'message' => 'Este camión ya está asignado a este contrato'], 400);
        }

        $trips = ceil($contract->getTotalQuantity() / $capacity);
        $distanceOneWay = $contract->getDistanceKm() ?: 500; // Default fallback if distance is missing
        
        // Total distance including returns to pick up more cargo
        $totalDistance = ($trips > 1) ? (($distanceOneWay * 2 * ($trips - 1)) + $distanceOneWay) : $distanceOneWay;
        
        $averageSpeedVal = 32.5;
        $hoursNeeded = $totalDistance / $averageSpeedVal;
        
        $fechaInicio = new \DateTime($fechaInicioStr);
        $fechaFin = clone $fechaInicio;
        // Add hours to start date
        // We convert hours to minutes to be safe
        $minutesNeeded = (int)($hoursNeeded * 60);
        $fechaFin->modify("+{$minutesNeeded} minutes");

        $assignment = new CamionContrato();
        $assignment->setCamion($camion);
        $assignment->setContract($contract);
        $assignment->setFechaInicio($fechaInicio);
        $assignment->setFechaFinEstimada($fechaFin);
        $assignment->setEstado('PROGRAMADO');

        $entityManager->persist($assignment);
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'data' => $assignment
        ]);
    }

    #[Route('/camion/{id}', name: 'assign_contract_list_by_camion', methods: ['GET'])]
    public function getByCamion(int $id, CamionContratoRepository $repo): JsonResponse
    {
        $assignments = $repo->findBy(['camion' => $id], ['fechaInicio' => 'ASC']);
        return $this->json($assignments);
    }

    #[Route('/contract/{id}', name: 'assign_contract_list_by_contract', methods: ['GET'])]
    public function getByContract(int $id, CamionContratoRepository $repo): JsonResponse
    {
        $assignments = $repo->findBy(['contract' => $id], ['fechaInicio' => 'ASC']);
        return $this->json($assignments);
    }

    #[Route('/{id}', name: 'assign_contract_delete', methods: ['DELETE'])]
    public function delete(int $id, CamionContratoRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $assignment = $repo->find($id);
        
        if (!$assignment) {
            return $this->json(['success' => false, 'message' => 'Asignación no encontrada'], 404);
        }

        $em->remove($assignment);
        $em->flush();

        return $this->json(['success' => true, 'message' => 'Asignación eliminada']);
    }
}
