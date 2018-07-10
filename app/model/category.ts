/*
 * @Author: qiao
 * @Date: 2018-07-01 18:43:58
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-10 12:03:21
 * 商品分类表
 */
import { Application } from 'egg';
import Sequelize, { INTEGER, STRING, TINYINT, Instance } from 'sequelize';

export interface ICategoryAttr {
  id: number;
  name: string;
  keywords: string;
  front_desc: string;
  parent_id: number;
  sort_order: number;
  show_index: number;
  is_show: number;
  banner_url: string;
  icon_url: string;
  img_url: string;
  wap_banner_url: string;
  level: string;
  type: number;
  front_name: string;
  [key: string]: any;
}

export interface ICategoryInst extends Instance<ICategoryAttr>, ICategoryAttr {
  [key: string]: any;
}

interface ICategoryModel extends Sequelize.Model<ICategoryInst, ICategoryAttr> {
}

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

    // 这个为什么是TINYINT(1),但是默认值是50
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
  }) as ICategoryModel;

  return category;
};