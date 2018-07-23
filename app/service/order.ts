/*
 * @Author: qiao
 * @Date: 2018-07-21 16:27:03
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-23 17:55:27
 * 订单服务
 */

import { Service } from 'egg';
import * as moment from 'moment';

import { StatusError } from '../entity/status_error';
import { IOrderAttr } from '../model/order';
import { IPage } from '../entity/page';

export default class OrderServ extends Service {

  /**
   * @description 查看用户订单列表
   * @returns
   * @memberof OrderServ
   */
  public async list() {
    const { model, jwtSession, helper } = this.ctx;
    const { count, rows: orders } = await model.Order.findAndCountAll({
      where: { user_id: jwtSession.user_id },
      raw: true,
    });

    const newOrders = await Promise.all(orders.map(async order => {
      const goodsList = await model.OrderGood.findAll({
        where: { order_id: order.id },
        raw: true,
      });
      order['goodsList'] = goodsList;

      let goodsCount = 0;
      goodsList.forEach(good => goodsCount += good.number);
      order['goodsCount'] = goodsCount;

      // 订单状态处理
      order['order_status_text'] = await model.Order.getOrderStatusText(order.id);

      // 可操作的选项
      order['handleOption'] = await model.Order.getOrderHandleOption(order.id);
      return order;
    }));

    return {
      count,
      totalPages: helper.pageTotal(count, 10),
      pageSize: 10,
      currentPage: 1,
      data: newOrders,
    } as IPage;
  }

  /**
   * @description 提交订单
   * @param {number} addressId
   * @param {number} couponId
   * @param {string} postscript
   * @returns
   * @memberof OrderServ
   */
  public async submit(addressId: number, couponId: number, postscript: string) {
    const { model, jwtSession } = this.ctx;

    // 获取收货地址信息和计算运费
    const addressInfo = await model.Address.find({
      where: { id: addressId },
      raw: true,
    });
    if (!addressInfo) {
      throw new StatusError('请选择收货地址', StatusError.ERROR_STATUS.DATA_ERROR);
    }
    // NOTE: 运费固定为0，运费逻辑未实现
    const freightPrice = 0.00;

    // 获取购物车中需要付款的商品
    const checkedGoodsList = await model.Cart.findAll({
      where: { user_id: jwtSession.user_id, session_id: 1, checked: 1 },
      raw: true,
    });
    if (!checkedGoodsList || checkedGoodsList.length === 0) {
      throw new StatusError('请选择商品进行结算', StatusError.ERROR_STATUS.DATA_ERROR);
    }

    // 统计商品总价
    let goodsTotalPrice = 0.00;
    checkedGoodsList.forEach(good => {
      goodsTotalPrice += good.number * good.retail_price;
    });

    // 获取订单使用的优惠券，优惠金额暂时固定为0
    const couponPrice = 0.00;
    if (couponId) {
      // 在这个地方查询优惠券以及优惠金额
    }

    // 计算订单价格
    const orderTotalPrice = goodsTotalPrice + freightPrice - couponPrice;
    const actualPrice = orderTotalPrice - 0.00; // 减去其它支付的金额后，要实际支付的金额

    const orderInfo = {
      order_sn: model.Order.generateOrderNumber(),
      user_id: jwtSession.user_id,

      // 收货地址和运费
      consignee: addressInfo.name,
      mobile: addressInfo.mobile,
      province: addressInfo.province_id,
      city: addressInfo.city_id,
      district: addressInfo.district_id,
      address: addressInfo.address,
      freight_price: 0,

      // 留言
      postscript,

      // 使用的优惠券
      coupon_id: 0,
      coupon_price: couponPrice,

      add_time: Math.floor(Date.now() / 1000),
      goods_price: goodsTotalPrice,
      order_price: orderTotalPrice,
      actual_price: actualPrice,
    } as IOrderAttr;

    // 开启事务，生成订单。
    const newOrderInfo = await model.Order.addOrder(orderInfo, checkedGoodsList);

    return newOrderInfo;
  }

  /**
   * @description 订单详情
   * @param {number} orderId
   * @returns
   * @memberof OrderServ
   */
  public async detail(orderId: number) {
    const { model, jwtSession } = this.ctx;
    const orderInfo = await model.Order.find({
      where: { user_id: jwtSession.user_id, id: orderId },
      raw: true,
    });

    if (!orderInfo) {
      throw new StatusError('没有该笔订单', StatusError.ERROR_STATUS.DATA_ERROR);
    }

    // 处理订单收货地址
    const [ provinceName, cityName, districtName ] = await Promise.all([
      model.Region.getRegionName(orderInfo.province),
      model.Region.getRegionName(orderInfo.city),
      model.Region.getRegionName(orderInfo.district),
    ]);
    orderInfo['province_name'] = provinceName;
    orderInfo['city_name'] = cityName;
    orderInfo['district_name'] = districtName;
    orderInfo['full_region'] = provinceName + cityName + districtName;

    // 物流信息 NOTE: 现在没有做
    orderInfo['express'] = {};

    // 订单内货物
    const orderGoods = await model.OrderGood.findAll({
      where: { order_id: orderId },
      raw: true,
    });

    // 订单状态处理
    orderInfo['order_status_text'] = await model.Order.getOrderStatusText(orderId);
    orderInfo['add_time'] = <any> moment(orderInfo.add_time * 1000).format('YYYY-MM-DD HH:mm:ss');
    // orderInfo['final_pay_time'] = moment('001234', 'Hmmss').format('mm:ss');

    // 订单最后支付时间 NOTE: 逻辑未完善
    if (orderInfo.order_status === 0) {
      orderInfo['final_pay_time'] = moment('001234', 'Hmmss').format('mm:ss');
    }

    const handleOption = await model.Order.getOrderHandleOption(orderId);

    return {
      orderInfo,
      orderGoods,
      handleOption,
    };
  }
}
