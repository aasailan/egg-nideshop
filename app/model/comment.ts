/*
 * @Author: qiao
 * @Date: 2018-07-03 20:11:34
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-21 10:56:21
 * 评论表
 */
import { Application } from 'egg';
import Sequelize, { INTEGER, TINYINT, TEXT, Instance } from 'sequelize';

interface ICommentAttr {
  id?: number;
  type_id: number;
  value_id: number;
  content: string;
  add_time: number;
  status?: number;
  user_id: number;
  new_content?: string;
}

interface ICommentInst extends Instance<ICommentAttr>, ICommentAttr {
}

interface ICommentModel extends Sequelize.Model<ICommentInst, ICommentAttr> {
}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const comment = sequelize.define(tablePrefix + 'comment', {
    id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    type_id: {
      type: TINYINT(3).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    value_id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '评论所属的topic id',
    },

    // TODO: 源码中有COLLATE utf8mb4_unicode_ci 在这里没有实现
    content: {
      type: TEXT,
      allowNull: false,
      comment: '存储为base64编码',
    },

    add_time: {
      type: INTEGER(12).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    status: {
      type: TINYINT(3).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '该字段暂时无用',
    },

    user_id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    new_content: {
      type: TEXT,
      allowNull: false,
      defaultValue: '',
      comment: '该字段暂时无用',
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    // TODO: 没搞懂这个是什么意思
    collate: 'utf8mb4_unicode_ci',
    initialAutoIncrement: '1006',
    indexes: [
      { name: 'id_value', fields: ['value_id'] },
    ],
  }) as ICommentModel;

  return comment;
};
