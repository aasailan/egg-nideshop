DROP TABLE IF EXISTS `nideshop_goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nideshop_goods` (
  -- 货物id
  `id` int(11) unsigned NOT NULL,
  -- 分类id（货物属于哪个类别）
  `category_id` int(11) unsigned NOT NULL DEFAULT '0',
  -- 货物sn（？？）
  `goods_sn` varchar(60) NOT NULL DEFAULT '',
  -- 货物名字
  `name` varchar(120) NOT NULL DEFAULT '',
  -- 品牌id
  `brand_id` int(11) unsigned NOT NULL DEFAULT '0',
  -- 货物数量
  `goods_number` mediumint(8) unsigned NOT NULL DEFAULT '0',
  -- 货物关键字（暂时没用）
  `keywords` varchar(255) NOT NULL DEFAULT '',
  -- 货物简介
  `goods_brief` varchar(255) NOT NULL DEFAULT '',
  -- 货物描述(都是图片描述)
  `goods_desc` text,
  -- 是否正在卖（标志位） 1 正在卖
  `is_on_sale` tinyint(1) unsigned NOT NULL DEFAULT '1',
  -- 获取添加时间
  `add_time` int(10) unsigned NOT NULL DEFAULT '0',
  -- ？？
  `sort_order` smallint(4) unsigned NOT NULL DEFAULT '100',
  -- 是否被删除
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT '0',
  -- ？？
  `attribute_category` int(11) unsigned NOT NULL DEFAULT '0',
  -- 专柜价格
  `counter_price` decimal(10,2) unsigned NOT NULL DEFAULT '0.00' COMMENT '专柜价格',
  -- 附加价格
  `extra_price` decimal(10,2) unsigned NOT NULL DEFAULT '0.00' COMMENT '附加价格',
  -- ??
  `is_new` tinyint(1) unsigned NOT NULL DEFAULT '0',
  -- 商品单位
  `goods_unit` varchar(45) NOT NULL COMMENT '商品单位',
  -- 商品主图
  `primary_pic_url` varchar(255) NOT NULL COMMENT '商品主图',
  -- 商品列表图
  `list_pic_url` varchar(255) NOT NULL COMMENT '商品列表图',
  -- 零售价格
  `retail_price` decimal(10,2) unsigned NOT NULL DEFAULT '0.00' COMMENT '零售价格',
  -- 销售量
  `sell_volume` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '销售量',
  -- ？？
  `primary_product_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '主sku　product_id',
  -- 单价
  `unit_price` decimal(10,2) unsigned NOT NULL DEFAULT '0.00' COMMENT '单位价格，单价',
  -- 促销描述
  `promotion_desc` varchar(255) NOT NULL,
  -- 促销标签
  `promotion_tag` varchar(45) NOT NULL,
  -- app 价格
  `app_exclusive_price` decimal(10,2) unsigned NOT NULL COMMENT 'APP专享价',
  -- 是否是app专属
  `is_app_exclusive` tinyint(1) unsigned NOT NULL COMMENT '是否是APP专属',
  -- ???
  `is_limited` tinyint(1) unsigned NOT NULL,
  -- 是否正在热卖
  `is_hot` tinyint(1) unsigned NOT NULL DEFAULT '0',

  -- 定义主键
  PRIMARY KEY (`id`),
  -- 定义索引（https://www.cnblogs.com/jianmingyuan/p/6740090.html）
  KEY `goods_sn` (`goods_sn`),
  KEY `cat_id` (`category_id`),
  KEY `brand_id` (`brand_id`),
  KEY `goods_number` (`goods_number`),
  KEY `sort_order` (`sort_order`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;