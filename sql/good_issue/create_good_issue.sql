CREATE TABLE `nideshop_goods_issues` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `goods_id` text,
  `question` varchar(255) DEFAULT NULL,
  `answer` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;