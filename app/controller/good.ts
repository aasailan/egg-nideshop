/*
 * @Author: qiao
 * @Date: 2018-07-10 15:16:37
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-15 20:20:21
 * 货物控制器
 */
import { Controller } from 'egg';
import { IGoodAttr, IGoodInst } from '../model/good';
import { Op, WhereOptions } from 'sequelize';
import { IPage } from '../entity/page';
import * as moment from 'moment';

export default class GoodCtrl extends Controller {
  /**
   * @description 计算在售商品数
   * @memberof GoodCtrl
   */
  public async count() {
    const goodsCount = await this.ctx.model.Good.count({
      where: { is_delete: 0, is_on_sale: 1 },
      col: 'id',
    });

    this.ctx.response.body = {
      goodsCount,
    };
  }

  /**
   * @description 获取分类下的商品
   * @memberof GoodCtrl
   */
  public async category() {
    const { helper, request, model, response } = this.ctx;
    const { id } = helper.validateParams({
      id: { type: 'numberString', field: 'id' },
    }, request.query, this.ctx);

    const currentCategory = await model.Category.find({
      where: { id },
      raw: true,
    });
    const [parentCategory, brotherCategory] = await Promise.all([
      model.Category.find({ where: { id: currentCategory.parent_id }, raw: true }),
      model.Category.findAll({ where: { parent_id: currentCategory.parent_id }, raw: true }),
    ]);

    response.body = {
      currentCategory,
      parentCategory,
      brotherCategory,
    };
  }

  /**
   * @description 搜索货物列表
   * @memberof GoodCtrl
   */
  public async list() {
    const { helper, request, model, response, jwtSession } = this.ctx;
    const { categoryId = 0, keyword = null, brandId = null, isNew = null, isHot = null,
      page, size = 20, sort = 'desc', order } = helper.validateParams({
        categoryId: { type: 'numberString', field: 'categoryId' },
        keyword: { type: 'string', required: false },
        brandId: { type: 'numberString', field: 'brandId', required: false },
        isNew: { type: 'numberString', field: 'isNew', required: false },
        isHot: { type: 'numberString', field: 'isHot', required: false },
        page: { type: 'numberString', field: 'page' },
        size: { type: 'numberString', field: 'size', required: false },
        sort: { type: 'string', required: false },
    }, request.query, this.ctx);

    // 添加搜索查找条件
    const whereMap = {} as WhereOptions<IGoodAttr>;
    if (keyword) {
      whereMap.name = { [Op.like]: `%${keyword}%` };
      // 将用户的搜索记录插入到表中
      model.SearchHistory.create({
        keyword,
        user_id: jwtSession.user_id,
        add_time: new Date().getTime() / 1000,
      });
    }

    brandId ? whereMap.brand_id = brandId : null;

    isNew ? whereMap.is_new = isNew : null;

    isHot ? whereMap.is_hot = isHot : null;

    // 添加排序条件
    let orderMap;
    if (sort === 'price') {
      // 按价格排序
      orderMap = [['retail_price', order]];
    } else {
      // 按照商品添加时间
      orderMap = [['id', 'desc']];
    }

    // 添加筛选分类
    let filterCategory = [{
      id: 0,
      name: '全部',
      checked: false,
    }];
    // 搜索商品所属分类
    const categoryIds = await model.Good.findAll({
      where: whereMap,
      limit: 10000,
      attributes: ['category_id'],
      raw: true,
    }).then(categoryInsts => categoryInsts.map(categoryInst => categoryInst.category_id));

    if (categoryIds && categoryIds.length > 0) {
      // 商品所属分类的父类id
      const parentIds = await model.Category.findAll({
        where: { id: { [Op.in]: categoryIds} },
        attributes: ['parent_id'],
        limit: 10000,
        raw: true,
      }).then(categoryInsts => categoryInsts.map(categoryInst => categoryInst.parent_id));

      // 搜索商品所属分类的父类name与id
      const parentCategory: any[] = await model.Category.findAll({
        where: { id: { [Op.in]: parentIds } },
        attributes: ['id', 'name'],
        raw: true,
      });

      if (parentCategory && parentCategory.length > 0) {
        filterCategory = filterCategory.concat(parentCategory);
      }
    }

    // 添加指定搜索种类条件
    if (categoryId > 0) {
      // 获取指定种类的所有子分类id
      const filterCategoryId = await model.Category.getCategoryWhereIn(categoryId);
      whereMap.category_id = { [Op.in]: filterCategoryId };
    }

    // 正式搜索商品
    const { count, rows } = await model.Good.findAndCountAll({
      where: whereMap,
      attributes: ['id', 'name', 'list_pic_url', 'retail_price'],
      limit: size,
      offset: helper.pageOffset(page, size),
      // order: [['name', 'DESC']]`
      order: orderMap,
      raw: true,
    });

    // 检查使用哪个过滤规则
    filterCategory.forEach(filter => {
      filter.checked = (!categoryId && filter.id === 0) || filter.id === categoryId;
    });

    response.body = {
      count,
      totalPages: helper.pageTotal(count, size),
      pageSize: size,
      currentPage: page,
      data: rows,
      goodsList: rows,
      filterCategory,
    } as IPage;
  }

