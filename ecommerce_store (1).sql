-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 14, 2025 at 02:16 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce store`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_phone` varchar(20) NOT NULL,
  `user_address` text NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_name`, `user_email`, `user_phone`, `user_address`, `order_date`, `status`) VALUES
(1, 'zaid salah', 'zaid5215@gmail.com', '+9876543210', 'Ramallah - Al-birah', '2025-02-02 22:13:40', 'Delivered'),
(2, 'khalid', 'khalid najjar', '05534809', 'Al-Quds', '2025-02-02 23:17:23', 'Pending'),
(3, 'salah', 'salah@gmail.com', '67532454', 'ramallah', '2025-02-03 16:19:18', 'Cancelled'),
(4, 'Layla Ahmad', 'layla.ahmad@example.com', '0591122334', 'Bethlehem', '2025-02-03 20:45:30', 'In Progress'),
(5, 'Yousef Nasser', 'yousef.nasser@example.com', '+972599887766', 'Jenin', '2025-02-03 21:10:15', 'Pending'),
(6, 'Rania Samir', 'rania.samir@example.com', '0567788990', 'Tulkarm', '2025-02-03 21:50:00', 'Pending'),
(7, 'Mohammed Saeed', 'mohammed.saeed@example.com', '+972542233445', 'Ramallah', '2025-02-03 22:25:40', 'Cancelled'),
(8, 'Nour Hamed', 'nour.hamed@example.com', '0593344556', 'Al-Khalil', '2025-02-03 23:05:20', 'Pending'),
(9, 'Hassan Jaber', 'hassan.jaber@example.com', '+972532211009', 'Nablus', '2025-02-04 00:15:55', 'Cancelled'),
(10, 'Samar Fathi', 'samar.fathi@example.com', '0566677889', 'Qalqilya', '2025-02-04 01:30:10', 'Pending'),
(11, 'Omar Tarek', 'omar.tarek@example.com', '+972544556677', 'Gaza', '2025-02-04 02:00:45', 'Delivered'),
(12, 'Hiba Adel', 'hiba.adel@example.com', '0594455667', 'Jenin', '2025-02-04 03:20:30', 'Delivered'),
(13, 'Amal Zain', 'amal.zain@example.com', '+972577889900', 'Hebron', '2025-02-04 04:10:05', 'Pending'),
(14, 'Ahmed Ali', 'ahmed.ali@example.com', '+972567890123', 'Nablus', '2025-02-03 21:42:10', 'Cancelled'),
(15, 'Fatima Hasan', 'fatima.hasan@example.com', '0598765432', 'Hebron', '2025-02-03 21:42:10', 'Delivered'),
(16, 'Omar Khaled', 'omar.khaled@example.com', '+972541234567', 'Jericho', '2025-02-03 21:42:10', 'Delivered'),
(37, 'zaid dsdsdsds', 'zaidsalah-2013@hotmail.com', '312', 'zft', '2025-02-10 01:43:26', 'Pending'),
(38, 'Ala Hamed', 'ala431@gmail.com', '028954894', 'Egypt', '2025-02-10 02:03:17', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`) VALUES
(3, 1, 5, 2),
(4, 1, 9, 3),
(6, 3, 6, 1),
(7, 13, 37, 1),
(8, 13, 7, 1),
(9, 9, 12, 1),
(10, 11, 13, 2),
(11, 4, 4, 2),
(12, 4, 5, 1),
(13, 4, 6, 3),
(14, 5, 7, 1),
(15, 5, 8, 2),
(16, 5, 9, 1),
(17, 6, 10, 2),
(18, 6, 11, 1),
(19, 6, 12, 3),
(20, 7, 13, 1),
(21, 7, 18, 2),
(22, 7, 20, 1),
(23, 8, 23, 2),
(24, 8, 28, 1),
(26, 9, 30, 1),
(27, 9, 37, 2),
(28, 9, 4, 1),
(29, 10, 5, 2),
(30, 10, 6, 1),
(31, 10, 7, 3),
(32, 11, 8, 1),
(33, 11, 9, 2),
(34, 11, 10, 1),
(35, 12, 11, 2),
(36, 12, 12, 1),
(37, 12, 13, 3),
(38, 13, 18, 1),
(39, 13, 20, 2),
(40, 13, 23, 1),
(41, 14, 28, 2),
(43, 14, 30, 3),
(44, 15, 37, 1),
(45, 15, 4, 2),
(46, 15, 5, 1),
(47, 16, 6, 2),
(48, 16, 7, 1),
(49, 16, 8, 3),
(57, 37, 54, 2),
(58, 38, 53, 1),
(59, 38, 59, 3),
(60, 38, 50, 3);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `type_id` int(11) DEFAULT NULL,
  `sales_count` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `discount` varchar(255) DEFAULT '0.00',
  `main_img` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `description`, `quantity`, `type_id`, `sales_count`, `created_at`, `discount`, `main_img`) VALUES
