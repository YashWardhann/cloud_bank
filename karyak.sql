-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 17, 2021 at 01:31 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `karyak`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `account_id` int(11) NOT NULL,
  `account_number` int(11) NOT NULL,
  `account_type` varchar(10) NOT NULL,
  `user_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `account_number`, `account_type`, `user_id`) VALUES
(0, 1234, 'savings', 2),
(123, 1234567890, 'savings', 1),
(124, 1122334455, 'current', 1),
(125, 1234554321, 'savings', 2),
(126, 1231231231, 'current', 2),
(127, 1234123412, 'savings', 3),
(128, 1234512345, 'current', 3);

-- --------------------------------------------------------

--
-- Table structure for table `attendancelist`
--

CREATE TABLE `attendancelist` (
  `id` int(11) NOT NULL,
  `studentname` varchar(256) DEFAULT NULL,
  `major` varchar(256) DEFAULT NULL,
  `course` varchar(256) DEFAULT NULL,
  `coursedate` date DEFAULT NULL,
  `attendOrNot` varchar(7) NOT NULL DEFAULT 'PRESENT'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `attendancelist`
--

INSERT INTO `attendancelist` (`id`, `studentname`, `major`, `course`, `coursedate`, `attendOrNot`) VALUES
(1, 'Alice', 'BEng', 'COMP3322', '2018-10-15', 'PRESENT'),
(2, 'Bob', 'BEcon', 'COMP3327', '2018-10-16', 'PRESENT'),
(3, 'Charlie', 'BBA', 'COMP3329', '2018-10-11', 'PRESENT'),
(4, 'Dave', 'BBA', 'COMP3322', '2018-10-12', 'PRESENT'),
(5, 'Eve', 'BJ', 'COMP3403', '2018-10-15', 'PRESENT'),
(6, 'Issac', 'BEng', 'COMP3403', '2018-10-16', 'PRESENT');

-- --------------------------------------------------------

--
-- Table structure for table `current`
--

CREATE TABLE `current` (
  `account_number` int(11) NOT NULL,
  `balance_hkd` int(11) NOT NULL,
  `balance_usd` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `current`
--

INSERT INTO `current` (`account_number`, `balance_hkd`, `balance_usd`) VALUES
(1234512345, 10, 5),
(1122334455, 10000, 500),
(1231231231, 998999, 10000);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customer_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `login_time` time NOT NULL,
  `login_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customer_id`, `name`, `login_time`, `login_date`) VALUES
(0, 'Yash', '00:00:00', '0000-00-00'),
(2, 'Aryak Kumar', '08:17:16', '2021-11-15'),
(3, 'Raunak Chopra', '07:20:21', '2021-11-16');

-- --------------------------------------------------------

--
-- Table structure for table `login_history`
--

CREATE TABLE `login_history` (
  `user_id` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `login_history`
--

INSERT INTO `login_history` (`user_id`, `time`) VALUES
(1, '2021-11-10 03:21:21'),
(1, '2021-11-02 16:00:00'),
(2, '2021-11-05 00:40:51'),
(2, '2021-11-11 01:33:17'),
(3, '2021-11-12 07:17:52');

-- --------------------------------------------------------

--
-- Table structure for table `savings`
--

CREATE TABLE `savings` (
  `id` int(11) NOT NULL,
  `account_number` int(11) NOT NULL,
  `balance_hkd` int(11) NOT NULL,
  `balance_usd` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `savings`
--

INSERT INTO `savings` (`id`, `account_number`, `balance_hkd`, `balance_usd`) VALUES
(123, 1234567890, 10000, 400),
(124, 1234554321, 1001001, 10000),
(125, 1234123412, 500, 0);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `trans_id` int(11) NOT NULL,
  `to_account` int(11) NOT NULL,
  `from_account` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `currency` varchar(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`trans_id`, `to_account`, `from_account`, `amount`, `currency`, `time`) VALUES
(1, 1231231231, 1234554321, 10, 'HKD', '0000-00-00 00:00:00'),
(2, 1231231231, 1234554321, 10000, 'HKD', '0000-00-00 00:00:00'),
(3, 1231231231, 1234554321, 696969, 'HKD', '0000-00-00 00:00:00'),
(4, 1231231231, 1234554321, 1, 'hkd', '0000-00-00 00:00:00'),
(5, 1231231231, 1234554321, 1000, 'hkd', '0000-00-00 00:00:00'),
(123, 1234554321, 1122334455, 100, 'HKD', '2021-11-11 04:18:39'),
(124, 1231231231, 1234123412, 20, 'USD', '2021-11-03 04:13:46');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `account_number` (`account_number`);

--
-- Indexes for table `attendancelist`
--
ALTER TABLE `attendancelist`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `current`
--
ALTER TABLE `current`
  ADD PRIMARY KEY (`balance_hkd`),
  ADD UNIQUE KEY `account_number` (`account_number`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `savings`
--
ALTER TABLE `savings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `account_number` (`account_number`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`trans_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendancelist`
--
ALTER TABLE `attendancelist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `trans_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
