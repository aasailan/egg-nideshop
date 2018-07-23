/*
 * @Author: qiao
 * @Date: 2018-07-23 11:08:08
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-23 11:34:26
 * 订单货物表
 */

import { Application } from 'egg';
import Sequelize, { MEDIUMINT, TEXT, DECIMAL, SMALLINT, STRING, TINYINT, Instance } from 'sequelize';

export interface IOrderGoodsAttr {
  id?: number;
  order_id: number;
  goods_id: number;
  goods_name: string;
  goods_sn: string;
  product_id: number;
  number: number;
  market_price: number;
  retail_price: number;
  goods_specifition_name_value: string;
  is_real?: number;
  goods_specifition_ids: string;
  list_pic_url: string;
}

interface IOrderGoodsInst extends Instance<IOrderGoodsAttr>, IOrderGoodsAttr {}

interface IOrderGoodsModel extends Sequelize.Model<IOrderGoodsInst, IOrderGoodsAttr> {}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const orderGoods = sequelize.define(tablePrefix + 'order_good', {
    id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    order_id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '订单id'
    },

    goods_id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '货物id'
    },

    goods_name: {
      type: STRING(120),
      allowNull: false,
      defaultValue: '',
    },

    goods_sn: {
      type: STRING(60),
      allowNull: false,
      defaultValue: '',
    },

    product_id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    number: {
      type: SMALLINT(5).UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },

    market_price: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    retail_price: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    goods_specifition_name_value: {
      type: TEXT,
      allowNull: false,
    },

    is_real: {
      type: TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    goods_specifition_ids: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    list_pic_url: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '24',
    indexes: [
      { name: 'order_id', fields: ['order_id'] },
      { name: 'goods_id', fields: ['goods_id'] },
    ],
  }) as IOrderGoodsModel;

  return orderGoods;
};
