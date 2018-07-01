// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Ad from '../../../app/model/ad';
import AdPosition from '../../../app/model/ad_position';
import Brand from '../../../app/model/brand';
import Category from '../../../app/model/category';
import Channel from '../../../app/model/channel';
import Good from '../../../app/model/good';
import Topic from '../../../app/model/topic';

declare module 'sequelize' {
  interface Sequelize {
    Ad: ReturnType<typeof Ad>;
    AdPosition: ReturnType<typeof AdPosition>;
    Brand: ReturnType<typeof Brand>;
    Category: ReturnType<typeof Category>;
    Channel: ReturnType<typeof Channel>;
    Good: ReturnType<typeof Good>;
    Topic: ReturnType<typeof Topic>;
  }
}
