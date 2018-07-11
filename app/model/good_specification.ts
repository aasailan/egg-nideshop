/*
 * @Author: qiao
 * @Date: 2018-07-11 19:52:36
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 20:11:35
 * 商品对应规格表值表
 */

import { Application } from 'egg';
import Sequelize, { INTEGER, SMALLINT, STRING, TEXT, TINYINT, Instance } from 'sequelize';

interface IGoodSpecificationAttr {
  id: number;
  goods_id: number;
  specification_id: number;
  value: string;
  pic_url: string;
}

interface IGoodSpecificationInst extends Instance<IGoodSpecificationAttr>, IGoodSpecificationAttr {}

interface IGoodSpecificationModel extends Sequelize.Model<IGoodSpecificationInst, IGoodSpecificationAttr> {}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const specification = sequelize.define(tablePrefix + '', {
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

    specification_id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    value: {
      type: STRING(50),
      allowNull: false,
      defaultValue: '',
    },

    pic_url: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '6',
    indexes: [
      { name: 'goods_id', fields: ['goods_id'] },
      { name: 'specification_id', fields: ['specification_id'] },
    ],
  }) as IGoodSpecificationModel;

  return specification;
};
