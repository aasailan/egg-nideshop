import { Controller } from 'egg';
import { StatusError } from '../entity/status_error';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.test.sayHi('egg');
  }

  // 参数校验与response中间件校验
  public async test() {
    const rules = {
      age: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
    };
    this.ctx.logger.debug(this.ctx.request.query);
    try {
      // get请求的参数验证 ctx.request.query query的参数类型全都是string，否则无法验证通过
      // post请求的参数验证 ctx.request.body
      this.ctx.validate(rules, this.ctx.request.query);
      this.ctx.response.body = 'success';
    } catch (e) {
      throw new StatusError(e.message, StatusError.ERROR_STATUS.REQUEST_PARAMS_ERROR);
    }
  }
}
