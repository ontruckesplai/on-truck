<?php
namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;

#[Route('/api/reset', name: 'reset_password_')]
class ResetPasswordController extends AbstractController
{
    private $em;
    private $userRepo;
    private $hasher;

    public function __construct(EntityManagerInterface $em, UserRepository $userRepo, UserPasswordHasherInterface $hasher)
    {
        $this->em = $em;
        $this->userRepo = $userRepo;
        $this->hasher = $hasher;
    }

    // Paso 1: enviar código
    #[Route('/request', name: 'request', methods: ['POST'])]
    public function request(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;

        if (!$email) {
            return $this->json(['error' => 'Email requerido'], 400);
        }

        $user = $this->userRepo->findOneBy(['email' => $email]);
        if (!$user) {
            return $this->json(['error' => 'Usuario no encontrado'], 404);
        }

        // Generar código de 6 dígitos
        $code = strval(random_int(100000, 999999));
        $user->setVerificationCode($code);
        $this->em->flush();

        // Enviar correo HTML igual que Register
        $dsn = $_ENV['MAILER_DSN'] ?? null;
        if ($dsn) {
            try {
                $transport = Transport::fromDsn($dsn);
                $mailer = new Mailer($transport);

                $emailMessage = (new Email())
                    ->from('no-reply@ontruck.com')
                    ->to($user->getEmail())
                    ->subject('Restablecer contraseña - Código de verificación')
                    ->html("
                        <div style='font-family: Arial, sans-serif; text-align: center; padding: 20px;'>
                            <h1 style='color:#007bff; margin-bottom:20px;'>On Truck</h1>
                            <h2 style='color:#007bff;'>Hola {$user->getFirstName()}</h2>
                            <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
                            <p>Tu código de verificación es:</p>
                            <p style='font-size:28px; font-weight:bold; color:#28a745;'>{$code}</p>

                            <p style='margin-top:30px; font-size:14px; color:#555;'>
                                Si no has solicitado este cambio, puedes ignorar este correo.
                            </p>
                        </div>
                    ");

                $mailer->send($emailMessage);

            } catch (\Exception $e) {
                return $this->json([
                    'error' => 'Código generado pero no se pudo enviar el correo: '.$e->getMessage()
                ], 500);
            }
        }

        return $this->json(['message' => 'Código enviado a tu correo']);
    }

    // Paso 2: verificar código
    #[Route('/verify', name: 'verify', methods: ['POST'])]
    public function verify(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $code = $data['code'] ?? null;

        if (!$email || !$code) {
            return $this->json(['error' => 'Email y código requeridos'], 400);
        }

        $user = $this->userRepo->findOneBy(['email' => $email]);
        if (!$user || $user->getVerificationCode() !== $code) {
            return $this->json(['error' => 'Código inválido'], 400);
        }

        return $this->json(['message' => 'Código verificado']);
    }

    // Paso 3: actualizar contraseña
    #[Route('/update', name: 'update', methods: ['POST'])]
    public function update(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $code = $data['code'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$code || !$password) {
            return $this->json(['error' => 'Email, código y contraseña requeridos'], 400);
        }

        $user = $this->userRepo->findOneBy(['email' => $email]);
        if (!$user || $user->getVerificationCode() !== $code) {
            return $this->json(['error' => 'Código inválido'], 400);
        }

        $hashed = $this->hasher->hashPassword($user, $password);
        $user->setPassword($hashed);
        $user->setVerificationCode(null);
        $this->em->flush();

        return $this->json(['message' => 'Contraseña actualizada']);
    }
}
