<?php
namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class VerifyController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/verify', name: 'api_verify', methods: ['POST'])]
    public function verify(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['email']) || empty($data['code'])) {
            return new JsonResponse(['error' => 'Email y código son requeridos'], 400);
        }

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        if ($user->getVerificationCode() !== $data['code']) {
            return new JsonResponse(['error' => 'Código de verificación incorrecto'], 400);
        }

        $user->setIsVerified(true);
        $user->setVerificationCode(null);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Cuenta verificada correctamente']);
    }
}
