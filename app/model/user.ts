/*
 * @Author: qiao
 * @Date: 2018-07-09 15:30:02
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-15 19:10:58
 * 用户表
 */
import { Application } from 'egg';
import Sequelize, { MEDIUMINT, STRING, TINYINT, Instance, INTEGER } from 'sequelize';

interface IUserAttr {
  id?: number;
  username: string;
  password: string;
  gender: number;
  birthday?: number;
  register_time: number;
  last_login_time: number;
  last_login_ip: string;
  user_level_id?: number;
  nickname: string;
  mobile: string;
  register_ip: string;
  avatar: string;
  weixin_openid: string;
}

interface IUserInst extends Instance<IUserAttr>, IUserAttr {
}

interface IUserModel extends Sequelize.Model<IUserInst, IUserAttr> {}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const user = sequelize.define(tablePrefix + 'user', {
    id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    username: {
      type: STRING(60),
      allowNull: false,
      defaultValue: '',
      unique: true,
    },

    password: {
      type: STRING(32),
      allowNull: false,
      defaultValue: '',
    },

    gender: {
      type: TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    birthday: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    register_time: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    last_login_time: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    last_login_ip: {
      type: STRING(15),
      allowNull: false,
      defaultValue: '',
    },

    user_level_id: {
      type: TINYINT(3).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    nickname: {
      type: STRING(60),
      allowNull: false,
    },

    mobile: {
      type: STRING(20),
      allowNull: false,
    },

    register_ip: {
      type: STRING(45),
      allowNull: false,
      defaultValue: '',
    },

    avatar: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    weixin_openid: {
      type: STRING(50),
      allowNull: false,
      defaultValue: '',
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '14',
  }) as IUserModel;

  return user;
};
