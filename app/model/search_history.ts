/*
 * @Author: qiao
 * @Date: 2018-07-11 11:24:22
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 14:41:54
 * 搜索历史表
 */

import { Application } from 'egg';
import Sequelize, { INTEGER, STRING, Instance } from 'sequelize';

interface ISearchHistoryAttr {
  id?: number;
  keyword: string;
  from?: string;
  add_time: number;
  user_id: string;
}

interface ISearchHistoryInst extends Instance<ISearchHistoryAttr>, ISearchHistoryAttr {
}

interface ISearchHistoryModel extends Sequelize.Model<ISearchHistoryInst, ISearchHistoryAttr> {
}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const searchHistory = sequelize.define(tablePrefix + 'search_history', {
    id: {
      type: INTEGER(10).UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    keyword: {
      type: STRING(50),
      allowNull: false,
    },

    from: {
      type: STRING(45),
      allowNull: false,
      defaultValue: '',
      comment: '搜索来源，如PC、小程序、APP等',
    },

    add_time: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment: '搜索时间',
    },

    user_id: {
      type: STRING(45),
      defaultValue: null,
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '28',
  }) as ISearchHistoryModel;

  return searchHistory;
};
