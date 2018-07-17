/*
 * @Author: qiao
 * @Date: 2018-07-16 11:15:25
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-17 16:56:24
 * 地址表
 */
import { Application } from 'egg';
import Sequelize, { MEDIUMINT, SMALLINT, STRING, TINYINT, Instance } from 'sequelize';

export interface IAddressAttr {
  id?: number;
  name: string;
  user_id: number;
  country_id?: number;
  province_id: number;
  city_id: number;
  district_id: number;
  address: string;
  mobile: string;
  is_default: number;
}

interface IFullAddress extends IAddressAttr {
  province_name: string;
  city_name: string;
  district_name: string;
  full_region: string;
}

interface IAddressInst extends Instance<IAddressAttr>, IAddressAttr {}

interface IAddressModel extends Sequelize.Model<IAddressInst, IAddressAttr> {
  getDetailAddress: (userAddress: IAddressAttr) => PromiseLike<IFullAddress>;
}

export default (app: Application) => {
  const sequelize = app.model;
  const tablePrefix = app.config.sequelize.tablePrefix;

  const address = sequelize.define(tablePrefix + 'address', {
    id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: STRING(50),
      allowNull: false,
      defaultValue: '',
    },

    user_id: {
      type: MEDIUMINT(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    country_id: {
      type: SMALLINT(5),
      allowNull: false,
      defaultValue: 0,
    },

    province_id: {
      type: SMALLINT(5),
      allowNull: false,
      defaultValue: 0,
    },

    city_id: {
      type: SMALLINT(5),
      allowNull: false,
      defaultValue: 0,
    },

    district_id: {
      type: SMALLINT(5),
      allowNull: false,
      defaultValue: 0,
    },

    address: {
      type: STRING(120),
      allowNull: false,
      defaultValue: '',
    },

    mobile: {
      type: STRING(60),
      allowNull: false,
      defaultValue: '',
    },

    is_default: {
      type: TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '被置位1的是默认地址',
    },
  }, {
    timestamps: false,
    charset: 'utf8mb4',
    initialAutoIncrement: '12',
    indexes: [
      { name: 'user_id', fields: ['user_id'] },
    ],
  }) as IAddressModel;

  address.getDetailAddress = async (userAddress: IAddressAttr) => {
    const [ provinceName, cityName, districtName ] = await Promise.all([
      sequelize.Region.getRegionName(userAddress.province_id),
      sequelize.Region.getRegionName(userAddress.city_id),
      sequelize.Region.getRegionName(userAddress.district_id),
    ]);
    userAddress['province_name'] = provinceName;
    userAddress['city_name'] = cityName;
    userAddress['district_name'] = districtName;
    userAddress['full_region'] = provinceName + cityName + districtName;
    return userAddress as IFullAddress;
  };

  return address;
};
