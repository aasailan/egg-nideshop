CREATE TABLE `nideshop_goods_specifications` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `goods_id` int(11) unsigned NOT NULL DEFAULT '0',
  `specification_id` int(11) unsigned NOT NULL DEFAULT '0',
  `value` varchar(50) NOT NULL DEFAULT '',
  `pic_url` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `goods_id` (`goods_id`),
  KEY `specification_id` (`specification_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COMMENT='商品对应规格表值表';