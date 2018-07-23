/*
 * @Author: qiao
 * @Date: 2018-07-01 18:22:07
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-02 16:45:42
 */
import { Application } from 'egg';
import Sequelize, { DECIMAL, INTEGER, STRING, TEXT, TINYINT, Instance  } from 'sequelize';

interface ITopicAttr {
  id: number;
  title: string;
  content: string;
  avatar: string;
  item_pic_url: string;
  subtitle: string;
  topic_category_id: number;
  price_info: number;
  read_count: string;
  scene_pic_url: string;
  topic_template_id: number;
  topic_tag_id: number;
  sort_order: number;
  is_show: number;
}

interface ITopicInst extends Instance<ITopicAttr>, ITopicAttr {
}

interface ITopicModel extends Sequelize.Model<ITopicInst, ITopicAttr> {
}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const topic = sequelize.define(tablePrefix + 'topic', {
    id: {
      type: INTEGER(10).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    content: {
      type: TEXT,
    },

    avatar: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    item_pic_url: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    subtitle: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    topic_category_id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    price_info: {
      type: DECIMAL(10, 2).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    read_count: {
      type: STRING(255),
      allowNull: false,
      defaultValue: 0,
    },

    scene_pic_url: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },

    topic_template_id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    topic_tag_id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    sort_order: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 100,
    },

    is_show: {
      type: TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '316',
  }) as ITopicModel;

  return topic;
};