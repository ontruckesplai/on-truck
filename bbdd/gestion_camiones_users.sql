CREATE DATABASE  IF NOT EXISTS `gestion_camiones` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gestion_camiones`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: gestion_camiones
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` json NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `password_plain` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_1483A5E9E7927C74` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'derraz@gmail.com','[\"ROLE_USER\"]','$2y$13$xEaY8D16.ER9zUTprVg6fu0YXBTNo7E7MiBq7lvohf5CNWuXE0KzC',NULL,NULL),(2,'mohhaa@gmail.com','[\"ROLE_USER\"]','$2y$13$e//1yRyZFlAMGD53CltBPeGSLyGZRHdmesdX9n9iSxDKMZOVdFGU.','2025-11-27 11:03:53',NULL),(4,'play@gmail.com','[\"ROLE_USER\"]','$2y$13$uxMpcuFUtQ.3QHUWnn7KMueeIWyDHl7SlnstNBYvMEW2d1feluK12','2025-11-27 11:44:42',NULL),(5,'mohaa@gmail.com','[\"ROLE_USER\"]','$2y$13$0RjM2GLI9ooMN5J8lxAH3.KUPz41slvzZP/4sNQsE0dZhgL2dADfm','2025-11-27 11:53:40',NULL),(6,'carlos@gmail.com','[\"ROLE_USER\"]','$2y$13$hcQ5CNt/3jkmJgMe9/gt/O18N5rwNiC/ByWlxzZWSyTDuussWXiIO',NULL,NULL),(7,'dani@gmail.com','[\"ROLE_USER\"]','$2y$13$MGq1M9KRTXw9jSu5V3CZBepGwsRYo7A1/3fkCkwFitpi7ZjIangg.','2025-11-27 12:01:01',NULL),(9,'hola@gmil.com','[\"ROLE_USER\"]','$2y$13$vj234xEER69tzBtCVAEw5Ot8RW31NIDmu9D6qUmanEQkUTIekuqdm','2025-11-27 12:11:43',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-27 13:15:17
