DROP TABLE IF EXISTS `nideshop_brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nideshop_brands` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `list_pic_url` varchar(255) NOT NULL DEFAULT '',
  `simple_desc` varchar(255) NOT NULL DEFAULT '',
  `pic_url` varchar(255) NOT NULL DEFAULT '',
  `sort_order` tinyint(3) unsigned NOT NULL DEFAULT '50',
  `is_show` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `floor_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `app_list_pic_url` varchar(255) NOT NULL DEFAULT '',
  `is_new` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `new_pic_url` varchar(255) NOT NULL DEFAULT '',
  `new_sort_order` tinyint(2) unsigned NOT NULL DEFAULT '10',
  PRIMARY KEY (`id`),
  KEY `is_show` (`is_show`)
  -- 使用AUTO_INCREMENT定义自增初始值
) ENGINE=MyISAM AUTO_INCREMENT=1046012 DEFAULT CHARSET=utf8mb4;