-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 18, 2018 at 03:07 AM
-- Server version: 10.1.21-MariaDB
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mcpaeis`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `email_address` varchar(65) NOT NULL,
  `first_name` varchar(65) NOT NULL,
  `last_name` varchar(65) NOT NULL,
  `date_added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `category` varchar(65) NOT NULL,
  `password` varchar(65) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `email_address`, `first_name`, `last_name`, `date_added`, `category`, `password`) VALUES
(1, 'dakurahsixtus@outlook.com', 'Sixtus', 'Dakurah', '2018-03-18 00:45:31', 'admin', '$2y$10$YmI2OGFjMTEwZThjYjVhZeSEacjXIH7RS6svKYIyZ29Ir28wEVoQW'),
(2, 'nti@gmail.com', 'Michealda', 'Nti', '2018-03-18 01:26:59', 'sec', '$2y$10$NDVjZGU2ZTUyYTk5ZTRiMuou4vTzMnEOP3QITiyEbsW9yxO3thP/.');

-- --------------------------------------------------------

--
-- Table structure for table `fee`
--

CREATE TABLE `fee` (
  `id` int(11) NOT NULL,
  `category_name` varchar(65) NOT NULL,
  `fee_category` varchar(65) NOT NULL,
  `amount_per_copy` float DEFAULT NULL,
  `initial_limit` int(11) DEFAULT NULL,
  `amount_per_initial_limit` float DEFAULT NULL,
  `amount_per_additional_copy` float DEFAULT NULL,
  `last_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `fee`
--

INSERT INTO `fee` (`id`, `category_name`, `fee_category`, `amount_per_copy`, `initial_limit`, `amount_per_initial_limit`, `amount_per_additional_copy`, `last_updated`) VALUES
(1, 'Undergraduate', 'Flat', 10, NULL, NULL, NULL, '2018-03-18 01:21:38'),
(2, 'Post graduate', 'Flat', 15, NULL, NULL, NULL, '2018-03-18 01:22:02'),
(3, 'Undergraduate', 'Reducing Balance', NULL, 5, 10, 5, '2018-03-18 01:22:48'),
(4, 'Post graduate', 'Reducing Balance', NULL, 5, 15, 10, '2018-03-18 01:23:16');

-- --------------------------------------------------------

--
-- Table structure for table `recommendations`
--

CREATE TABLE `recommendations` (
  `id` int(11) NOT NULL,
  `authorisation_id` int(11) NOT NULL,
  `requester_reference` varchar(65) NOT NULL,
  `category_id` int(11) NOT NULL,
  `copies` int(11) NOT NULL,
  `amount` float NOT NULL,
  `date_requested` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_issued` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(65) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `recommenders`
--

CREATE TABLE `recommenders` (
  `id` int(11) NOT NULL,
  `email_address` varchar(65) NOT NULL,
  `password` varchar(65) NOT NULL,
  `first_name` varchar(65) NOT NULL,
  `last_name` varchar(65) NOT NULL,
  `date_added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(65) NOT NULL DEFAULT 'active',
  `last_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `recommenders`
--

INSERT INTO `recommenders` (`id`, `email_address`, `password`, `first_name`, `last_name`, `date_added`, `status`, `last_updated`) VALUES
(1, 'dakurahsixtus@outlook.com', '$2y$10$NjAzMzVkODU3MDM0YjU1Men8bqFe6RDp1nRX8DEe9jj7Yz9DttA9W', 'Sixtus', 'Dakurah', '2018-03-18 01:24:03', 'active', '2018-03-18 01:24:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fee`
--
ALTER TABLE `fee`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recommendations`
--
ALTER TABLE `recommendations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recommenders`
--
ALTER TABLE `recommenders`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `fee`
--
ALTER TABLE `fee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `recommendations`
--
ALTER TABLE `recommendations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `recommenders`
--
ALTER TABLE `recommenders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
