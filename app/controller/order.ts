/*
 * @Author: qiao
 * @Date: 2018-07-21 16:02:30
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-23 15:51:10
 * 订单控制器
 */

import { Controller } from 'egg';
// import { Op } from 'sequelize';

export default class OrderCtrl extends Controller {
  /**
   * @description 获取订单列表
   * @memberof OrderCtrl
   */
  public async list() {
    const { response, service } = this.ctx;

    const orderList = await service.order.list();

    response.body = orderList;
  }

  /**
   * @description 提交订单
   * @memberof OrderCtrl
   */
  public async submit() {
    const { request, helper, response, service } = this.ctx;
    const { addressId, couponId, postscript = '' } = helper.validateParams({
      addressId: { type: 'number' },
      couponId: { type: 'number' },
      postscript: { type: 'string', required: false },
    }, request.body, this.ctx);

    const orderInfo = await service.order.submit(addressId, couponId, postscript);

    response.body = { orderInfo };
  }

  /**
   * @description 订单详情
   * @memberof OrderCtrl
   */
  public async detail() {
    const { request, response, helper, service } = this.ctx;
    const { orderId } = helper.validateParams({
      orderId: { type: 'numberString', field: 'orderId' },
    }, request.query, this.ctx);

    const detail = await service.order.detail(orderId);

    response.body = detail;
  }
}
