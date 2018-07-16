/*
 * @Author: qiao
 * @Date: 2018-07-15 21:06:57
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-16 20:18:17
 * 购物车服务
 */
import { Service } from 'egg';
import { StatusError } from '../entity/status_error';
import { WhereOptions, Op } from 'sequelize';
import { IAddressAttr } from '../model/address';
import { Promise } from 'bluebird';

export default class CartServ extends Service {
  /**
   * @description 获取购物车内信息
   * @memberof CartServ
   */
  public async getCart() {
    // NOTE: 需要做会话控制：如果会话不存在，则写死userid为1
    const { model, jwtSession = { user_id: 1 } } = this.ctx;
    const cartList = await model.Cart.findAll({
      where: { user_id: jwtSession.user_id },
      raw: true,
    }) || [];

    // 购物车统计信息
    // 购车中中货物总数
    let goodsCount = 0;
    // 购物车中零售价总价
    let goodsAmount = 0.00;
    let checkedGoodsCount = 0;
    let checkedGoodsAmount = 0.00;

    for (const cartItem of cartList) {
      goodsCount += cartItem.number;
      goodsAmount += cartItem.number * cartItem.retail_price;
      if (cartItem.checked) {
        checkedGoodsCount += cartItem.number;
        checkedGoodsAmount += cartItem.number * cartItem.retail_price;
      }

      // NOTE: 已经有商品图片了，源码这里为什么还要查找商品的图片？？
      // cartItem.list_pic_url = await model.Good.find({
      //   where: { id: cartItem.goods_id },
      //   attributes: ['list_pic_url'],
      //   raw: true,
      // }).then(res => res.list_pic_url);
    }

    return {
      cartList,
      cartTotal: {
        goodsCount,
        goodsAmount,
        checkedGoodsCount,
        checkedGoodsAmount,
      },
    };
  }

  /**
   * @description 检查商品是否下架
   * @param {number} goodsId
   * @memberof CartServ
   * @throws {StatusError}
   */
  async checkGoodsOnSale(goodsId: number) {
    const goodsInfo = await this.ctx.model.Good.find({
      where: { id: goodsId },
      raw: true,
    });
    // 判断商品是否可以购买
    if (!goodsInfo || goodsInfo.is_delete === 1) {
      throw new StatusError('商品已下架', StatusError.ERROR_STATUS.DATA_ERROR);
    }
    return goodsInfo;
  }

  /**
   * @description 添加货物到购物车
   * @param {number} goodsId
   * @param {number} productId
   * @param {number} number
   * @memberof CartServ
   */
  public async add(goodsId: number, productId: number, number: number) {
    const { model, jwtSession = { user_id: 1 } } = this.ctx;
    const goodsInfo = await this.checkGoodsOnSale(goodsId);
    await model.Cart.addGoods(jwtSession.user_id, goodsId, productId, number, goodsInfo);
  }

  /**
   * @description 更新购物车货物数量
   * @param {number} goodsId
   * @param {number} productId
   * @param {number} cartId
   * @param {number} number
   * @memberof CartServ
   */
  public async update(goodsId: number, productId: number, cartId: number, number: number) {
    const { model } = this.ctx;
    await this.checkGoodsOnSale(goodsId);
    await model.Cart.updateGoods(goodsId, productId, number, cartId);
  }

  public async checkout(addressId: number) {
    const { model, jwtSession = { user_id: 1 } } = this.ctx;

    // 查询使用地址
    const whereObj = {
      user_id: jwtSession.user_id,
    } as WhereOptions<IAddressAttr>;
    addressId > 0 ? whereObj.id = addressId : whereObj.is_default = 1;
    const checkedAddress = await model.Address.find({
      where: whereObj,
      raw: true,
    });

    if (checkedAddress) {
      const [ provinceName, cityName, districtName ] = await Promise.all([
        model.Region.getRegionName(checkedAddress.province_id),
        model.Region.getRegionName(checkedAddress.city_id),
        model.Region.getRegionName(checkedAddress.district_id),
      ]);
      checkedAddress['province_name'] = provinceName;
      checkedAddress['city_name'] = cityName;
      checkedAddress['district_name'] = districtName;
      checkedAddress['full_region'] = provinceName + cityName + districtName;
    }

    // NOTE: 根据收货地址计算运费，暂时没有实现
    const freightPrice = 0.00;

    // 获取要购买的商品
    const cartData = await this.getCart();
    const checkedGoodsList = cartData.cartList.filter(v => {
      return v.checked === 1;
    });

    // 获取可用的优惠券信息，功能还未实现
    const couponList = await model.UserCoupon.findAll({
      where: { user_id: jwtSession.user_id, coupon_number: { [Op.gt]: 0 } },
      raw: true,
    });
    // 优惠券减免的金额
    const couponPrice = 0;

    // 计算订单费用
    const goodsTotalPrice = cartData.cartTotal.checkedGoodsAmount;
    const orderTotalPrice = cartData.cartTotal.checkedGoodsAmount + freightPrice - couponPrice; // 订单的总价
    const actualPrice = orderTotalPrice - 0.00; // 减去其它支付的金额后，要实际支付的金额

    return {
      checkedAddress,
      freightPrice,
      checkedCoupon: {},
      couponList,
      couponPrice,
      checkedGoodsList,
      goodsTotalPrice,
      orderTotalPrice,
      actualPrice,
    };
  }
}
