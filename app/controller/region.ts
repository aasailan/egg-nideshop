/*
 * @Author: qiao
 * @Date: 2018-07-17 19:11:16
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-17 19:53:35
 * 区域查询控制器
 */

import { Controller } from 'egg';

export default class RegionCtrl extends Controller {
  /**
   * @description 查询父区域id下的子区域列表
   * @memberof RegionCtrl
   */
  public async listChildRegion() {
    const { request, helper, model, response } = this.ctx;
    const { parentId } = helper.validateParams({
      parentId: { type: 'numberString', field: 'parentId' },
    }, request.query, this.ctx);

    response.body = await model.Region.findAll({
      where: { parent_id: parentId },
      raw: true,
    });
  }
}