  /**
   * @description 查找货物详情
   * @memberof GoodCtrl
   */
  public async detail() {
    const { helper, request, model, response, jwtSession } = this.ctx;
    const { id: goodId } = helper.validateParams({
      id: { type: 'numberString', field: 'id' },
    }, request.query, this.ctx);

    // 解构别名;
    const [info, gallery, attribute, issue, { count: commentCount, rows: hotComments } ] = await Promise.all([
      model.Good.find({ where: { id: goodId }, raw: true }),
      model.GoodGallery.findAll({ where: { goods_id: goodId }, limit: 4, raw: true }),
      model.GoodAttribute.findAll({
        raw: true,
        include: [
          {
            association: model.GoodAttribute.belongsTo(model.Attribute,
              { foreignKey: 'attribute_id', targetKey: 'id' }),
            model: model.Attribute,
            // NOTE: 查出来的字段会被自动添加上表名变成 nideshop_attribute.name，如果需要去除表名，只能自己对结果进行map修改
            attributes: ['name'],
          },
        ],
        where: { goods_id: goodId },
        order: [['id', 'asc']],
        attributes: ['value'],
      }).then(results => results.map(result => {
        return {value: result.value, name: result[model.Attribute.name + '.name']};
      })),
      // NOTE: 这个地方原项目中没有加 goods_id=goodId的查询，应该要加上才对
      model.GoodIssue.findAll({ raw: true, where: { goods_id: goodId } }),
      model.Comment.findAndCount({ where: { value_id: goodId, type_id: 0 } }),
    ]);
    // 查找商品品牌
    const brand = await model.Brand.find({ where: { id: info.brand_id } });

    // 查找评论用户信息
    let commentInfo = {};
    if (hotComments && hotComments.length > 0) {
      const [commentUser, picList ] = await Promise.all([
        model.User.find({ where: { id: hotComments[0].user_id }, raw: true}),
        model.CommentPicture.findAll({ where: { comment_id: hotComments[0].id }, raw: true }),
      ]);
      commentInfo = {
        content: Buffer.from(hotComments[0].content, 'base64').toString(),
        add_time: moment(hotComments[0].add_time * 1000).format('YYYY-MM-DD hh:mm:ss'), // hotComments[0].add_time * 1000
        nickname: commentUser && commentUser.nickname,
        avatar: commentUser && commentUser.avatar,
        pic_list: picList,
      };
    }

    const comment = {
      count: commentCount,
      data: commentInfo,
    };

    // 当前用户是否收藏
    const userHasCollect = await model.Collect.isUserHasCollect(jwtSession.user_id, 0, goodId);
    // 记录用户足迹
    model.Footprint.addFootprint(jwtSession.user_id, goodId);

    // 查找商品规格信息
    const [specificationList, productList] = await Promise.all([
      model.Good.getSpecificationList(goodId),
      model.Good.getProductList(goodId),
    ]);

    response.body = {
      info,
      gallery,
      attribute,
      userHasCollect,
      issue,
      comment,
      brand,
      specificationList,
      productList,
    };
  }

  /**
   * @description 相关货物列表
   * @memberof GoodCtrl
   */
  public async relate() {
    const { helper, request, model, response } = this.ctx;
    const { id: goodId } = helper.validateParams({
      id: { type: 'numberString', field: 'id' },
    }, request.query, this.ctx);

    // 查找相关货物id
    const relatedGoodIds = await model.RelatedGood.findAll({
      where: { id: goodId },
      attributes: ['related_goods_id'],
      raw: true,
    });

    let relatedGoods: IGoodInst[] = null;
    if (relatedGoodIds && relatedGoodIds.length > 0) {
      // 根据相关id查找相关货物
      relatedGoods = await model.Good.findAll({
        where: { id: { [Op.in]: relatedGoodIds }},
        attributes: ['id', 'name', 'list_pic_url', 'retail_price'],
        raw: true,
      });
    } else {
      // 没有相关货物id，查找同种类的货物
      const goodInfo = await model.Good.find({
        where: { id: goodId },
        raw: true,
      });
      relatedGoods = await model.Good.findAll({
        where: { category_id: goodInfo.category_id },
        attributes: ['id', 'name', 'list_pic_url', 'retail_price'],
        limit: 8,
        raw: true,
      });
    }

    response.body = {
      goodsList: relatedGoods,
    };
  }
}