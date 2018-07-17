import { Op } from 'sequelize';
/*
 * @Author: qiao
 * @Date: 2018-07-15 20:59:23
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-17 15:30:00
 */
import { Controller } from 'egg';

// NOTE: 这个控制器的所有方法需要做登录控制，没有登录的时候，userid 全部用 1暂时代替
export default class CartCtrl extends Controller {
  // 获取购物车商品的总件件数
  public async goodscount() {
    const { service, response } = this.ctx;
    const cartData = await service.cart.getCart();
    response.body = {
      cartTotal: {
        goodsCount: cartData.cartTotal.goodsCount,
      },
    };
  }

  /**
   * @description 获取购物车信息，所有对购物车的增删查改操作，都要重新返回购物车信息
   * @memberof CartCtrl
   */
  public async index() {
    const { service, response } = this.ctx;
    response.body = await service.cart.getCart();
  }

  /**
   * @description 添加商品到购物车
   * @memberof CartCtrl
   */
  public async add() {
    const { request, helper, service, response } = this.ctx;
    const { goodsId, productId, number } = helper.validateParams({
      goodsId: { type: 'number' },
      productId: { type: 'number' },
      number: { type: 'number' },
    }, request.body, this.ctx);

    service.cart.add(goodsId, productId, number);
    response.body = await service.cart.getCart();
  }

  /**
   * @description 更新购物车商品数量
   * @memberof CartCtrl
   */
  public async update() {
    const { request, helper, service, response } = this.ctx;
    const { goodsId, productId, id: cartId, number } = helper.validateParams({
      goodsId: { type: 'number' },
      productId: { type: 'number' },
      id: { type: 'number' },
      number: { type: 'number' },
    }, request.body, this.ctx);

    await service.cart.update(goodsId, productId, cartId, number);
    response.body = await service.cart.getCart();
  }

  /**
   * @description 批量删除购物车的货物
   * @memberof CartCtrl
   */
  public async delete() {
    const { request, helper, model, response, service } = this.ctx;
    const { productIds } = helper.validateParams({
      productIds: { type: 'string' },
    }, request.body, this.ctx);

    // 上传的货物id由，分割
    const productIdArr = productIds.split(',');

    await model.Cart.destroy({
      where: { product_id: { [Op.in]: productIdArr } },
    });

    response.body = await service.cart.getCart();
  }

  /**
   * @description 最后检查，订单提交前校验与填写相关订单信息
   * @memberof CartCtrl
   */
  public async checkout() {
    const { request, helper, response, service } = this.ctx;
    const { addressId } = helper.validateParams({
      addressId: { type: 'numberString', field: 'addressId' },
      // 优惠券id，优惠券逻辑貌似暂时没有实现
      // couponId: { type: 'numberString', field: 'couponId' },
    }, request.query, this.ctx);

    response.body = await service.cart.checkout(addressId);
  }

  /**
   * @description 是否选择商品，如果已经选择，则取消选择，批量操作
   * @memberof CartCtrl
   */
  public async checked() {
    const { request, helper, model, service, response, jwtSession } = this.ctx;
    const { productIds, isChecked } = helper.validateParams({
      // productIds: { type: 'string' },
      isChecked: { type: 'number' },
    }, request.body, this.ctx);

    const productArr = (productIds + '').split(',');

    await model.Cart.update({
      checked: isChecked,
    }, {
      where: { product_id: { [Op.in]: productArr }, user_id: jwtSession.user_id },
    });

    response.body = await service.cart.getCart();
  }
}