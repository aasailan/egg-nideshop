/*
 * @Author: qiao
 * @Date: 2018-07-21 14:19:44
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-21 15:03:47
 * 搜索关键字
 */

import { Application } from 'egg';
import Sequelize, { INTEGER, STRING, TINYINT, Instance } from 'sequelize';

interface IKeywordAttr {
  id: number;
  keyword: string;
  is_hot: number;
  is_default: number;
  is_show: number;
  sort_order: number;
  scheme_url: string;
  type: number;
}

interface IKeywordInst extends Instance<IKeywordAttr>, IKeywordAttr {}

interface IAddressModel extends Sequelize.Model<IKeywordInst, IKeywordAttr> {}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const keyword = sequelize.define(tablePrefix + 'keyword', {
    keyword: {
      type: STRING(90),
      allowNull: false,
      defaultValue: '',
      primaryKey: true,
    },

    is_hot: {
      type: TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '是否热搜关键字，0为非热搜，1为热搜',
    },

    is_default: {
      type: TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '是否是输入框的默认搜索项，0不是，1是',
    },

    is_show: {
      type: TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      comment: '是否显示，默认都显示',
    },

    sort_order: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 100,
    },

    scheme_url: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
      comment: '搜索关键字的跳转链接',
    },

    id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },

    type: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    timestamps: false,
    comment: '搜索历史',
    charset: 'utf8mb4',
  }) as IAddressModel;

  return keyword;
};