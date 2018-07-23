/*
 * @Author: qiao
 * @Date: 2018-07-11 17:04:06
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 19:32:34
 * 用户收藏表
 */

import { Application } from 'egg';
import Sequelize, { MEDIUMINT, INTEGER, TINYINT, Instance } from 'sequelize';

interface ICollectAttr {
  id?: number;
  user_id: number;
  value_id: number;
  add_time: number;
  is_attention?: number;
  type_id: number;
}

interface ICollectInst extends Instance<ICollectAttr>, ICollectAttr {}

interface ICollectModel extends Sequelize.Model<ICollectInst, ICollectAttr> {
  isUserHasCollect: (userId: number, typeId: number, valueId: number) => PromiseLike<boolean>;
}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const collect = sequelize.define(tablePrefix + 'collect', {
    id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    value_id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '货物id',
    },

    add_time: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    is_attention: {
      type: TINYINT(1),
      allowNull: false,
      defaultValue: 0,
      comment: '是否是收藏，这个关键字应该无用',
    },

    type_id: {
      type: INTEGER(2).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '55',
    indexes: [
      { name: 'user_id', fields: ['user_id'] },
      { name: 'goods_id', fields: ['value_id'] },
      { name: 'is_attention', fields: ['is_attention'] },
    ],
  }) as ICollectModel;

  /**
   * @description 检查用户是否对指定货物进行了收藏
   * @param {number} userId 用户id
   * @param {number} typeId 类型id???，作用未知，固定为0
   * @param {number} valueId 值id
   * @returns {Promise<boolean>} hasCollect 如果是ture则已经收藏
   */
  collect.isUserHasCollect = (userId: number, typeId: number, valueId: number) => {
    return collect.count({
      where: { type_id: typeId, value_id: valueId, user_id: userId },
      col: 'id',
    }).then(count => count > 0);
  };

  return collect;
};