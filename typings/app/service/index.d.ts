// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Test from '../../../app/service/Test';
import Wechat from '../../../app/service/wechat';

declare module 'egg' {
  interface IService {
    test: Test;
    wechat: Wechat;
  }
}
