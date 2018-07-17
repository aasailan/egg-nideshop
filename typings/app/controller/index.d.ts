// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Address from '../../../app/controller/address';
import Auth from '../../../app/controller/auth';
import Cart from '../../../app/controller/cart';
import Catalog from '../../../app/controller/catalog';
import Comment from '../../../app/controller/comment';
import Good from '../../../app/controller/good';
import Home from '../../../app/controller/home';
import Index from '../../../app/controller/index';
import Region from '../../../app/controller/region';
import Topic from '../../../app/controller/topic';

declare module 'egg' {
  interface IController {
    address: Address;
    auth: Auth;
    cart: Cart;
    catalog: Catalog;
    comment: Comment;
    good: Good;
    home: Home;
    index: Index;
    region: Region;
    topic: Topic;
  }
}
