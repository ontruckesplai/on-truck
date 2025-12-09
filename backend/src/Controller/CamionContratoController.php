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
    public function create(Request $request, EntityManagerInterface $entityManager, \App\Service\ServicioTiempoConduccion $servicioTiempo): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $camionId = $data['camion_id'] ?? null;
        $contractId = $data['contract_id'] ?? null;
        $fechaInicioStr = $data['fecha_inicio'] ?? null;

        if (!$camionId || !$contractId || !$fechaInicioStr) {
            return $this->json(['success' => false, 'message' => 'Faltan datos (camion_id, contract_id, fecha_inicio)'], 400);
        }

        $camion = $entityManager->getRepository(Camion::class)->find($camionId);
        $contract = $entityManager->getRepository(Contract::class)->find($contractId);

        if (!$camion || !$contract) {
            return $this->json(['success' => false, 'message' => 'Camión o Contrato no encontrado'], 404);
        }

        // Check for existing assignment
        $existing = $entityManager->getRepository(CamionContrato::class)->findOneBy([
            'camion' => $camion,
            'contract' => $contract
        ]);

        if ($existing) {
            return $this->json(['success' => false, 'message' => 'Este camión ya está asignado a este contrato'], 400);
        }

        try {
            $fechaInicio = new \DateTime($fechaInicioStr);
            $estimacion = $servicioTiempo->calcularEstimacion($contract, $camion, $fechaInicio);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['success' => false, 'message' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            return $this->json(['success' => false, 'message' => 'Error calculando estimación: ' . $e->getMessage()], 500);
        }

        $assignment = new CamionContrato();
        $assignment->setCamion($camion);
        $assignment->setContract($contract);
        $assignment->setFechaInicio($fechaInicio);
        $assignment->setFechaFinEstimada($estimacion['fecha_fin_estimada']);
        $assignment->setEstado('PROGRAMADO');

        $entityManager->persist($assignment);
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'data' => $assignment,
            'estimacion' => $estimacion // Return details for frontend feedback if needed
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
