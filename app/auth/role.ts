/*
 * @Author: qiao
 * @Date: 2018-07-17 15:00:44
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-17 15:09:57
 * egg-userrole插件配置文件
 */
import { Application } from 'egg';
import { StatusError } from '../entity/status_error';

export default (app: Application) => {
  app.role.failureHandler = () => {
    throw new StatusError('需要先登录！', StatusError.ERROR_STATUS.PERMISSION_ERROR);
  };

  app.role.use('login', (ctx) => {
    const { jwtSession } = ctx;
    if (jwtSession && jwtSession.user_id) {
      return true;
    } else {
      return false;
    }
  });
};