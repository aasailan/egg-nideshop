/*
 * @Author: qiao
 * @Date: 2018-07-01 11:15:47
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-15 14:55:35
 * app启动文件，用于自定义启动时的初始化工作,只返回一个函数
 */
import { Application } from 'egg';

export default (app: Application) => {
  const { logger } = app;
  // 添加自定义校验规则
  const validator = app.validator;
  validator.addRule('numberString', (rule, value: string, params) => {
    // 不用校验required，只需要做类型转换和max与min的校验，如果require为false，并且
    // 参数中没有value，则不会调用此函数
    logger.info(rule);
    logger.info(value);
    logger.info(params);

    const field = rule.field;
    if (!field) {
      throw new Error('validate error: the field is not set! the params is: ' + JSON.stringify(params));
    }
    // 正则校验
    const re = /^[-\d][\d]*$/;
    if (!re.test(value)) {
      throw new Error(`validate error: the value (${value}) is not a number! the params is: ` + JSON.stringify(params));
    }

    const num = parseInt(value, 10);
    if (rule.max !== undefined && num > rule.max) {
      throw new Error(`validate error: the value (${value}) is bigger then ${rule.max}! the params is: ` +
      JSON.stringify(params));
    }

    if (rule.min !== undefined && num < rule.min) {
      throw new Error(`validate error: the value (${value}) is smaller then ${rule.min}! the params is: ` +
      JSON.stringify(params));
    }
    params[field] = num;
  });

  app.beforeStart(async () => {

    app.logger.info('app beforeStart');

    if (app.env === 'local') {
      app.logger.info('sync db ...');
      await app.model.sync();
      app.logger.info('sync db completed ...');
    }
  });

 };
