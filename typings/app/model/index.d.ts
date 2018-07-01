// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Brand from '../../../app/model/brand';
import Good from '../../../app/model/good';

declare module 'sequelize' {
  interface Sequelize {
    Brand: ReturnType<typeof Brand>;
    Good: ReturnType<typeof Good>;
  }
}
