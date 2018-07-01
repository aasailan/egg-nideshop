/*
 * @Author: qiao
 * @Date: 2018-07-01 18:43:58
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-01 19:00:59
 * 商品分类表
 */
import { Application } from 'egg';
import { INTEGER, STRING, TINYINT } from 'sequelize';

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const category = sequelize.define(tablePrefix + 'category', {
    id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: STRING(90),
      allowNull: false,
      defaultValue: '',
    },

    keywords: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    front_desc: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    parent_id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    sort_order: {
      type: TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: '50',
    },

    show_index: {
      type: TINYINT(1),
      allowNull: false,
      defaultValue: 0,
    },

    is_show: {
      type: TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },

    banner_url: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    icon_url: {
      type: STRING(255),
      allowNull: false,
    },

    img_url: {
      type: STRING(255),
      allowNull: false,
    },

    wap_banner_url: {
      type: STRING(255),
      allowNull: false,
    },

    level: {
      type: STRING(255),
      allowNull: false,
    },

    type: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: 0,
    },

    front_name: {
      type: STRING(255),
      allowNull: false,
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '1036008',
    indexes: [
      {
        name: 'parent_id',
        fields: ['parent_id'],
      },
    ],
  });

  return category;
};