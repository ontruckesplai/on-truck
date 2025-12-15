<?php

namespace App\Command;

use App\Entity\Camion;
use App\Entity\Remolque;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:generate-demo-data',
    description: 'Generates 20 random vehicles and 20 random trailers for demo purposes',
)]
class GenerateDemoDataCommand extends Command
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        parent::__construct();
        $this->entityManager = $entityManager;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $trailerTypes = ['Lona', 'Frigo', 'Plataforma', 'Cisterna', 'Portacoches'];
        $truckModels = ['Volvo FH', 'Scania R', 'Mercedes Actros', 'Iveco S-Way', 'DAF XG', 'MAN TGX', 'Renault T-High'];
        
        $io->section('Generating Trailers...');
        $trailers = [];
        for ($i = 0; $i < 20; $i++) {
            $remolque = new Remolque();
            // Generate random license plate: R-0000-BBB
            $numbers = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
            $letters = $this->generateRandomLetters(3);
            $matricula = "R-{$numbers}-{$letters}";

            $remolque->setMatricula($matricula);
            $remolque->setTipo($trailerTypes[array_rand($trailerTypes)]);
            $remolque->setCapacidad(rand(20000, 28000));
            $remolque->setCarga(0); // Start empty

            $this->entityManager->persist($remolque);
            $trailers[] = $remolque;
        }
        $io->success('20 Trailers prepared.');

        $io->section('Generating Trucks...');
        for ($i = 0; $i < 20; $i++) {
            $camion = new Camion();
            // Generate random license plate: 0000-BBB
            $numbers = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
            $letters = $this->generateRandomLetters(3);
            $matricula = "{$numbers}-{$letters}";

            $camion->setMatricula($matricula);
            $camion->setKms(rand(10000, 1500000));
            $camion->setKmUltimaRevision(rand(0, $camion->getKms()));
            $camion->setCombustible(rand(10, 100)); // Percentage hopefully? Or Liters? Assuming liters/percentage logic exists but simple int for now.
            $camion->setCv(rand(400, 750));
            $camion->setConsumoMedio(rand(250, 350) / 10); // 25.0 - 35.0
            $camion->setModelo($truckModels[array_rand($truckModels)]);
            
            // Dates
            $startDate = new \DateTimeImmutable('-' . rand(1, 1000) . ' days');
            $camion->setInicio($startDate->format('Y-m-d'));
            
            // Random ITV date in future
            $itvDate = new \DateTimeImmutable('+' . rand(1, 365) . ' days');
            $camion->setFechaItv($itvDate);

            // Randomly assign a trailer (50% chance) if available
            if (rand(0, 1) === 1 && !empty($trailers)) {
                $remolque = array_pop($trailers);
                $camion->setTieneRemolque(true);
                $camion->setRemolque($remolque);
            } else {
                $camion->setTieneRemolque(false);
            }

            $this->entityManager->persist($camion);
        }
        $io->success('20 Trucks prepared.');

        $this->entityManager->flush();

        $io->success('All data successfully saved to the database!');

        return Command::SUCCESS;
    }

    private function generateRandomLetters($length)
    {
        $characters = 'BCDFGHJKLMNPRSTVWXYZ'; // Standard Spanish plate letters (no vowels usually to avoid bad words, but simplified here)
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $randomString;
    }
}
