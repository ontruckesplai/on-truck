-- MySQL dump 10.13  Distrib 8.0.44, for macos15 (arm64)
--
-- Host: localhost    Database: gestion_camiones
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `camiones`
--

DROP TABLE IF EXISTS `camiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `camiones` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `remolque_id` int unsigned DEFAULT NULL,
  `matricula` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kms` int NOT NULL,
  `km_ultima_revision` int DEFAULT NULL,
  `combustible` int DEFAULT NULL,
  `cv` int DEFAULT NULL,
  `consumo_medio` double DEFAULT NULL,
  `inicio` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fin` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notas` longtext COLLATE utf8mb4_unicode_ci,
  `tiene_remolque` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_C64588C315DF1885` (`matricula`),
  UNIQUE KEY `UNIQ_C64588C37642CD57` (`remolque_id`),
  CONSTRAINT `FK_C64588C37642CD57` FOREIGN KEY (`remolque_id`) REFERENCES `remolques` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `camiones`
--

LOCK TABLES `camiones` WRITE;
/*!40000 ALTER TABLE `camiones` DISABLE KEYS */;
INSERT INTO `camiones` VALUES (1,NULL,'1234-ABC',125000,120000,75,450,28.5,'Madrid','Barcelona','Camión en buen estado',0),(2,NULL,'5678-DEF',89000,80000,60,510,32,'Valencia','Sevilla','Revisión reciente',0),(3,NULL,'9012-GHI',340500,330000,45,450,29.8,NULL,NULL,'Necesita revisión pronto',0),(4,NULL,'3456-JKL',56000,50000,80,380,26.5,'Bilbao','Zaragoza','Camión nuevo',0),(5,NULL,'7890-MNO',198000,190000,55,510,31.2,'Granada','Málaga','En ruta actualmente',0),(6,NULL,'1234-remolque',12,1000,100,450,5.6,'Riudoms','Reus','Todo esta bien',0),(7,NULL,'gskjlfg',1,123,NULL,NULL,NULL,'','','',0),(13,NULL,'hoal',0,NULL,NULL,NULL,NULL,NULL,NULL,'',0),(14,NULL,'adios',0,NULL,NULL,NULL,NULL,NULL,NULL,'',0),(17,NULL,'asdkjfaskdf',0,NULL,NULL,NULL,NULL,NULL,NULL,'',0);
/*!40000 ALTER TABLE `camiones` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 13:23:53
