/*
 * @Author: qiao
 * @Date: 2018-07-14 19:18:39
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-14 19:28:08
 * 相关货物表
 */
import { Application } from 'egg';
import Sequelize, { INTEGER, Instance } from 'sequelize';

interface IRelatedGoodAttr {
  id: number;
  goods_id: number;
  related_goods_id: number;
}

interface IRelatedGoodInst extends Instance<IRelatedGoodAttr>, IRelatedGoodAttr{}

interface IRelatedGoodModel extends Sequelize.Model<IRelatedGoodInst, IRelatedGoodAttr> {}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const relatedGood = sequelize.define(tablePrefix + 'related_good', {
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

    related_goods_id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
  }) as IRelatedGoodModel;

  return relatedGood;
};
