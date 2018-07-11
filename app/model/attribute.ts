/*
 * @Author: qiao
 * @Date: 2018-07-11 18:21:54
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 18:48:00
 * 商品特性表
 */

import { Application } from 'egg';
import Sequelize, { INTEGER, STRING, TEXT, TINYINT, Instance } from 'sequelize';

interface IAttributeAttr {
  id: number;
  attribute_category_id: number;
  name: string;
  input_type: number;
  values: string;
  sort_order: number;
}

interface IAttributeInst extends Instance<IAttributeAttr>, IAttributeAttr{}

interface IAttributeModel extends Sequelize.Model<IAttributeInst, IAttributeAttr>{}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const attribute = sequelize.define(tablePrefix + 'attribute', {
    id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    attribute_category_id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    name: {
      type: STRING(60),
      allowNull: false,
      defaultValue: '',
      comment: '属性名称',
    },

    input_type: {
      type: TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },

    values: {
      type: TEXT,
      allowNull: false,
    },

    sort_order: {
      type: TINYINT(3).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '103',
    indexes: [
      { name: 'cat_id', fields: ['attribute_category_id'] },
    ],
  }) as IAttributeModel;

  return attribute;
};
