/*
 * @Author: qiao
 * @Date: 2018-07-12 11:55:46
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-14 15:23:41
 * 具体商品表
 */

import { Application } from 'egg';
import Sequelize, { MEDIUMINT, DECIMAL, STRING, Instance } from 'sequelize';

interface IProductAttr {
  id: number;
  goods_id: number;
  goods_specification_ids: string;
  goods_sn: string;
  goods_number: number;
  retail_price: number;
}

export interface IProductInst extends Instance<IProductAttr>, IProductAttr {}

interface IProductModel extends Sequelize.Model<IProductInst, IProductAttr> {}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const product = sequelize.define(tablePrefix + 'product', {
    id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    goods_id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    goods_specification_ids: {
      type: STRING(50),
      allowNull: false,
      defaultValue: '',
      comment: '货物的规格id，多个使用_作为连接符',
    },

    goods_sn: {
      type: STRING(60),
      allowNull: false,
      defaultValue: '',
      comment: '货物sn号码',
    },

    goods_number: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '货物数量',
    },

    retail_price: {
      type: DECIMAL(10, 2).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '零售价格',
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '245',
  }) as IProductModel;

  return product;
};
