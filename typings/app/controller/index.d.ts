// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Address from '../../../app/controller/address';
import Auth from '../../../app/controller/auth';
import Brand from '../../../app/controller/brand';
import Cart from '../../../app/controller/cart';
import Catalog from '../../../app/controller/catalog';
import Collect from '../../../app/controller/collect';
import Comment from '../../../app/controller/comment';
import Good from '../../../app/controller/good';
import Home from '../../../app/controller/home';
import Index from '../../../app/controller/index';
import Order from '../../../app/controller/order';
import Region from '../../../app/controller/region';
import Search from '../../../app/controller/search';
import Topic from '../../../app/controller/topic';

declare module 'egg' {
  interface IController {
    address: Address;
    auth: Auth;
    brand: Brand;
    cart: Cart;
    catalog: Catalog;
    collect: Collect;
    comment: Comment;
    good: Good;
    home: Home;
    index: Index;
    order: Order;
    region: Region;
    search: Search;
    topic: Topic;
  }
}
