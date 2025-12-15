<?php
require __DIR__.'/vendor/autoload.php';

use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;

$dsn = "smtp://mohamedderraz33@gmail.com:gtgwiklsrqnpqdco@smtp.gmail.com:587";

$transport = Transport::fromDsn($dsn);
$mailer = new Mailer($transport);

$email = (new Email())
    ->from('mohamedderraz33@gmail.com')
    ->to('mohamedderraz33@gmail.com')
    ->subject('Prueba Symfony Mailer')
    ->text('¡Este es un correo de prueba!');

try {
    $mailer->send($email);
    echo "Correo enviado correctamente!\n";
} catch (\Exception $e) {
    echo "Error enviando correo: ".$e->getMessage()."\n";
}
