/*
 * @Author: qiao
 * @Date: 2018-07-11 20:32:00
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 20:40:47
 * 规格表
 */

import { Application } from 'egg';
import Sequelize, { INTEGER, STRING, TINYINT, Instance } from 'sequelize';

interface ISpecificationAttr {
  id: number;
  name: string;
  sort_order: number;
}

interface ISpecificationInst extends Instance<ISpecificationAttr>, ISpecificationAttr{}

interface ISpecificationModel extends Sequelize.Model<ISpecificationInst, ISpecificationAttr> {}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const specification = sequelize.define(tablePrefix + 'specification', {
    id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: STRING(60),
      allowNull: false,
      defaultValue: '',
      comment: '规格名',
    },

    sort_order: {
      type: TINYINT(3).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '3',
  }) as ISpecificationModel;

  return specification;
};
