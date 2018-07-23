/*
 * @Author: qiao
 * @Date: 2018-07-01 14:46:28
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-02 21:36:02
 * 广告位置表
 */
import { Application } from 'egg';
import Sequelize, { SMALLINT, STRING, TINYINT, Instance } from 'sequelize';

// 属性接口
interface IAdPostionAttr {
  id: number;
  name: string;
  width: number;
  height: number;
  desc: string;
}

interface IAdPositionInst extends Instance<IAdPostionAttr>, IAdPostionAttr {
}

interface IAdPositionModel extends Sequelize.Model<IAdPositionInst, IAdPostionAttr> {
}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const adPosition = sequelize.define(tablePrefix + 'ad_position', {
    id: {
      type: TINYINT(3).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: STRING(60),
      allowNull: false,
      defaultValue: '',
    },

    width: {
      type: SMALLINT(5).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    height: {
      type: SMALLINT(5).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    desc: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },
  }, {
    timestamps: false,
    initialAutoIncrement: '2',
    charset: 'utf8mb4',
  }) as IAdPositionModel;

  return adPosition;
};