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
-- Table structure for table `contract`
--

DROP TABLE IF EXISTS `contract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contract` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_quantity` int NOT NULL,
  `product_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deadline` date NOT NULL,
  `origin_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `origin_lat` decimal(10,8) DEFAULT NULL,
  `origin_lon` decimal(11,8) DEFAULT NULL,
  `destination_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `destination_lat` decimal(10,8) DEFAULT NULL,
  `destination_lon` decimal(11,8) DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `distance_km` double DEFAULT NULL,
  `delivered_quantity` int NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `assigned_truck_id` int unsigned DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `estimated_completion_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_E98F2859BB987AC7` (`assigned_truck_id`),
  CONSTRAINT `FK_E98F2859BB987AC7` FOREIGN KEY (`assigned_truck_id`) REFERENCES `camiones` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract`
--

LOCK TABLES `contract` WRITE;
/*!40000 ALTER TABLE `contract` DISABLE KEYS */;
INSERT INTO `contract` VALUES (1,'repsol',200000,'Liquido','2025-01-20','Reus',41.38258020,2.17707300,'Madrid',40.41678200,-3.70350700,'pending',620.72,0,'2025-11-29 12:14:27',1,'2025-11-30 07:51:00','2025-12-01 15:49:00'),(5,'BonArea',150000,'Trigo','2026-01-31','Tarragona, Tarragonés, Tarragona, Cataluña, España',41.11723640,1.25460570,'París, Isla de Francia, Francia metropolitana, Francia',48.85888970,2.32004100,'pending',1121.33,0,'2025-11-15 12:14:27',1,'2025-12-01 23:51:00','2025-12-04 20:41:00'),(6,'Mercadona',1000000000,'Fruta','2026-06-30','Reus, Bajo Campo, Tarragona, Cataluña, España',41.15555640,1.10761330,'Sevilla, Andalucía, España',37.38863030,-5.99534030,'pending',900.3,0,'2025-11-18 12:14:27',NULL,NULL,NULL),(7,'Spar',20000,'Pienso','2026-02-28','Sevilla, Andalucía, España',37.38863030,-5.99534030,'Bilbao, Vizcaya, País Vasco, España',43.26300180,-2.93500390,'pending',858.67,0,'2025-11-12 12:14:27',NULL,NULL,NULL),(8,'Dia',10000,'Fruta','2026-03-30','Galicia, España',42.61946000,-7.86311200,'Reus, Bajo Campo, Tarragona, Cataluña, España',41.15555640,1.10761330,'pending',952.03,0,'2025-11-19 12:14:27',NULL,NULL,NULL),(9,'Esclat',40000,'Gasolina','2026-02-12','Zaragoza, Aragón, España',41.65213420,-0.88094280,'Lérida, Cataluña, España',41.61476050,0.62678420,'pending',149.16,0,'2025-11-27 12:14:27',1,'2025-12-05 11:23:00','2025-12-05 19:13:00');
/*!40000 ALTER TABLE `contract` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-02  9:52:44
