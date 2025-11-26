<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;


//Clase de la api principal
abstract class ApiController extends AbstractController{

public function __construct(protected EntityManagerInterface $em) {}


protected function getJsonBody(Request $request):array{

    return json_decode($request->getContent(), true) ?? [];

}

protected function jsonSuccess(mixed $data, int $status=200):JsonResponse{

    return $this->json(['success'=>true,'data'=>$data,],$status);

}
  protected function jsonError(string $message, int $status = 400): JsonResponse
    {
        return $this->json([
            'success' => false,
            'error' => $message,
        ], $status);
    }

 }
