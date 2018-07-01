CREATE TABLE `nideshop_topics` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '''''',
  `content` text,
  `avatar` varchar(255) NOT NULL DEFAULT '',
  `item_pic_url` varchar(255) NOT NULL DEFAULT '',
  `subtitle` varchar(255) NOT NULL DEFAULT '''',
  `topic_category_id` int(11) unsigned NOT NULL DEFAULT '0',
  `price_info` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `read_count` varchar(255) NOT NULL DEFAULT '0',
  `scene_pic_url` varchar(255) NOT NULL DEFAULT '',
  
  `topic_template_id` int(11) unsigned NOT NULL DEFAULT '0',
  `topic_tag_id` int(11) unsigned NOT NULL DEFAULT '0',
  `sort_order` int(11) unsigned NOT NULL DEFAULT '100',
  `is_show` tinyint(1) unsigned NOT NULL DEFAULT '1',
  KEY `topic_id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=316 DEFAULT CHARSET=utf8mb4;