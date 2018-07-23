/*
 * @Author: qiao
 * @Date: 2018-07-15 21:11:27
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-23 15:39:59
 * 购物车表
 */
import { Application } from 'egg';
import Sequelize, { Op, MEDIUMINT, SMALLINT, DECIMAL, STRING, TEXT, TINYINT, Instance } from 'sequelize';
import { StatusError } from '../entity/status_error';
import { IGoodInst } from './good';

interface ICartAttr {
  id?: number;
  user_id: number;
  session_id: string;
  goods_id: number;
  goods_sn: string;
  product_id: number;
  goods_name: string;
  market_price: number;
  retail_price: number;
  number: number;
  goods_specifition_name_value: string;
  goods_specifition_ids: string;
  checked: number;
  list_pic_url: string;
}

export interface ICartInst extends Instance<ICartAttr>, ICartAttr{
}

// NOTE: 向购物车添加更新货物的逻辑写在购物车model中，而不是用户中
interface ICartModel extends Sequelize.Model<ICartInst, ICartAttr>{
  addGoods: (userId: number, goodsId: number, productId: number, number: number,
    goodsInfo: IGoodInst) => PromiseLike<any>;
  updateGoods: (goodsId: number, productId: number, number: number,
    cartId: number) => PromiseLike<any>;
}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const cart = sequelize.define(tablePrefix + 'cart', {
    id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    // NOTE: 目前没有用，所有插入的值都被设置为1
    session_id: {
      type: STRING(32),
      allowNull: false,
      defaultValue: '',
      comment: '记录添加到购物车的sessionid。',
    },

    goods_id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    goods_sn: {
      type: STRING(60),
      allowNull: false,
      defaultValue: '',
    },

    product_id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    goods_name: {
      type: STRING(120),
      allowNull: false,
      defaultValue: '',
    },

    market_price: {
      type: DECIMAL(10, 2).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    retail_price: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    number: {
      type: SMALLINT(5).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    goods_specifition_name_value: {
      type: TEXT,
      allowNull: false,
      comment: '规格属性组成的字符串，用来显示用',
    },

    goods_specifition_ids: {
      type: STRING(60),
      allowNull: false,
      defaultValue: '',
      comment: 'product表对应的goods_specifition_ids',
    },

    checked: {
      type: TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      comment: '1代表在购物车中被选中需要结算，0代表没有被选中',
    },

    list_pic_url: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '',
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '97',
    collate: 'utf8mb4_bin',
  }) as ICartModel;

  /**
   * @description 向购物车里面添加货物
   * @param {number} userId 用户id
   * @param {number} goodsId 货物id
   * @param {number} productId 产品id
   * @param {number} number 要向购物车增加的货物数量
   */
  cart.addGoods = async (userId: number, goodsId: number, productId: number, number: number,
    goodsInfo: IGoodInst) => {
    // 查询货物规格信息，判断是否有足够的存货
    const productInfo = await app.model.Product.find({
      where: { goods_id: goodsId, id: productId },
      raw: true,
    });
    if (!productInfo || productInfo.goods_number < number) {
      throw new StatusError('库存不足', StatusError.ERROR_STATUS.DATA_ERROR);
    }
    // 判断是否已经在购物车上
    const cartInfo = await app.model.Cart.find({
      where: { goods_id: goodsId, product_id: productId },
      raw: true,
    });
    if (cartInfo) {
      // 商品已经存在购物车上，直接更新购物车
      await app.model.Cart.update({
        number: cartInfo.number + number,
      }, {
        where: { goods_id: goodsId, product_id: productId, id: cartInfo.id },
      });
    } else {
      // 商品不在购物车上，查询添加规格名和值
      const goodsSepcifitionValue = await app.model.GoodSpecification.findAll({
        where: { goods_id: goodsId, id: { [Op.in]: productInfo.goods_specification_ids.split('_') } },
        attributes: ['value'],
        raw: true,
      }).then(res => res.map(inst => inst.value));
      // 添加到购物车
      const cartData: ICartAttr = {
        goods_id: goodsId,
        product_id: productId,
        goods_sn: productInfo.goods_sn,
        goods_name: goodsInfo.name,
        list_pic_url: goodsInfo.list_pic_url,
        number,
        // NOTE: 这里的session_id 写死了等于1，以后要改进
        session_id: '1',
        user_id: userId,
        retail_price: productInfo.retail_price,
        market_price: productInfo.retail_price,
        goods_specifition_name_value: goodsSepcifitionValue.join(';'),
        goods_specifition_ids: productInfo.goods_specification_ids,
        checked: 1,
      };
      await app.model.Cart.insertOrUpdate(cartData, {

        returning: false,
      });
    }
  };

  cart.updateGoods = async (goodsId: number, productId: number, number: number,
    cartId: number) => {
    // 查询货物规格信息，判断是否有足够的存货
    const productInfo = await app.model.Product.find({
      where: { goods_id: goodsId, id: productId },
      raw: true,
    });
    if (!productInfo || productInfo.goods_number < number) {
      throw new StatusError('库存不足', StatusError.ERROR_STATUS.DATA_ERROR);
    }
    // NOTE: 原工程的逻辑比这里复杂，但是不明白什么意思
    // 查找到购物车商品更新数量
    await app.model.Cart.update({
      number,
    }, {
      where: { id: cartId },
    });
  };

  return cart;
};