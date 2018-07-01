/*
 * @Author: qiao
 * @Date: 2018-07-01 11:15:47
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-01 14:43:23
 * app启动文件，用于自定义启动时的初始化工作,只返回一个函数
 */
import { Application } from 'egg';

 export default (app: Application) => {
   app.beforeStart(async () => {

    app.logger.info('app beforeStart');

    if (app.env === 'local') {
      app.logger.info('sync db ...');
      await app.model.sync({ force: true });
      app.logger.info('sync db completed ...');
    }
   });
 };