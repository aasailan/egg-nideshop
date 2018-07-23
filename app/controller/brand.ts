/*
 * @Author: qiao
 * @Date: 2018-07-21 11:05:37
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-21 13:39:47
 * 品牌控制器
 */

import { Controller } from 'egg';
// import { Op } from 'sequelize';

export default class BrandCtrl extends Controller {
  /**
   * @description 获取品牌列表
   * @memberof BrandCtrl
   */
  public async list() {
    const { request, helper, model, response } = this.ctx;
    const { page, size } = helper.validateParams({
      page: { type: 'numberString', field: 'page' },
      size: { type: 'numberString', field: 'size' },
    }, request.query, this.ctx);

    const { count, rows: list } = await model.Brand.findAndCountAll({
      attributes: ['id', 'name', 'floor_price', 'app_list_pic_url'],
      limit: size,
      offset: helper.pageOffset(page, size),
      raw: true,
    });

    response.body = {
      count,
      totalPages: helper.pageTotal(count, size),
      pageSize: size,
      currentPage: page,
      data: list,
    };
  }

  /**
   * @description 查询品牌详情
   * @memberof BrandCtrl
   */
  public async detail() {
    const { request, response, helper, model } = this.ctx;
    const { id: brandId } = helper.validateParams({
      id: { type: 'numberString', field: 'id' },
    }, request.query, this.ctx);

    const data = await model.Brand.find({
      where: { id: brandId },
      raw: true,
    });

    response.body = {
      brand: data,
    };
  }
}
