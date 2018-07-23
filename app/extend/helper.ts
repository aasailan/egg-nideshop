/*
 * @Author: qiao
 * @Date: 2018-07-03 16:01:27
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-04 15:57:52
 */
import { Context } from 'egg';
import { StatusError } from '../entity/status_error';

// 参数校验规则
interface IRules {
  [key: string]: {
    type: string;
    field?: string;
    max?: number;
    min?: number;
    required?: boolean;
    [key: string]: any;
  };
}

export default {
  /**
   * @description 分页辅助函数，获取总页数，查询偏移
   * @param {number} totalCount 总记录数
   * @param {number} size 每页size
   * @param {number} page 需要查询第几页
   * @returns
   */
  // paginate(totalCount: number, size: number, page: number) {
  //   return {
  //     totalPages: Math.ceil(totalCount / size),
  //     offset: (page - 1) * size,
  //   };
  // },
  /**
   * @description 计算分页偏移
   * @param {number} size
   * @param {number} page
   * @returns {number} offset 查询偏移
   */
  pageOffset(page: number, size: number) {
    return (page - 1) * size;
  },

  /**
   * @description 计算总
   * @param {number} totalCount
   * @param {number} size
   * @returns {number} totalPage 总页数
   */
  pageTotal(totalCount: number, size: number) {
    return Math.ceil(totalCount / size);
  },

  /**
   * @description 检验请求参数
   * @param {object} rules 校验规则
   * @param {object} params 被校验参数
   * @param {Context} ctx Context
   * @throws {StatusError} 如果校验不通过则throw一个error
   */
  validateParams(rules: IRules, params: any, ctx: Context) {
    try {
      ctx.validate(rules, params);
      return params;
    } catch (e) {
      this.ctx.logger.info(e.message);
      throw new StatusError(e.message, StatusError.ERROR_STATUS.REQUEST_PARAMS_ERROR);
    }
  },
};
