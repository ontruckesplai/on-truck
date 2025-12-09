<?php

namespace App\Controller;
use App\Service\ServicioCompatibilidadContratos;
use App\Entity\Contract;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ContractController extends AbstractController
{

    // 2. LEER CONTRATOS
    #[Route('/api/contracts', name: 'get_contracts', methods: ['GET'])]
    public function index(EntityManagerInterface $em): JsonResponse
    {
        $contracts = $em->getRepository(Contract::class)->findAll();

        $data = [];
        foreach ($contracts as $c) {
            $data[] = [
                'id' => $c->getId(),
                'client_name' => $c->getClientName(),
                'total_quantity' => $c->getTotalQuantity(),
                'product_type' => $c->getProductType(),
                'deadline' => $c->getDeadline()->format('Y-m-d'),
                'origin_address' => $c->getOriginAddress(),
                'origin_lat' => $c->getOriginLat(),
                'origin_lon' => $c->getOriginLon(),
                'destination_address' => $c->getDestinationAddress(),
                'destination_lat' => $c->getDestinationLat(),
                'destination_lon' => $c->getDestinationLon(),
                'status' => $c->getStatus(),
                'distance_km' => $c->getDistanceKm(),
                'delivered_quantity' => $c->getDeliveredQuantity(),
                'created_at' => $c->getCreatedAt() ? $c->getCreatedAt()->format('Y-m-d\TH:i:s') : null,
            ];
        }

        return $this->json($data);
    }

    #[Route('/api/contracts', name: 'create_contract', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!$data) {
                return $this->json(['error' => 'No data received'], 400);
            }

            $contract = new Contract();
            $contract->setClientName($data['client_name'] ?? 'Cliente Sin Nombre');
            $contract->setTotalQuantity((int)($data['total_quantity'] ?? 0));
            $contract->setDeliveredQuantity((int)($data['delivered_quantity'] ?? 0));
            $contract->setProductType($data['product_type'] ?? 'General');

            if (!empty($data['deadline'])) {
                $contract->setDeadline(new \DateTime($data['deadline']));
            } else {
                $contract->setDeadline(new \DateTime('+7 days')); // Default deadline
            }

            $contract->setOriginAddress($data['origin_address'] ?? '');

            // Handle nullable coordinates - Ensure empty strings become NULL
            $originLat = (isset($data['origin_lat']) && $data['origin_lat'] !== '') ? $data['origin_lat'] : null;
            $originLon = (isset($data['origin_lon']) && $data['origin_lon'] !== '') ? $data['origin_lon'] : null;
            $destLat = (isset($data['destination_lat']) && $data['destination_lat'] !== '') ? $data['destination_lat'] : null;
            $destLon = (isset($data['destination_lon']) && $data['destination_lon'] !== '') ? $data['destination_lon'] : null;

            $contract->setOriginLat($originLat);
            $contract->setOriginLon($originLon);

            $contract->setDestinationAddress($data['destination_address'] ?? '');
            $contract->setDestinationLat($destLat);
            $contract->setDestinationLon($destLon);

            if (isset($data['status'])) {
                $contract->setStatus($data['status']);
            } else {
                $contract->setStatus('pending');
            }

            // Calculate distance if coordinates are present
            if ($contract->getOriginLat() && $contract->getOriginLon() && $contract->getDestinationLat() && $contract->getDestinationLon()) {
                $distance = $this->calculateDistance(
                    $contract->getOriginLat(),
                    $contract->getOriginLon(),
                    $contract->getDestinationLat(),
                    $contract->getDestinationLon()
                );
                $contract->setDistanceKm($distance);
            }

            $em->persist($contract);
            $em->flush();

            return $this->json(['status' => 'Contract created', 'id' => $contract->getId()], 201);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    // 3. EDITAR CONTRATO
    #[Route('/api/contracts/{id}', name: 'update_contract', methods: ['PUT'])]
    public function update(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $contract = $em->getRepository(Contract::class)->find($id);

        if (!$contract) {
            return $this->json(['error' => 'Contract not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['client_name'])) $contract->setClientName($data['client_name']);
        if (isset($data['total_quantity'])) $contract->setTotalQuantity((int)$data['total_quantity']);
        if (isset($data['delivered_quantity'])) $contract->setDeliveredQuantity((int)$data['delivered_quantity']);
        if (isset($data['product_type'])) $contract->setProductType($data['product_type']);
        if (isset($data['deadline'])) $contract->setDeadline(new \DateTime($data['deadline']));

        if (isset($data['origin_address'])) $contract->setOriginAddress($data['origin_address']);

        // Handle coordinates update - allow setting to null
        if (array_key_exists('origin_lat', $data)) {
            $val = $data['origin_lat'];
            $contract->setOriginLat(($val !== null && $val !== '') ? $val : null);
        }
        if (array_key_exists('origin_lon', $data)) {
            $val = $data['origin_lon'];
            $contract->setOriginLon(($val !== null && $val !== '') ? $val : null);
        }

        if (isset($data['destination_address'])) $contract->setDestinationAddress($data['destination_address']);

        if (array_key_exists('destination_lat', $data)) {
            $val = $data['destination_lat'];
            $contract->setDestinationLat(($val !== null && $val !== '') ? $val : null);
        }
        if (array_key_exists('destination_lon', $data)) {
            $val = $data['destination_lon'];
            $contract->setDestinationLon(($val !== null && $val !== '') ? $val : null);
        }

        if (isset($data['status'])) $contract->setStatus($data['status']);

        // Recalculate distance if coordinates changed (or if it wasn't calculated before)
        $originLat = $contract->getOriginLat();
        $originLon = $contract->getOriginLon();
        $destinationLat = $contract->getDestinationLat();
        $destinationLon = $contract->getDestinationLon();

        if ($originLat && $originLon && $destinationLat && $destinationLon) {
             $distance = $this->calculateDistance(
                $originLat,
                $originLon,
                $destinationLat,
                $destinationLon
            );
            $contract->setDistanceKm($distance);
        } else {
            $contract->setDistanceKm(null); // Clear distance if coordinates are incomplete
        }

        $em->flush();

        return $this->json(['status' => 'Contract updated']);
    }

    // 4. ELIMINAR CONTRATO
    #[Route('/api/contracts/{id}', name: 'delete_contract', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        $contract = $em->getRepository(Contract::class)->find($id);

        if (!$contract) {
            return $this->json(['error' => 'Contract not found'], 404);
        }

        $em->remove($contract);
        $em->flush();

        return $this->json(['status' => 'Contract deleted']);
    }

    private function calculateDistance($lat1, $lon1, $lat2, $lon2): ?float
    {
        try {
            // OSRM expects: lon,lat;lon,lat
            $url = "http://router.project-osrm.org/route/v1/driving/$lon1,$lat1;$lon2,$lat2?overview=false";

            // Log the URL for debugging
            error_log("Calculating distance URL: " . $url);

            $options = [
                "http" => [
                    "header" => "User-Agent: FleetManagementApp/1.0\r\n"
                ]
            ];

            $context = stream_context_create($options);
            $response = @file_get_contents($url, false, $context);

            if ($response) {
                $data = json_decode($response, true);
                if (isset($data['routes'][0]['distance'])) {
                    $distanceKm = round($data['routes'][0]['distance'] / 1000, 2);
                    error_log("Distance calculated: " . $distanceKm . " km");
                    return $distanceKm;
                } else {
                    error_log("OSRM response missing distance: " . $response);
                }
            } else {
                error_log("Failed to fetch OSRM response");
            }
        } catch (\Exception $e) {
            error_log("Error calculating distance: " . $e->getMessage());
        }

        return null;
    }
//compatible?
    #[Route('/api/contratos/validar', methods: ['POST'])]
public function validarContrato(
    Request $request,
    ServicioCompatibilidadContratos $servicio
): JsonResponse {
    $data = json_decode($request->getContent(), true);

    $distancia = (float) $data['distanciaKm'];
    $kg = (float) $data['kgTotales'];
    $cap = (float) $data['capacidadRemolque'];
    $plazo = (float) $data['plazoHoras'];

    $resultado = $servicio->puedeCumplirseContratoSolo(
        $distancia,
        $kg,
        $cap,
        $plazo
    );

    return new JsonResponse($resultado);
}

}
