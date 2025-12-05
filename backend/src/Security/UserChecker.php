<?php

namespace App\Security;

use App\Entity\User;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAccountStatusException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserChecker implements UserCheckerInterface
{
    public function checkPreAuth(UserInterface $user): void
    {
        if (!$user instanceof User) {
            return;
        }

        if (!$user->getIsVerified()) {
            throw new CustomUserMessageAccountStatusException('Debes verificar tu cuenta antes de iniciar sesión.');
        }
    }

    public function checkPostAuth(UserInterface $user): void
    {
        // No hacemos nada post-auth por ahora
    }
}
