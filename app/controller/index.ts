/*
 * @Author: qiao
 * @Date: 2018-07-01 19:21:47
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-03 14:37:33
 * 首页控制器
 */
import { Controller } from 'egg';
import { StatusError } from '../entity/status_error';
import { Op } from 'sequelize';

export default class IndexCtrl extends Controller {
  public async index() {
    const model = this.ctx.model;
    try {
      const [ banner, channel, newGoods, hotGoods, brandList, topicList, categoryList] = await Promise.all([
        // 首页banner
        model.Ad.findAll({ where: { ad_position_id: 1 } }),
        model.Channel.findAll({ order: [['sort_order', 'ASC']] }),
        // 新品货物
        model.Good.findAll({
          attributes: [ 'id', 'name', 'list_pic_url', 'retail_price' ],
          where: { is_new: 1 },
          limit: 3,
        }),
        // 热卖货物
        model.Good.findAll({
          attributes: [ 'id', 'name', 'list_pic_url', 'retail_price', 'goods_brief' ],
          where: { is_hot: 1 },
          limit: 3,
        }),
        // 品牌列表
        model.Brand.findAll({
          where: { is_new: 1 },
          order: [['new_sort_order', 'ASC']],
          limit: 4,
        }),
        // 主题列表
        model.Topic.findAll({ limit: 3 }),
        // 获取一级分类列表
        model.Category.findAll({
          where: { parent_id: 0, name: { [Op.not]: '推荐' } },
        }),
      ]);

      const newCategoryList = [];
      for (const categoryItem of categoryList) {

        // 获取同属一级分类的二级分类列表的id
        const childCategoryIds = await model.Category.findAll({
          where: { parent_id: categoryItem.id },
          attributes: [ 'id' ],
          limit: 100,
        }).then((results) => {
          return results.map((result) => result.id);
        });

        // this.ctx.logger.info(childCategoryIds);
        // 获取同属一级分类的二级分类列表的货物
        const categoryGoods = await model.Good.findAll({
          attributes: ['id', 'name', 'list_pic_url', 'retail_price'],
          where: { category_id: { [Op.in]: childCategoryIds }},
          limit: 7,
        });
        newCategoryList.push({
          id: categoryItem.id,
          name: categoryItem.name,
          goodsList: categoryGoods,
        });
      }

      this.ctx.response.body = {
        banner,
        channel,
        newGoodsList: newGoods,
        hotGoodsList: hotGoods,
        brandList,
        topicList,
        categoryList: newCategoryList,
      };
    } catch (e) {
      if (e instanceof StatusError) {
        throw e;
      }
      this.ctx.logger.error(e.message);
      throw new StatusError(e.message, StatusError.ERROR_STATUS.SERVER_ERROR);
    }
  }
}