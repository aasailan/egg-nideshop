CREATE TABLE `nideshop_attributes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `attribute_category_id` int(11) unsigned NOT NULL DEFAULT '0',
  `name` varchar(60) NOT NULL DEFAULT '',
  `input_type` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `values` text NOT NULL,
  `sort_order` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `cat_id` (`attribute_category_id`)
) ENGINE=MyISAM AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4;