/*
 * @Author: qiao
 * @Date: 2018-07-21 16:46:02
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-23 17:46:41
 * 订单表
 */
import { Application } from 'egg';
import Sequelize, { MEDIUMINT, INTEGER, DECIMAL, SMALLINT, STRING, BOOLEAN, TINYINT, Instance } from 'sequelize';
import * as moment from 'moment';
import { ICartInst } from './cart';
import { StatusError } from '../entity/status_error';
import { IOrderGoodsAttr } from './order_good';

 export interface IOrderAttr {
  id: number;
  order_sn: string;
  user_id: number;
  order_status: number;
  shipping_status: number;
  pay_status: number;
  consignee: string;
  country: number;
  province: number;
  city: number;
  district: number;
  address: string;
  mobile: string;
  postscript: string;
  shipping_fee: number;
  pay_name: string;
  pay_id: number;
  actual_price: number;
  integral: number;
  integral_money: number;
  order_price: number;
  goods_price: number;
  add_time: number;
  confirm_time: number;
  pay_time: number;
  freight_price: number;
  coupon_id: number;
  parent_id: number;
  coupon_price: number;
  callback_status: boolean;
}

interface IOrderInst extends Instance<IOrderAttr>, IOrderAttr {}

interface IOrderModel extends Sequelize.Model<IOrderInst, IOrderAttr> {
  generateOrderNumber: () => string;
  addOrder: (orderInfo: IOrderAttr, checkedGoodsList: ICartInst[]) => PromiseLike<IOrderInst>;
  getOrderStatusText: (orderId: number) => PromiseLike<string>;
  getOrderHandleOption: (orderId: number) => PromiseLike<IhandleOption>;
}

