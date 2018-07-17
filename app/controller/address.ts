/*
 * @Author: qiao
 * @Date: 2018-07-17 15:57:41
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-17 20:05:01
 * 用户地址管理
 */

import { Controller } from 'egg';
import { Op } from 'sequelize';

export default class AddressCtrl extends Controller {
  /**
   * @description 获取用户收货地址列表
   * @memberof AddressCtrl
   */
  public async list() {
    const { model, jwtSession, response } = this.ctx;

    const addressList = await model.Address.findAll({
      where: { user_id: jwtSession.user_id },
      raw: true,
    }).then(addresses => {
      if (addresses.length > 0) {
        return Promise.all(addresses.map(address => model.Address.getDetailAddress(address)));
      } else {
        return [];
      }
    });

    response.body = addressList;
  }

  /**
   * @description 查询用户地址详细信息
   * @memberof AddressCtrl
   */
  public async detail() {
    const { request, helper, model, jwtSession, response } = this.ctx;
    const { id: addressId } = helper.validateParams({
      id: { type: 'numberString', field: 'id' },
    }, request.query, this.ctx);

    const addressInfo = await model.Address.find({
      where: { user_id: jwtSession.user_id, id: addressId },
    }).then(address => address && model.Address.getDetailAddress(address));

    response.body = addressInfo || {};
  }

  /**
   * @description 删除用户地址
   * @memberof AddressCtrl
   */
  public async deleteAddress() {
    const { request, helper, model, response, jwtSession } = this.ctx;
    const { id: addressId } = helper.validateParams({
      id: { type: 'number' },
    }, request.body, this.ctx);

    await model.Address.destroy({
      where: { user_id: jwtSession.user_id, id: addressId },
    });

    response.body = '删除成功';
  }

  public async save() {
    const { request, helper, model, jwtSession, response } = this.ctx;
    const { id = null, address, city_id: cityId, district_id: districtId,
      is_default, mobile, name, province_id: provinceId } = helper.validateParams({
      id: { type: 'number', required: false },
      address: { type: 'string' },
      city_id: { type: 'number' },
      district_id: { type: 'number' },
      is_default: { type: 'boolean' },
      mobile: { type: 'string' },
      name: { type: 'string' },
      province_id: { type: 'number' },
    }, request.body, this.ctx);

    const isDefault = is_default ? 1 : 0;
    let addressId = id;

    const addressInfo = {
      name,
      mobile,
      province_id: provinceId,
      city_id: cityId,
      district_id: districtId,
      address,
      user_id: jwtSession.user_id,
      is_default: isDefault,
    };
    // 有地址id则更新地址
    if (id) {
      await model.Address.update(addressInfo, {
        where: { user_id: jwtSession.user_id, id: addressId },
      });
    } else {
      // 创建一个地址
      addressId = await model.Address.create(addressInfo).then(res => res.id);
    }

    // 如果设置为默认，则需要取消其他地址的默认
    if (is_default) {
      await model.Address.update({
        is_default: 0,
      }, {
        where: { user_id: jwtSession.user_id, id: { [Op.ne]: addressId } },
      });
    }

    response.body = await model.Address.find({
      where: { id: addressId },
      raw: true,
    });
  }
}