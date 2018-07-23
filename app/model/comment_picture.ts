/*
 * @Author: qiao
 * @Date: 2018-07-04 09:54:34
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-04 11:02:16
 * 评论图片表
 */

import { Application } from 'egg';
import Sequelize, { INTEGER, STRING, TINYINT, Instance } from 'sequelize';

interface ICommentPictureAttr {
  id: number;
  comment_id: number;
  pic_url: string;
  sort_order: number;
}

interface ICommentPictureInst extends Instance<ICommentPictureAttr>, ICommentPictureAttr {
}

interface ICommentPictureModel extends Sequelize.Model<ICommentPictureInst, ICommentPictureAttr> {
}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const commentPicture = sequelize.define(tablePrefix + 'comment_picture', {
    id: {
      type: INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    comment_id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    pic_url: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    sort_order: {
      type: TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 5,
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '1121',
  }) as ICommentPictureModel;

  return commentPicture;
};
