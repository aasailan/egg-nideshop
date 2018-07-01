/*
 * @Author: qiao
 * @Date: 2018-07-01 14:20:25
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-01 19:10:22
 * 广告表
 */
import { Application } from 'egg';
import { INTEGER, SMALLINT, STRING, TEXT, TINYINT } from 'sequelize';

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const ad = sequelize.define(tablePrefix + 'ad', {
    id: {
      type: SMALLINT(5).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    ad_position_id: {
      type: SMALLINT(5).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '广告位置id',
    },

    media_type: {
      type: TINYINT(3).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    name: {
      type: STRING(60),
      allowNull: false,
      defaultValue: '',
    },

    link: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    image_url: {
      type: TEXT,
      allowNull: false,
    },

    content: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    end_time: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: 0,
    },

    enabled: {
      type: TINYINT(3).UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '4',
    indexes: [
      {
        name: 'position_id',
        fields: ['ad_position_id'],
      },
      {
        name: 'enabled',
        fields: ['enabled'],
      },
    ],
  });

  return ad;
};
