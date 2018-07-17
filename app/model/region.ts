/*
 * @Author: qiao
 * @Date: 2018-07-16 11:30:32
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-16 19:55:58
 * 省份城市区域表
 */
import { Application } from 'egg';
import Sequelize, { SMALLINT, STRING, TINYINT, Instance } from 'sequelize';

interface IRegionAttr {
  id: number;
  parent_id: number;
  name: string;
  type: number;
  agency_id: number;
}

interface IRegionInst extends Instance<IRegionAttr>, IRegionAttr {}

interface IRegionModel extends Sequelize.Model<IRegionInst, IRegionAttr> {
  getRegionName: (regionId: number) => PromiseLike<string>;
}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const region = sequelize.define(tablePrefix + 'region', {
    id: {
      type: SMALLINT(5).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    parent_id: {
      type: SMALLINT(5).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    name: {
      type: STRING(120),
      allowNull: false,
      defaultValue: '',
    },

    type: {
      type: TINYINT(1),
      allowNull: false,
      defaultValue: 2,
    },

    agency_id: {
      type: SMALLINT(5).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '4044',
  }) as IRegionModel;

  /**
   * @description 获取区域的名称
   * @param {number} regionId
   * @returns {PromiseLike<string>}
   */
  region.getRegionName = (regionId: number) => {
    return app.model.Region.find({
      where: { id: regionId },
      raw: true,
      attributes: ['name'],
    }).then(res => res.name);
  };

  return region;
};