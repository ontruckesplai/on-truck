<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController; // Necesario para inyección de dependencias

class LoginController extends AbstractController
{
    private $jwt_secret = 'TU_SECRETO_SUPER_SEGURO'; // ¡CAMBIA ESTO EN PRODUCCIÓN!
    private $entityManager;
    private $passwordHasher;

    // 1. Inyección de dependencias en el constructor
    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }

    #[Route('/api/login', name:'api_login', methods:['POST'])]
    // Quitamos los argumentos inyectados aquí, ya están en el constructor
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return new JsonResponse(['error' => 'Email and password required'], 400);
        }

        // Usamos la dependencia inyectada
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        // Usamos la dependencia inyectada
        if (!$user || !$this->passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['error' => 'Invalid credentials'], 401);
        }

        // Generación manual del JWT
        $payload = [
            'user_id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'exp' => time() + 3600 // 1 hora de expiración
        ];

        // Asegúrate de que `firebase/php-jwt` esté instalado si usas este controlador.
        // composer require firebase/php-jwt
        $jwt = JWT::encode($payload, $this->jwt_secret, 'HS256');

        // Devolvemos el token. El frontend lo usará para llamar a onAuthSuccess()
        return new JsonResponse(['token' => $jwt], 200);
    }
}