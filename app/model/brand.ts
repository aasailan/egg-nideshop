/*
 * @Author: qiao
 * @Date: 2018-07-01 13:13:34
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-02 14:09:51
 * 品牌表
 */

import { Application } from 'egg';
import Sequelize, { DECIMAL, INTEGER, STRING, TINYINT, Instance } from 'sequelize';

interface IBrandAttr {
  id: number;
  name: string;
  list_pic_url: string;
  simple_desc: string;
  pic_url: string;
  sort_order: number;
  is_show: number;
  floor_price: number;
  app_list_pic_url: string;
  is_new: number;
  new_pic_url: string;
  new_sort_order: number;
}

interface IBrandInst extends Instance<IBrandAttr>, IBrandAttr {
}

interface IBrandModel extends Sequelize.Model<IBrandInst, IBrandAttr> {
}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  // TODO: mysql里面定义了ENGINE，这里没有定义
  const brand = sequelize.define(tablePrefix + 'brand', {
    id: {
      type: INTEGER(11).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    list_pic_url: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    simple_desc: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    pic_url: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    sort_order: {
      type: TINYINT(3).UNSIGNED,
      allowNull: false,
      defaultValue: 50,
    },

    is_show: {
      type: TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      comment: '是否显示： 1 显示， 0不显示',
      // index: true,
    },

    floor_price: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    app_list_pic_url: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    is_new: {
      type: TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '是否是新品牌？？',
    },

    new_pic_url: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    new_sort_order: {
      type: TINYINT(2).UNSIGNED,
      allowNull: false,
      defaultValue: 10,
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    // 设置增长初始值
    initialAutoIncrement: '1046012',
    indexes: [
      {
        name: 'is_show',
        fields: ['is_show'],
      },
    ],
  }) as IBrandModel;

  return brand;
};