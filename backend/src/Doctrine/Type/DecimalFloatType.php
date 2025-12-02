<?php

namespace App\Doctrine\Type;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\DecimalType;

class DecimalFloatType extends DecimalType
{
    public function getName(): string
    {
        return 'decimal_float';
    }

    public function convertToPHPValue($value, AbstractPlatform $platform): ?float
    {
        return $value !== null ? (float)$value : null;
    }

    public function convertToDatabaseValue($value, AbstractPlatform $platform): ?string
    {
        return $value !== null ? (string)$value : null;
    }
}