interface IhandleOption {
  cancel: boolean; // 取消操作
  delete: boolean; // 删除操作
  pay: boolean; // 支付操作
  comment: boolean; // 评论操作
  delivery: boolean; // 确认收货操作
  confirm: boolean; // 完成订单操作
  return: boolean; // 退换货操作
  buy: boolean; // 再次购买
};

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const order = sequelize.define(tablePrefix + 'order', {
    id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    order_sn: {
      type: STRING(20),
      allowNull: false,
      defaultValue: '',
      unique: true,
    },

    user_id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    order_status: {
      type: TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '订单状态，0为未支付',
    },

    shipping_status: {
      type: TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    pay_status: {
      type: TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '支付状态',
    },

    consignee: {
      type: STRING(60),
      allowNull: false,
      defaultValue: '',
      comment: '收货地址',
    },

    country: {
      type: SMALLINT(5).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    province: {
      type: SMALLINT(5).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '收货省份id',
    },

    city: {
      type: SMALLINT(5).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '收货城市',
    },

    district: {
      type: SMALLINT(5).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '',
    },

    address: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
      comment: '收货详细地址',
    },

    mobile: {
      type: STRING(60),
      allowNull: false,
      defaultValue: '',
      comment: '收货手机',
    },

    postscript: {
      type: STRING(255),
      allowNull: false,
      defaultValue: 0,
      comment: '订单留言',
    },

    shipping_fee: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    pay_name: {
      type: STRING(120),
      allowNull: false,
      defaultValue: '',
    },

    pay_id: {
      type: TINYINT(3),
      allowNull: false,
      defaultValue: 0,
    },

    actual_price: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '实际需要支付的金额',
    },

    integral: {
      type: INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    integral_money: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    order_price: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '订单总价',
    },

    goods_price: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '商品总价',
    },

    add_time: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    confirm_time: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    pay_time: {
      type: INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    freight_price: {
      type: INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '配送费用',
    },

    coupon_id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '使用的优惠券id',
    },

    parent_id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    coupon_price: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '优惠价格',
    },

    callback_status: {
      type: BOOLEAN,
      defaultValue: true,
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '15',
    indexes: [
      { name: 'user_id', fields: ['user_id'] },
      { name: 'order_status', fields: ['order_status'] },
      { name: 'shipping_status', fields: ['shipping_status'] },
      { name: 'pay_status', fields: ['pay_status'] },
      { name: 'pay_id', fields: ['pay_id'] },
    ],
  }) as IOrderModel;

  /**
   * @description 产生订单号
   */
  order.generateOrderNumber = () => {
    // const date = new Date();
    const a = moment().format('YYYYMMDDhhmmss');
    return a + Math.ceil(Math.random() * 10000000);
  };

  /**
   * @description 下订单
   * @param {IOrderAttr} orderInfo 订单信息
   * @param {ICartInst[]} checkedGoodsList 需要加入订单的货物列表
   * @returns {IOrderAttr} newOrderInfo 新订单信息
   */
  order.addOrder = (orderInfo: IOrderAttr, checkedGoodsList: ICartInst[]) => sequelize.transaction(async t => {
    // 在此处开启自动托管事务 NOTE: 其实这些地方有必要开启事务吗，其实没有必要开启事务，
    // 只有提交订单，真正减去货物的时候才要开启事务

    // 先检查有没有足够的存货，一次性全查出来，然后在内存里面匹配
    const products = await Promise.all(checkedGoodsList.map(async checkedGood => {
      const product = await app.model.Product.find({
        where: { goods_id: checkedGood.goods_id, id: checkedGood.product_id },
        raw: true,
        transaction: t,
      });
      if (!product || product.goods_number < checkedGood.number) {
        throw new StatusError(checkedGood.goods_name + '库存不足', StatusError.ERROR_STATUS.DATA_ERROR);
      }
      return product;
    }));

    // 插入订单信息
    const newOrderInfo = await app.model.Order.create(orderInfo, { raw: true, transaction: t });

    // 插入订单商品表
    const orderGoodsData: IOrderGoodsAttr[] = [];
    checkedGoodsList.forEach(checkedGood => {
      const item: IOrderGoodsAttr = {
        order_id: newOrderInfo.id,
        goods_id: checkedGood.goods_id,
        goods_sn: checkedGood.goods_sn,
        product_id: checkedGood.product_id,
        goods_name: checkedGood.goods_name,
        list_pic_url: checkedGood.list_pic_url,
        market_price: checkedGood.market_price,
        retail_price: checkedGood.retail_price,
        number: checkedGood.number,
        goods_specifition_name_value: checkedGood.goods_specifition_name_value,
        goods_specifition_ids: checkedGood.goods_specifition_ids,
      };
      orderGoodsData.push(item);
    });
    const addOrderGood = app.model.OrderGood.bulkCreate(orderGoodsData, { transaction: t });

    // 清除购物车
    const clearCart = app.model.Cart.destroy({
      where: { user_id: newOrderInfo.user_id, checked: 1 },
      transaction: t,
    });

    // 减少相应库存
    const updateProducts = products.map(product => {
      let good;
      for (const checkedGood of checkedGoodsList) {
        if (product.id === checkedGood.product_id) {
          good = checkedGood;
          break;
        }
      }

      return app.model.Product.update({
        goods_number: product.goods_number - good.number,
      }, {
        transaction: t,
        where: { goods_id: good.goods_id, id: good.product_id },
      });
    }) as any[];

    await Promise.all([
      addOrderGood,
      clearCart,
      ...updateProducts,
    ]);

    return newOrderInfo;
  });

  /**
   * @description 获取订单状态 NOTE: 现在还只有未支付状态，没有其他状态
   * @param {number} orderId 订单id
   * @returns {string} statusText 订单状态
   */
  order.getOrderStatusText = async (orderId: number) => {
    const orderInfo = await app.model.Order.find({
      where: { id: orderId },
      raw: true,
    });

    let statusText = '未付款';
    switch (orderInfo.order_status) {
      case 0:
        statusText = '未付款';
        break;
      default:
        statusText = '未付款';
    }
    return statusText;
  };

  /**
   * @description 获取订单可操作选项
   * @param {number} orderId 订单id
   * @returns {IhandleOption} 可操作选项
   */
  order.getOrderHandleOption = async (orderId: number) => {
    const handleOption = {
      cancel: false, // 取消操作
      delete: false, // 删除操作
      pay: false, // 支付操作
      comment: false, // 评论操作
      delivery: false, // 确认收货操作
      confirm: false, // 完成订单操作
      return: false, // 退换货操作
      buy: false, // 再次购买
    } as IhandleOption;

    const orderInfo = await app.model.Order.find({
      where: { id: orderId },
      raw: true,
    });

    // 订单流程：下单成功－》支付订单－》发货－》收货－》评论
    // 订单相关状态字段设计，采用单个字段表示全部的订单状态
    // 1xx表示订单取消和删除等状态 0订单创建成功等待付款，101订单已取消，102订单已删除
    // 2xx表示订单支付状态,201订单已付款，等待发货
    // 3xx表示订单物流相关状态,300订单已发货，301用户确认收货
    // 4xx表示订单退换货相关的状态,401没有发货，退款402,已收货，退款退货
    // 如果订单已经取消或是已完成，则可删除和再次购买

    if (orderInfo.order_status === 101) {
      handleOption.delete = true;
      handleOption.buy = true;
    }

    // 如果订单没有被取消，且没有支付，则可支付，可取消
    if (orderInfo.order_status === 0) {
      handleOption.cancel = true;
      handleOption.pay = true;
    }

    // 如果订单已付款，没有发货，则可退款操作
    if (orderInfo.order_status === 201) {
      handleOption.return = true;
    }

    // 如果订单已经发货，没有收货，则可收货操作和退款、退货操作
    if (orderInfo.order_status === 300) {
      handleOption.cancel = true;
      handleOption.pay = true;
      handleOption.return = true;
    }

    // 如果订单已经支付，且已经收货，则可完成交易、评论和再次购买
    if (orderInfo.order_status === 301) {
      handleOption.delete = true;
      handleOption.comment = true;
      handleOption.buy = true;
    }

    return handleOption;
  };

  return order;
};
