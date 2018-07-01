/*
 * @Author: qiao
 * @Date: 2018-07-01 15:13:10
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-01 19:11:01
 */
import { Application } from 'egg';
import { INTEGER, STRING } from 'sequelize';

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const channel = sequelize.define(tablePrefix + 'channel', {
    id: {
      type: INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: STRING(45),
      allowNull: false,
      defaultValue: '',
    },

    url: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    icon_url: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    sort_order: {
      type: INTEGER(4).UNSIGNED,
      allowNull: false,
      defaultValue: '10',
    },
  }, {
    timestamps: false,
    initialAutoIncrement: '6',
    charset: 'utf8mb4',
  });

  return channel;
};