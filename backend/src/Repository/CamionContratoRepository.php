<?php

namespace App\Repository;

use App\Entity\CamionContrato;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<CamionContrato>
 *
 * @method CamionContrato|null find($id, $lockMode = null, $lockVersion = null)
 * @method CamionContrato|null findOneBy(array $criteria, array $orderBy = null)
 * @method CamionContrato[]    findAll()
 * @method CamionContrato[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CamionContratoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CamionContrato::class);
    }

    public function save(CamionContrato $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(CamionContrato $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
