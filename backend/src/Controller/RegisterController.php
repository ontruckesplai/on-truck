<?php
namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;

class RegisterController extends AbstractController
{
    private $entityManager;
    private $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['email']) || empty($data['password']) || empty($data['firstName']) || empty($data['lastName'])) {
            return new JsonResponse(['error' => 'Email, password, firstName and lastName are required'], 400);
        }

        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return new JsonResponse(['error' => 'El usuario ya está registrado'], 400);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
        $user->setPasswordPlain($data['password']);
        $user->setFirstName($data['firstName']);
        $user->setLastName($data['lastName']);

        // Generar código de verificación
        $verificationCode = strval(random_int(100000, 999999));
        $user->setVerificationCode($verificationCode);
        $user->setIsVerified(false);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Enviar correo
        $dsn = $_ENV['MAILER_DSN'] ?? null;
        if ($dsn) {
            try {
                $transport = Transport::fromDsn($dsn);
                $mailer = new Mailer($transport);

                $emailMessage = (new Email())
                    ->from('no-reply@ontruck.com')
                    ->to($user->getEmail())
                    ->subject('Código de verificación On Truck')
                    ->html("
                        <div style='font-family: Arial, sans-serif; text-align: center; padding: 20px;'>
                            <h1 style='color:#007bff; margin-bottom:20px;'>On Truck</h1>
                            <h2 style='color:#007bff;'>¡Hola {$user->getFirstName()}!</h2>
                            <p>Gracias por registrarte en <strong>On Truck</strong>.</p>
                            <p>Tu código de verificación es:</p>
                            <p style='font-size:24px; font-weight:bold; color:#28a745;'>{$verificationCode}</p>
                            <p style='margin-top:30px; font-size:14px; color:#555;'>
                                Si no has solicitado este correo, ignóralo.
                            </p>
                        </div>
                    ");

                $mailer->send($emailMessage);
            } catch (\Exception $e) {
                return new JsonResponse([
                    'error' => 'Usuario registrado pero no se pudo enviar el correo: '.$e->getMessage()
                ], 500);
            }
        }

        return new JsonResponse(['message' => 'Usuario registrado. Revisa tu correo para el código de verificación.'], 201);
    }
}
