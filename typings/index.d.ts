/*
 * @Author: qiao 
 * @Date: 2018-07-01 11:28:01 
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-15 15:42:30
 * 自定义type
 */
import { Sequelize } from 'sequelize';
import { Context } from 'egg';

export interface IJwtSession {
  session_key: string;
  openid: string;
  user_id: number;
  iat: number;
}

declare module 'egg' {
  interface Application {
    model: Sequelize;
    validator: any;
  }

  interface Context {
    // model: IModel;
    model: Sequelize;
    validate: (rules: Object, body: Object) => Promise<any>;
    jwtSession: IJwtSession;
  }
}