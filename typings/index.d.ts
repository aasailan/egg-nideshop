/*
 * @Author: qiao 
 * @Date: 2018-07-01 11:28:01 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-01 12:48:04
 * 自定义type
 */
import { Sequelize } from 'sequelize';
// import Good from '../app/model/good';

// interface IModel {
//   Good: ReturnType<typeof Good>;
// }

declare module 'egg' {
  interface Application {
    model: Sequelize
  }

  interface Context {
    // model: IModel;
    model: Sequelize
  }
}