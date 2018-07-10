/*
 * @Author: qiao
 * @Date: 2018-07-10 10:42:24
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-10 14:29:35
 * 分类控制器
 */
import { Controller } from 'egg';
import { ICategoryAttr } from '../model/category';

export default class CatalogCtrl extends Controller {
  public async index() {
    const { helper, request, model, logger, response } = this.ctx;
    const { id = null } = helper.validateParams({
      id: { type: 'numberString', field: 'id', required: false },
    }, request.query, this.ctx);

    // 查询第一级分类
    const categoryList = await model.Category.findAll({
      where: { parent_id: 0 },
      limit: 10,
      // 获得未被instance类包装的原始数据
      raw: true,
    });
    // .then((result) => result.map((catalog) => catalog.get({ plain: true })));

    logger.info(id);
    let currentCategory: ICategoryAttr = null;
    if (id) {
      currentCategory = await model.Category.find({
        where: { id },
        raw: true,
      });
    }

    if (!currentCategory) {
      currentCategory = categoryList[0];
    }

    if (currentCategory && currentCategory.id) {
      const subCategoryList = await model.Category.findAll({
        where: { parent_id: currentCategory.id },
        raw: true,
      });
      currentCategory.subCategoryList = subCategoryList;
    }

    response.body = {
      categoryList,
      currentCategory,
    };
  }

  public async current() {
    const { helper, request, model, response } = this.ctx;
    const { id } = helper.validateParams({
      id: { type: 'numberString', field: 'id' },
    }, request.query, this.ctx);

    const [ currentCategory, subCategoryList ] = await Promise.all([
      model.Category.find({ where: { id }, raw: true }),
      model.Category.findAll({ where: { parent_id: id }, raw: true }),
    ]);

    currentCategory['subCategoryList'] = subCategoryList;
    response.body = {
      currentCategory,
    };
  }
}
