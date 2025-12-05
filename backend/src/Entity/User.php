<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity]
#[ORM\Table(name: "users")]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column(type: "json")]
    private array $roles = [];

    #[ORM\Column]
    private string $password;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    private ?string $password_plain = null;

    #[ORM\Column(type: "datetime", nullable: true)]
    private ?\DateTimeInterface $lastLogin = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $firstName = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $lastName = null;

    // --------------------
    // Verificación
    // --------------------
    #[ORM\Column(type: 'string', length: 6, nullable: true)]
    private ?string $verificationCode = null;

    #[ORM\Column(type: "boolean")]
    private bool $isVerified = false;

    // --------------------
    // Getters / Setters
    // --------------------
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        if (!in_array("ROLE_USER", $roles)) {
            $roles[] = "ROLE_USER";
        }
        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;
        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function getPasswordPlain(): ?string
    {
        return $this->password_plain;
    }

    public function setPasswordPlain(?string $passwordPlain): self
    {
        $this->password_plain = $passwordPlain;
        return $this;
    }

    public function eraseCredentials(): void
    {
        // Nada que borrar
    }

    public function getLastLogin(): ?\DateTimeInterface
    {
        return $this->lastLogin;
    }

    public function setLastLogin(?\DateTimeInterface $lastLogin): self
    {
        $this->lastLogin = $lastLogin;
        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): static
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static
    {
        $this->lastName = $lastName;
        return $this;
    }

    // --------------------
    // Verificación
    // --------------------
    public function getVerificationCode(): ?string
    {
        return $this->verificationCode;
    }

    public function setVerificationCode(?string $verificationCode): self
    {
        $this->verificationCode = $verificationCode;
        return $this;
    }

    public function isVerified(): bool
    {
        return $this->isVerified;
    }

    public function getIsVerified(): bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): self
    {
        $this->isVerified = $isVerified;
        return $this;
    }
}
