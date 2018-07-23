/*
 * @Author: qiao
 * @Date: 2018-07-11 16:47:05
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 16:59:32
 * 货物常见问题
 */

import { Application } from 'egg';
import Sequelize, { INTEGER, STRING, TEXT, Instance } from 'sequelize';

interface IGoodIssueAttr {
  id: number;
  goods_id: string;
  question: string;
  answer: string;
}

interface IGoodIssueInst extends Instance<IGoodIssueAttr>, IGoodIssueAttr{}

interface IGoodIssueModel extends Sequelize.Model<IGoodIssueInst, IGoodIssueAttr> {}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const goodIssue = sequelize.define(tablePrefix + 'goods_issue', {
    id: {
      type: INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    goods_id: {
      type: TEXT,
    },

    question: {
      type: STRING(255),
      defaultValue: null,
    },

    answer: {
      type: STRING(45),
      defaultValue: null,
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '5',
  }) as IGoodIssueModel;

  return goodIssue;
};