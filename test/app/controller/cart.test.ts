/*
 * @Author: qiao
 * @Date: 2018-07-16 15:51:10
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-17 14:36:23
 */

import * as assert from 'assert';
import mock, { BaseMockApplication } from 'egg-mock';
import { Application, Context } from 'egg';

import { IStandardResponseBody } from 'app/middleware/response_handler';

interface ICartTotal {
  goodsCount: number;
  goodsAmount: number;
  checkedGoodsCount: number;
  checkedGoodsAmount: number;
}

describe('cart ctrl test', () => {
  let app: BaseMockApplication<Application, Context>;
  let cartId;

  function checkCartTotal(cartTotal: ICartTotal) {
    assert(cartTotal.goodsCount >= 0);
    assert(cartTotal.goodsAmount >= 0);
    assert(cartTotal.checkedGoodsCount >= 0);
    assert(cartTotal.checkedGoodsAmount >= 0);
  }

  before(() => {
    app = mock.app();
    return app.ready();
  });

  it('test /api/cart/goodscount', async () => {
    const apiPrefix = app.config.apiPrefix;
    const res = await app.httpRequest().get(apiPrefix + '/cart/goodscount')
    .expect(200);
    const body: IStandardResponseBody = res.body;

    assert(body.errno === 0);
    assert(body.data.cartTotal.goodsCount >= 0);
  });

  it('test /api/cart/index', async () => {
    const apiPrefix = app.config.apiPrefix;
    const res = await app.httpRequest().get(apiPrefix + '/cart/index')
    .expect(200);
    const body: IStandardResponseBody = res.body;

    assert(body.errno === 0);
    assert(body.data.cartList.length >= 0);
    checkCartTotal(body.data.cartTotal);
  });

  it('test /api/cart/add', async () => {
    const apiPrefix = app.config.apiPrefix;
    const params = {
      goodsId: 1147048,
      number: 1,
      productId: 228,
    };
    const res = await app.httpRequest().post(apiPrefix + '/cart/add')
    .send(params)
    .set('Accept', 'application/json')
    .expect(200);
    const body: IStandardResponseBody = res.body;

    assert(body.errno === 0);
    assert(body.data.cartList.length >= 0);
    app.logger.info(body.data.cartList);
    cartId = body.data.cartList[0].id;
    checkCartTotal(body.data.cartTotal);
  });

  it('test /api/cart/update', async () => {
    const apiPrefix = app.config.apiPrefix;
    const params = {
      goodsId: 1147048,
      id: cartId,
      number: 2,
      productId: 228,
    };
    const res = await app.httpRequest().post(apiPrefix + '/cart/update')
    .send(params)
    .set('Accept', 'application/json')
    .expect(200);
    const body: IStandardResponseBody = res.body;

    const cartList: any[] = body.data.cartList;
    assert(body.errno === 0);
    assert(cartList.length >= 0);
    cartList.map(cart => {
      if (cart.id === cartId) {
        assert(cart.number === 2);
      }
    });
    checkCartTotal(body.data.cartTotal);
  });

  it('test /api/cart/checked', async () => {
    const apiPrefix = app.config.apiPrefix;
    const params = {
      isChecked: 0,
      productIds: '228',
    };
    const res = await app.httpRequest().post(apiPrefix + '/cart/checked')
    .send(params)
    .set('Accept', 'application/json')
    .expect(200);
    const body: IStandardResponseBody = res.body;

    const cartList: any[] = body.data.cartList;
    const cartTotal = body.data.cartTotal;
    assert(body.errno === 0);
    assert(cartList.length >= 0);
    checkCartTotal(cartTotal);
    assert(cartTotal.goodsCount > cartTotal.checkedGoodsCount);
    assert(cartTotal.goodsAmount > cartTotal.checkedGoodsAmount);
  });

  it('test /api/cart/delete', async () => {
    const apiPrefix = app.config.apiPrefix;
    const params = {
      productIds: '228',
    };
    const res = await app.httpRequest().post(apiPrefix + '/cart/delete')
    .send(params)
    .set('Accept', 'application/json')
    .expect(200);
    const body: IStandardResponseBody = res.body;

    const cartList: any[] = body.data.cartList;
    assert(body.errno === 0);
    // console.log(body.data);
    assert(cartList.length >= 0);
    cartList.map(cart => {
      assert(cart.product_id !== params.productIds);
    });
    checkCartTotal(body.data.cartTotal);
  });

  it('test /api/cart/checkout', async () => {
    const apiPrefix = app.config.apiPrefix;
    const params = {
      addressId: 0,
      couponId: 0,
    };
    const res = await app.httpRequest().get(apiPrefix + '/cart/checkout')
    .query(params)
    .set('Accept', 'application/json')
    .expect(200);
    const body: IStandardResponseBody = res.body;

    assert(body.errno === 0);
    assert(body.data.checkedAddress.full_region.length > 0);
    assert(body.data.freightPrice === 0);
    assert(body.data.couponList.length >= 0);
    assert(body.data.couponPrice === 0);
    assert(body.data.checkedGoodsList.length >= 0);
    assert(body.data.goodsTotalPrice >= 0);
    assert(body.data.orderTotalPrice >= 0);
    assert(body.data.actualPrice >= 0);
  });
});
