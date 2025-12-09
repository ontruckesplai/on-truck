<?php

namespace App\Security;

use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtAuthenticator extends AbstractAuthenticator
{
    private string $jwtSecret;

    public function __construct(string $jwtSecret)
    {
        $this->jwtSecret = $jwtSecret;
    }

   public function supports(Request $request): ?bool
{
    // Ignorar CORS preflight
    if ($request->getMethod() === 'OPTIONS') {
        return false;
    }

    // Leer header Authorization
    $authHeader = $request->headers->get('Authorization');

    file_put_contents(__DIR__ . '/supports.log', date('Y-m-d H:i:s') . " - Method: " . $request->getMethod() . " - Header: " . ($authHeader ?? 'NULL') . "\n", FILE_APPEND);

    if (!$authHeader) {
        return false;
    }

    // Debe empezar por Bearer
    $isBearer = preg_match('/^Bearer\s+.+$/', $authHeader) === 1;
    file_put_contents(__DIR__ . '/supports.log', date('Y-m-d H:i:s') . " - Is Bearer? " . ($isBearer ? 'YES' : 'NO') . "\n", FILE_APPEND);

    return $isBearer;
}




    public function authenticate(Request $request): SelfValidatingPassport
{
    $authHeader = $request->headers->get('Authorization');

    file_put_contents(__DIR__ . '/auth.log',
        "AUTH HEADER: " . $authHeader . "\n",
        FILE_APPEND
    );

    if (!$authHeader) {
        file_put_contents(__DIR__ . '/auth.log', "NO HEADER\n", FILE_APPEND);
        throw new AuthenticationException("No Authorization header found");
    }

    $token = str_replace('Bearer ', '', $authHeader);

    try {
        $payload = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));

        file_put_contents(__DIR__ . '/auth.log',
            "DECODE OK. EMAIL: " . $payload->email . "\n",
            FILE_APPEND
        );

    } catch (\Exception $e) {

        file_put_contents(__DIR__ . '/auth.log',
            "DECODE ERROR: " . $e->getMessage() . "\n",
            FILE_APPEND
        );

        throw new AuthenticationException("Invalid or expired JWT token: " . $e->getMessage());
    }

    return new SelfValidatingPassport(
        new UserBadge($payload->email)
    );
}


    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new JsonResponse([
            'error' => 'Unauthorized: ' . $exception->getMessage()
        ], Response::HTTP_UNAUTHORIZED);
    }

    public function onAuthenticationSuccess(Request $request, $token, string $firewallName): ?Response
    {
        // Continuar la petición normalmente
        return null;
    }
}
