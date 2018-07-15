/*
 * @Author: qiao
 * @Date: 2018-07-11 16:03:07
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 16:23:08
 * 货物banner图
 */

import { Application } from 'egg';
import Sequelize, { INTEGER, STRING, Instance } from 'sequelize';

interface IGoodGalleryAttr {
  id: number;
  goods_id: number;
  img_url: string;
  img_desc: string;
  sort_order: number;
}

interface IGoodGalleryInst extends Instance<IGoodGalleryAttr>, IGoodGalleryAttr{
}

interface IGoodGalleryModel extends Sequelize.Model<IGoodGalleryInst, IGoodGalleryAttr> {}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const goodGallery = sequelize.define(tablePrefix + 'goods_gallery', {
    id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    goods_id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    img_url: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    img_desc: {
      type: STRING(255),
      allowNull: false,
      defaultValue: 5,
    },

    sort_order: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 5,
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '681',
    indexes: [
      { name: 'goods_id', fields: ['goods_id'] },
    ],
  }) as IGoodGalleryModel;

  return goodGallery;
};
