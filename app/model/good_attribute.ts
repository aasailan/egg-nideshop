/*
 * @Author: qiao
 * @Date: 2018-07-11 16:33:17
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 16:45:55
 * 商品属性
 */

import { Application } from 'egg';
import Sequelize, { INTEGER, TEXT, Instance } from 'sequelize';

interface IGoodAttributeAttr {
  id: number;
  goods_id: number;
  attribute_id: number;
  value: string;
}

interface IGoodAttributeInst extends Instance<IGoodAttributeAttr>, IGoodAttributeAttr {}

interface IGoodAttributeModel extends Sequelize.Model<IGoodAttributeInst, IGoodAttributeAttr> {}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const goodAttribute = sequelize.define(tablePrefix + 'goods_attribute', {
    id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    goods_id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    attribute_id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    value: {
      type: TEXT,
      allowNull: false,
      comment: '货物属性描述',
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '872',
    indexes: [
      { name: 'goods_id', fields: ['goods_id'] },
      { name: 'attr_id', fields: ['attribute_id'] },
    ],
  }) as IGoodAttributeModel;

  return goodAttribute;
};
