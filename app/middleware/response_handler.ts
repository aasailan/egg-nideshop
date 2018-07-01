import { Context } from 'egg';
import { StatusError } from '../entity/status_error';
/*
 * @Author: qiao
 * @Date: 2018-06-28 14:12:15
 * @Last Modified by: qiao
 * @Last Modified time: 2018-06-28 15:53:04
 * response处理中间件
 */

export interface IStandardResponseBody {
  // 错误码
  errno: number;
  // 错误信息
  errmsg: string;
  // 数据
  data: any;
}

/**
 * 中间件加载函数，设置完中间件后，还需要在手动挂载，在config.default.ts中，设置配置和设置加载中间件 options: BizConfig['responseHandler'] , app: Application
 *  "tsc": "ets && node -r tsconfig-paths/register node_modules/typescript/bin/tsc -p tsconfig.json ",
 * @param options: 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来。
 * @param app: 当前应用 Application 的实例
 */
export default () => {
    // return 一个中间件
  return async function responseHandler (ctx: Context, next) {
    try {
      await next();
      ctx.body = {
        errno: 0,
        errmsg: '',
        data: ctx.body,
      } as IStandardResponseBody;
    } catch (e) {
      ctx.logger.error(e.message);
      // ECMAScript规范不支持像java一样的多catch语句
      if (e instanceof StatusError) {
        ctx.body = {
          errno: e.status || StatusError.ERROR_STATUS.SERVER_ERROR,
          errmsg: e.message || '似乎出了什么问题',
          data: null,
        } as IStandardResponseBody;
      } else {
        ctx.status = 500;
      }
    }
  };
};