(4, 'MONITOR ASUS ROG STRIX XG27ACG 27” WQHD IPS 180HZ', '1600', 'MONITOR ASUS ROG STRIX XG27ACG 27” WQHD IPS 180HZ', 4, 1, 5, '2025-01-30 15:01:08', '1499', 'http://localhost:1001/uploads/1738453040244-1734029854_1_1734029854_qxasHgT0vw.jpg'),
(5, 'MONITOR ASUS TUF VG27WQ 27″ WQHD CURVED VA 165HZ', '1650', NULL, 4, 0, 0, '2025-01-30 15:01:08', '1450', 'http://localhost:1001/uploads/1738453040244-1734029854_1_1734029854_qxasHgT0vw.jpg'),
(6, 'GPU ASUS TUF RTX4060TI-O8G-GAMING', '2149', 'ASUS TUF Gaming GeForce RTX™ 4060 Ti 8GB GDDR6 OC Edition with DLSS 3, lower temps, and enhanced durability', 6, NULL, 32, '2025-01-30 15:01:08', '0', 'https://watanimall.com/wp-content/uploads/2023/03/CL-LC-II-360-B-2.png'),
(7, 'KEYBOARD ASUS XA05 ROG STRIX SCOPE RX RGB RED', '380', NULL, 3, NULL, 0, '2025-01-30 15:01:08', '0', 'http://localhost:1001/uploads/1738453040244-1734029854_1_1734029854_qxasHgT0vw.jpg'),
(8, 'COOLER FAN-CASE CORSAIR ML120 PRO RGB 3-FAN BLACK', '450', 'COOLER FAN-CASE CORSAIR ML120 PRO RGB 3-FAN BLACK', 0, NULL, 0, '2025-01-30 15:01:08', '0', 'http://localhost:1001/uploads/1738453040244-1734029854_1_1734029854_qxasHgT0vw.jpg'),
(9, 'LAPTOP ACER NITRO 5 17.3″ i5-12500H SSD1TB RAM32 3060 DOS', '4350', 'undefined', 9, 0, 0, '2025-01-30 18:54:46', '0.00', 'http://localhost:1001/uploads/1738451971692-1735750597_1_1735750597_UU5p9Sm8Wt.jpg'),
(10, 'Gigabyte AORUS GeForce RTX 3070 Ti MASTER 8GB Graphics Card', '2699', 'Gigabyte AORUS GeForce RTX 3070 Ti MASTER 8GB Graphics Card', 0, 0, 0, '2025-01-30 18:54:46', '0.00', NULL),
(11, 'CASE NZXT H710I RGB TG MID TOWER MATTE BLACK / RED', '650', 'CASE NZXT H710I RGB TG MID TOWER MATTE BLACK / RED', 12, 0, 0, '2025-01-30 18:54:46', '0.00', NULL),
(12, 'Acer Predator XB253QGW 25 Gaming Monitor', '2400', '25Inch, FHD, IPS, 0.5ms, 280Hz, Nvidia G-Sync', 5, 0, 0, '2025-01-30 18:54:46', '0.00', NULL),
(13, 'HEADSET HYPERX CLOUD ALPHA PRO RED GAMING', '349', 'HEADSET HYPERX CLOUD ALPHA PRO RED GAMING', 0, 0, 0, '2025-01-30 18:54:46', '0.00', NULL),
(18, 'MONITOR MSI ESPORTS G244F E2 24″ FHD IPS 180HZ', '980', 'MONITOR MSI ESPORTS G244F E2 24″ FHD IPS 180HZ', 3, 0, 0, '2025-01-30 20:09:20', '0.00', NULL),
(20, 'GPU ASUS DUAL RTX4060TI-O8G-GAMING WHITE', '1700', 'GPU ASUS DUAL RTX4060TI-O8G-GAMING WHITE', 8, 0, 0, '2025-01-30 20:30:52', '1550', NULL),
(23, 'MONITOR ASUS ROG STRIX XG27ACG 27” WQHD IPS 180HZ', '1800', 'MONITOR ASUS ROG STRIX XG27ACG 27” WQHD IPS 180HZ', 0, 0, 0, '2025-02-01 00:01:39', '0.00', NULL),
(28, 'GPU GIGABYTE GEFORCE RTX4070 SUPER GAMING OC 12G', '3200', 'GPU GIGABYTE GEFORCE RTX4070 SUPER GAMING OC 12G', 0, 0, 0, '2025-02-01 00:57:53', '0.00', NULL),
(30, 'Razer BlackShark V2 X Wired Console Headset for Xbox', '299', 'Razer BlackShark V2 X Wired Console Headset for Xbox', 249, 0, 0, '2025-02-01 23:19:31', '0.00', NULL),
(37, 'COOLER LIQUID-CPU CORSAIR H150 RGB BLACK', '450', 'COOLER LIQUID-CPU CORSAIR H150 RGB BLACK', 3, 0, 0, '2025-02-03 20:07:51', '0', NULL),
(38, 'PSU ASUS ROG THOR 850P 850W 80+ PLATINUM', '790', 'PSU ASUS ROG THOR 850P 850W 80+ PLATINUM', 3, 0, 0, '2025-02-06 22:20:26', '749', NULL),
(39, 'PSU ASUS ROG LOKI 750W SFX-L 80+ PLATINIUM', '820', 'PSU ASUS ROG LOKI 750W SFX-L 80+ PLATINIUM', 3, 0, 0, '2025-02-06 22:22:24', '0', NULL),
(46, 'CHAIR DXRACER P132 GAMING BLACK RED', '870', 'CHAIR DXRACER P132 GAMING BLACK RED', 2, 0, 0, '2025-02-06 23:00:18', '0', NULL),
(50, 'Aorus M6 Wireless Gaming Mouse', '519', 'Aorus M6 Wireless Gaming Mouse', 3, 0, 0, '2025-02-07 00:46:13', '479', NULL),
(53, 'KTC H27T22S 27, QHD, IPS, 180Hz, 1ms Gaming Monitor', '1349', 'KTC H27T22S 27, QHD, IPS, 180Hz, 1ms Gaming Monitor\n', 1, 0, 0, '2025-02-09 01:19:11', '1249', NULL),
(54, 'GIGABYTE MO34WQC 34, WQHD, OLED, 175Hz, 0.03ms Gaming Monitor', '3569', 'GIGABYTE MO34WQC 34, WQHD, OLED, 175Hz, 0.03ms Gaming Monitor\n', 2, 0, 0, '2025-02-09 01:21:48', '0', NULL),
(57, 'Cooler Master GM27-CQS 27, QHD, VA, 165Hz, 0.5ms Curved Gaming Monitor', '1149', 'Cooler Master GM27-CQS 27, QHD, VA, 165Hz, 0.5ms Curved Gaming Monitor\n', 2, 0, 0, '2025-02-09 01:51:20', '0', NULL),
(59, 'TRYX PANORAMA ARGB 360 3D LCD CPU Liquid Cooler', '2499', 'TRYX PANORAMA ARGB 360 3D LCD CPU Liquid Cooler\n', 3, 0, 0, '2025-02-09 02:13:36', '0', NULL),
(60, 'Corsair VOID RGB ELITE USB 7.1 Surround Sound Gaming Headset', '490', 'Headphone Model : VOID ELITE USB\nHeadphone Interface : USB\nAudio Compatibility : PC\nHeadphone Frequency Response : 20Hz - 30 kHz\nHeadphone Sensitivity : 116dB (+/-3dB)\nHeadphone Type : Wired USB\nHeadphone Drivers : 50mm\nImpedance : 32k Ohms @ 1 kHz\nAudio : 7.1 Surround\nLighting : Yes\nPlatform : PC\nMemory Type : USB\nMicrophone Type : Omni-directional\nMicrophone Impedance : 2.0k Ohms\nMicrophone Frequency Response : 100Hz to 10kHz\nMicrophone Sensitivity : -42dB (+/-3dB)\nSurround Sound : Yes\nCable Length : 1.8m\nDetachable Microphone : No\n', 3, 0, 0, '2025-02-14 13:03:57', '0', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`) VALUES
(6, 4, 'https://watanimall.com/wp-content/uploads/2023/03/CL-LC-II-360-B.png'),
(7, 4, 'https://watanimall.com/wp-content/uploads/2023/03/CL-LC-II-360-B-3.png'),
(8, 4, 'https://watanimall.com/wp-content/uploads/2023/03/CL-LC-II-360-B-2.png'),
(9, 4, 'https://watanimall.com/wp-content/uploads/2023/03/CL-LC-II-360-B-1-600x600.png'),
(10, 4, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FMT-AS-XG27ACG-5.png?alt=media&token=20af4423-2948-4304-a334-74174af76bb5'),
(11, 4, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FMT-AS-XG27ACG.png?alt=media&token=726d1274-8946-4bab-8735-9ea1262b8cfe'),
(12, 5, 'https://watanimall.com/wp-content/uploads/2023/04/MT-AS-VG27WQ.png'),
(13, 5, 'https://watanimall.com/wp-content/uploads/2023/04/MT-AS-VG27WQ-3.png'),
(14, 5, 'https://watanimall.com/wp-content/uploads/2023/04/MT-AS-VG27WQ-2.png'),
(15, 5, 'https://watanimall.com/wp-content/uploads/2023/04/MT-AS-VG27WQ-5.png'),
(16, 6, 'https://dlcdnwebimgs.asus.com/gain/c6a425c7-97c3-4437-a2a1-674423f77480/w800/fwebp'),
(17, 6, 'https://watanimall.com/wp-content/uploads/2023/05/GPU-AS-4060TI-O8G.png'),
(18, 6, 'https://dlcdnwebimgs.asus.com/gain/a931ab36-eee5-4c88-80cf-923ef24c88f8/w800/fwebp'),
(19, 6, 'https://watanimall.com/wp-content/uploads/2023/05/GPU-AS-4060TI-O8G-1-600x600.png'),
(20, 7, 'https://watanimall.com/wp-content/uploads/2022/06/KB-ROG-XA05-1.png'),
(21, 7, 'https://watanimall.com/wp-content/uploads/2022/06/KB-ROG-XA05-3.png'),
(22, 8, 'https://watanimall.com/wp-content/uploads/2021/03/CL-ML120-RGB-3B-3.png'),
(23, 8, 'https://watanimall.com/wp-content/uploads/2021/03/CL-ML120-RGB-3B.png'),
(24, 8, 'https://assets.corsair.com/image/upload/f_auto,q_auto/content/CO-9050076-WW-ML120-Pro-RGB-02-RAINBOW.png'),
(25, 4, 'https://watanimall.com/wp-content/uploads/2023/03/CL-LC-II-360-B-3.png'),
(26, 9, 'https://watanimall.com/wp-content/uploads/2023/02/ACER-NH.QFWEC_.005-4.png'),
(27, 9, 'https://watanimall.com/wp-content/uploads/2023/02/ACER-NH.QFWEC_.005.png'),
(28, 9, 'https://watanimall.com/wp-content/uploads/2023/02/ACER-NH.QFWEC_.005-1.png'),
(29, 10, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FRTX%203070%20Ti.png?alt=media&token=a30c7b86-e89b-4263-a4b9-d6acbb2b6c2b'),
(30, 10, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FRTX%203070%20Ti3.png?alt=media&token=a57c602c-7bcd-4c48-8c43-0ac487028eff'),
(31, 10, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FRTX%203070%20Ti2.png?alt=media&token=bf54dca4-922f-4101-b57c-6f455b0c3ba4'),
(32, 10, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FRTX%203070%20Ti4.png?alt=media&token=ffb2f43d-3220-4619-b9ce-33f9f289ad91'),
(33, 11, 'https://watanimall.com/wp-content/uploads/2022/09/MT-AS-VG24VQE.png'),
(34, 11, 'https://watanimall.com/wp-content/uploads/2022/09/MT-AS-VG24VQE-1.png'),
(35, 11, 'https://watanimall.com/wp-content/uploads/2022/09/MT-AS-VG24VQE-2.png'),
(36, 11, 'https://watanimall.com/wp-content/uploads/2022/09/MT-AS-VG24VQE-5.png'),
(37, 11, 'https://watanimall.com/wp-content/uploads/2022/11/CASE-H710I-BLACKRED.png'),
(38, 11, 'https://watanimall.com/wp-content/uploads/2022/11/CASE-H710I-BLACKRED.png'),
(39, 11, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2Fram%20(3).png?alt=media&token=bd881409-8246-4357-b350-9beaf195a906'),
(40, 11, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2Fpayment-1.png?alt=media&token=f8db739a-b6f1-4579-949b-36e50539d3d9'),
(41, 11, 'https://watanimall.com/wp-content/uploads/2020/11/MT-AS-VA27EHE.png'),
(42, 11, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FRitaj.gif?alt=media&token=cb7d30c3-0e61-4183-b4ac-75d0e61668e9'),
(43, 11, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2Fram%20(2).png?alt=media&token=4523622d-bb78-4a6e-a1d8-dc40581ffdc7'),
(44, 11, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2Fram%20(3).png?alt=media&token=954ad61d-9fcf-4367-8c62-4b783c45de41'),
(45, 11, 'https://watanimall.com/wp-content/uploads/2022/04/MT-66D6GAC2IS.png'),
(46, 12, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2F1690663866_1_1690663866_WOJmVNDIVB.jpg?alt=media&token=50bf58c7-93ca-46c6-be2e-d9d331c77d6d'),
(47, 12, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2F1690663866_1_1690663866_wtIua4CqTh.jpg?alt=media&token=9d88108c-6b57-4363-bf8b-c76d32c93ed6'),
(48, 12, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2F1690663866_1_1690663866_Qz2GZ0yD2t.jpg?alt=media&token=f9b1752c-d81f-470a-9c4e-53f34afd5067'),
(49, 12, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2F1690663866_1_1690663866_2K6VEVn47m.jpg?alt=media&token=30f74d98-4236-4103-8ded-2f88ccb28178'),
(50, 13, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2Fhyperx%20cloud1.png?alt=media&token=13dbbb5c-dc42-4a33-92da-76bcbc6d6576'),
(51, 13, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FHS-CLOUD-ALPHAR-1.png?alt=media&token=bfd6d08d-0a7b-48b0-9d23-476bc919fcf5'),
(52, 13, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FHS-CLOUD-ALPHAR-2.png?alt=media&token=1f08a509-4e38-4261-8180-d968de0ba6c0'),
(53, 13, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FHS-CLOUD-ALPHAR-5.png?alt=media&token=26574a61-f067-4a1b-85da-c5677f1d0161'),
(54, 13, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FHS-CLOUD-ALPHAR-6.png?alt=media&token=1f4867e8-260a-4f57-87b6-335be37d2498'),
(55, 9, 'https://watanimall.com/wp-content/uploads/2023/02/ACER-NH.QFWEC_.005-4.png'),
(56, 9, 'https://watanimall.com/wp-content/uploads/2023/02/ACER-NH.QFWEC_.005.png'),
(57, 9, 'https://watanimall.com/wp-content/uploads/2023/02/ACER-NH.QFWEC_.005-1.png'),
(58, 10, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FRTX%203070%20Ti.png?alt=media&token=a30c7b86-e89b-4263-a4b9-d6acbb2b6c2b'),
(59, 10, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FRTX%203070%20Ti3.png?alt=media&token=a57c602c-7bcd-4c48-8c43-0ac487028eff'),
(60, 10, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FRTX%203070%20Ti2.png?alt=media&token=bf54dca4-922f-4101-b57c-6f455b0c3ba4'),
(61, 10, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FRTX%203070%20Ti4.png?alt=media&token=ffb2f43d-3220-4619-b9ce-33f9f289ad91'),
(62, 11, 'https://watanimall.com/wp-content/uploads/2022/09/MT-AS-VG24VQE.png'),
(63, 11, 'https://watanimall.com/wp-content/uploads/2022/09/MT-AS-VG24VQE-1.png'),
(64, 11, 'https://watanimall.com/wp-content/uploads/2022/09/MT-AS-VG24VQE-2.png'),
(65, 11, 'https://watanimall.com/wp-content/uploads/2022/09/MT-AS-VG24VQE-5.png'),
(66, 11, 'https://watanimall.com/wp-content/uploads/2022/11/CASE-H710I-BLACKRED.png'),
(67, 11, 'https://watanimall.com/wp-content/uploads/2022/11/CASE-H710I-BLACKRED.png'),
(68, 11, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2Fram%20(3).png?alt=media&token=bd881409-8246-4357-b350-9beaf195a906'),
(69, 11, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2Fpayment-1.png?alt=media&token=f8db739a-b6f1-4579-949b-36e50539d3d9'),
(70, 11, 'https://watanimall.com/wp-content/uploads/2020/11/MT-AS-VA27EHE.png'),
(71, 11, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FRitaj.gif?alt=media&token=cb7d30c3-0e61-4183-b4ac-75d0e61668e9'),
(72, 11, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2Fram%20(2).png?alt=media&token=4523622d-bb78-4a6e-a1d8-dc40581ffdc7'),
(73, 11, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2Fram%20(3).png?alt=media&token=954ad61d-9fcf-4367-8c62-4b783c45de41'),
(74, 11, 'https://watanimall.com/wp-content/uploads/2022/04/MT-66D6GAC2IS.png'),
(75, 12, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2F1690663866_1_1690663866_WOJmVNDIVB.jpg?alt=media&token=50bf58c7-93ca-46c6-be2e-d9d331c77d6d'),
(76, 12, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2F1690663866_1_1690663866_wtIua4CqTh.jpg?alt=media&token=9d88108c-6b57-4363-bf8b-c76d32c93ed6'),
(77, 12, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2F1690663866_1_1690663866_Qz2GZ0yD2t.jpg?alt=media&token=f9b1752c-d81f-470a-9c4e-53f34afd5067'),
(78, 12, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2F1690663866_1_1690663866_2K6VEVn47m.jpg?alt=media&token=30f74d98-4236-4103-8ded-2f88ccb28178'),
(79, 13, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2Fhyperx%20cloud1.png?alt=media&token=13dbbb5c-dc42-4a33-92da-76bcbc6d6576'),
(80, 13, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FHS-CLOUD-ALPHAR-1.png?alt=media&token=bfd6d08d-0a7b-48b0-9d23-476bc919fcf5'),
(81, 13, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FHS-CLOUD-ALPHAR-2.png?alt=media&token=1f08a509-4e38-4261-8180-d968de0ba6c0'),
(82, 13, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FHS-CLOUD-ALPHAR-5.png?alt=media&token=26574a61-f067-4a1b-85da-c5677f1d0161'),
(83, 13, 'https://firebasestorage.googleapis.com/v0/b/zaid-539bb.appspot.com/o/product-images%2FHS-CLOUD-ALPHAR-6.png?alt=media&token=1f4867e8-260a-4f57-87b6-335be37d2498'),
(92, 12, 'das'),
(93, 11, 'ttttttttttttttttt'),
(1000, 12, 'adsasdasdasdasd'),
(1004, 18, 'https://watanimall.com/wp-content/uploads/2024/05/MT-MSI-G244F-E2-1.png'),
(1005, 18, 'https://watanimall.com/wp-content/uploads/2024/05/MT-MSI-G244F-E2-2.png'),
(1006, 18, 'https://watanimall.com/wp-content/uploads/2024/05/MT-MSI-G244F-E2-3.png'),
(1007, 18, 'https://watanimall.com/wp-content/uploads/2024/05/MT-MSI-G244F-E2-4.png'),
(1008, 18, 'https://watanimall.com/wp-content/uploads/2024/05/MT-MSI-G244F-E2.png'),
(1011, 20, 'https://watanimall.com/wp-content/uploads/2023/09/GPU-AS-D4060TI-O8G-WH-1.png'),
(1012, 20, 'https://watanimall.com/wp-content/uploads/2023/09/GPU-AS-D4060TI-O8G-WH-2.png'),
(1017, 23, 'https://watanimall.com/wp-content/uploads/2024/12/MT-AS-XG27ACG.png'),
(1026, 28, 'http://localhost:1001/uploads/1738371473720-GPU-GB-4070S-OC.png'),
(1027, 28, 'http://localhost:1001/uploads/1738371473732-GPU-GB-4070S-OC.png'),
(1028, 28, 'http://localhost:1001/uploads/1738371473739-GPU-GB-4070S-OC-1.png'),
(1029, 28, 'http://localhost:1001/uploads/1738371473747-GPU-GB-4070S-OC-2.png'),
(1030, 28, 'http://localhost:1001/uploads/1738371473753-GPU-GB-4070S-OC-3.png'),
(1031, 28, 'http://localhost:1001/uploads/1738371473758-GPU-GB-4070S-OC-4.png'),
(1037, 30, 'http://localhost:1001/uploads/1738451971686-1735750597_1_1735750597_JxnBZJDi7B.jpg'),
(1038, 30, 'http://localhost:1001/uploads/1738451971690-1735750597_1_1735750597_kKg3nu802x.jpg'),
(1039, 30, 'http://localhost:1001/uploads/1738451971692-1735750597_1_1735750597_UU5p9Sm8Wt.jpg'),
(1049, 37, 'http://localhost:1001/uploads/1738613271358-CL-H150-RGB.png'),
(1050, 37, 'http://localhost:1001/uploads/1738613271365-CL-H150-RGB-1.png'),
(1051, 37, 'http://localhost:1001/uploads/1738613271373-CL-H150-RGB-2.png'),
(1052, 37, 'http://localhost:1001/uploads/1738613271379-CL-H150-RGB-3.png'),
(1053, 38, 'https://watanimall.com/wp-content/uploads/2021/03/PSU-THOR-850P.png'),
(1054, 39, 'https://watanimall.com/wp-content/uploads/2023/12/PSU-LOKI-750P.png'),
(1062, 46, 'http://localhost:1001/uploads/1738882818068-GC-P132-NR-F2-158-7.png'),
(1063, 46, 'http://localhost:1001/uploads/1738882818081-GC-P132-NR-F2-158-6.png'),
(1064, 46, 'http://localhost:1001/uploads/1738882818088-GC-P132-NR-F2-158-8.png'),
(1065, 46, 'http://localhost:1001/uploads/1738882818095-GC-P132-NR-F2-158-9.png'),
(1071, 50, 'http://localhost:1001/uploads/1738889173158-1719519729_1_1719519729_fKOGLBa2Fc.png'),
(1072, 50, 'http://localhost:1001/uploads/1738889173171-1719519729_1_1719519729_0tj807NdKD.png'),
(1073, 50, 'http://localhost:1001/uploads/1738889173178-1719519729_1_1719519729_FKOd2aYeKK.png'),
(1074, 50, 'http://localhost:1001/uploads/1738889173184-1719519729_1_1719519729_INmLWdFecO.png'),
(1075, 50, 'http://localhost:1001/uploads/1738889173191-1719519729_1_1719519729_TRPwwxI5Te.png'),
(1078, 53, 'http://localhost:1001/uploads/1739063951032-1737913839_1_1737913839_PVWKRjd1PP.jpg'),
(1079, 53, 'http://localhost:1001/uploads/1739063951037-1737913839_1_1737913839_URnAli11ae.jpg'),
(1080, 53, 'http://localhost:1001/uploads/1739063951042-1737913839_1_1737913839_gJvSPu2BHG.jpg'),
(1081, 53, 'http://localhost:1001/uploads/1739063951047-1737913839_1_1737913839_r1qG6zcKoK.jpg'),
(1082, 54, 'http://localhost:1001/uploads/1739064108623-1736071536_1_1736071536_i1Zp1dR0Hn.jpg'),
(1083, 54, 'http://localhost:1001/uploads/1739064108628-1736071536_1_1736071536_zuON3QVVib.jpg'),
(1084, 54, 'http://localhost:1001/uploads/1739064108633-1736071536_1_1736071536_cYTH92rNpP.jpg'),
(1090, 57, 'http://localhost:1001/uploads/1739065880731-1724057180_1_1724057180_Uh7OcYr8B2.png'),
(1091, 57, 'http://localhost:1001/uploads/1739065880738-1724057180_1_1724057180_iqGhpmR9fI.png'),
(1093, 59, 'http://localhost:1001/uploads/1739067216271-1738165225_1_1738165225_MTCoW9JXFZ.jpg'),
(1094, 59, 'http://localhost:1001/uploads/1739067216278-1738165225_1_1738165225_bvzljafnUR.jpg'),
(1095, 60, 'http://localhost:1001/uploads/1739538237487-1719523308_1_1719523308_NgvkFxlWPX.png'),
(1096, 60, 'http://localhost:1001/uploads/1739538237498-1719523308_1_1719523308_gl5S6eoPOy.png'),
(1097, 60, 'http://localhost:1001/uploads/1739538237503-1719523308_1_1719523308_D9fnFFcDRA.png'),
(1098, 60, 'http://localhost:1001/uploads/1739538237509-1719523308_1_1719523308_MvKNyeaDhc.png');

-- --------------------------------------------------------

--
-- Table structure for table `product_types`
--

CREATE TABLE `product_types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_types`
--

INSERT INTO `product_types` (`id`, `name`) VALUES
(1, 'CPU');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_types`
--
ALTER TABLE `product_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1099;

--
-- AUTO_INCREMENT for table `product_types`
--
ALTER TABLE `product_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
