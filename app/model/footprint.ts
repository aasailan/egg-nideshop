/*
 * @Author: qiao
 * @Date: 2018-07-11 17:21:10
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 19:44:07
 * 用户足迹表
 */

import { Application } from 'egg';
import Sequelize, { INTEGER, Instance } from 'sequelize';

interface IFootPrintAttr {
  id?: number;
  user_id: number;
  goods_id: number;
  add_time: number;
}

interface IFootPrintInst extends Instance<IFootPrintAttr>, IFootPrintAttr{}

interface IFootPrintModel extends Sequelize.Model<IFootPrintInst, IFootPrintAttr>{
  addFootprint: (userId: number, goodsId: number) => PromiseLike<IFootPrintInst>;
}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const footprint = sequelize.define(tablePrefix + 'footprint', {
    id: {
      type: INTEGER(11).UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    user_id: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: 0,
    },

    goods_id: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment: '用户查看过的货物id',
    },

    add_time: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '92',
  }) as IFootPrintModel;

  /**
   * @description 记录用户查看过哪些货物详情
   * @param {number} userId 用户id
   * @param {number} goodsId 货物id
   * @returns {PromiseLike<IFootPrintInst>} 添加后的记录
   */
  footprint.addFootprint = (userId: number, goodsId: number) => {
    // 用户已登录才能添加到足迹
    if (userId > 0 && goodsId > 0) {
      return footprint.create({
        goods_id: goodsId,
        user_id: userId,
        add_time: Date.now() / 1000,
      });
    }
  };

  return footprint;
};
