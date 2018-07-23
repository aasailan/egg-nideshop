// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Cart from '../../../app/service/cart';
import Order from '../../../app/service/order';
import Test from '../../../app/service/Test';
import Wechat from '../../../app/service/wechat';

declare module 'egg' {
  interface IService {
    cart: Cart;
    order: Order;
    test: Test;
    wechat: Wechat;
  }
}
