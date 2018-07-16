/*
 * @Author: qiao
 * @Date: 2018-07-16 11:42:39
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-16 11:52:55
 * 用户优惠券表
 */

import { Application } from 'egg';
import Sequelize, { MEDIUMINT, INTEGER, STRING, TINYINT, Instance } from 'sequelize';

interface IUserCouponAttr {
  id: number;
  coupon_id: number;
  coupon_number: string;
  user_id: number;
  used_time: number;
  order_id: number;
}

interface IUserCouponInst extends Instance<IUserCouponAttr>, IUserCouponAttr{}

interface IUserCouponModel extends Sequelize.Model<IUserCouponInst, IUserCouponAttr> {}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const userCoupon = sequelize.define(tablePrefix + 'user_coupon', {
    id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    coupon_id: {
      type: TINYINT(3).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    coupon_number: {
      type: STRING(20),
      allowNull: false,
      defaultValue: '',
    },

    user_id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    used_time: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    order_id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '32',
    indexes: [
      { name: 'user_id', fields: ['user_id'] },
    ],
  }) as IUserCouponModel;

  return userCoupon;
};