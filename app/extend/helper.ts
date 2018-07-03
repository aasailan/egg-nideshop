/*
 * @Author: qiao
 * @Date: 2018-07-03 16:01:27
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-03 19:35:39
 */
import { Context, IHelper } from 'egg';
import { StatusError } from '../entity/status_error';

export default {
  /**
   * @description 分页辅助函数，获取总页数，查询偏移
   * @param {number} totalCount 总记录数
   * @param {number} size 每页size
   * @param {number} page 需要查询第几页
   * @returns
   */
  paginate(totalCount: number, size: number, page: number) {
    return {
      totalPages: Math.ceil(totalCount / size),
      offset: (page - 1) * size,
    };
  },

  validateParams(rules: object, params: object, ctx: Context) {
    try {
      ctx.validate(rules, params);
    } catch (e) {
      this.ctx.logger.info(e.message);
      throw new StatusError(e.message, StatusError.ERROR_STATUS.REQUEST_PARAMS_ERROR);
    }
  },
};
