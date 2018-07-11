import { IPage } from './../entity/page';
/*
 * @Author: qiao
 * @Date: 2018-07-10 15:16:37
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 19:33:32
 * 货物控制器
 */
import { Controller } from 'egg';
import { IGoodAttr } from '../model/good';
import { Op, WhereOptions } from 'sequelize';

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
    const { helper, request, model, response } = this.ctx;
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
      // TODO: user_id现在固定死了是1，应该从会话获取
      model.SearchHistory.create({
        keyword,
        user_id: '1',
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

  public async detail() {
    const { helper, request, model, response } = this.ctx;
    const { id: goodId } = helper.validateParams({
      id: { type: 'numberString', field: 'id' },
    }, request.query, this.ctx);

    // 解构别名
    const [info, gallery, issue, { count: commentCount, rows: hotComments } ] = await Promise.all([
      model.Good.find({ where: { id: goodId }, raw: true }),
      model.GoodGallery.findAll({ where: { goods_id: goodId }, limit: 4, raw: true }),
      // model.GoodAttribute.
      model.GoodIssue.findAll({ raw: true }),
      model.Comment.findAndCount({ where: { value_id: goodId, type_id: 0 } }),
    ]);
    // 查找商品品牌
    const brand = await model.Brand.find({ where: { id: info.brand_id } });

    // 查找评论用户信息
    let commentInfo = {};
    if (hotComments && hotComments.length > 0) {
      const [commentUser, picList ] = await Promise.all([
        model.User.find({ where: { id: hotComments[0].user_id }, raw: true }),
        model.CommentPicture.findAll({ where: { comment_id: hotComments[0].id }, raw: true }),
      ]);
      commentInfo = {
        content: Buffer.from(hotComments[0].content, 'base64').toString,
        add_time: new Date(hotComments[0].add_time * 1000).getDate(),
        nickname: commentUser.nickname,
        avatar: commentUser.avatar,
        pic_list: picList,
      };
    }

    const comment = {
      count: commentCount,
      data: commentInfo,
    };

    // 当前用户是否收藏 TODO: 写死当前用户id
    const userHasCollect = await model.Collect.isUserHasCollect(1, 0, goodId);
    // 记录用户足迹 TODO: 写死当前用户id
    model.Footprint.addFootprint(1, goodId);

    response.body = {
      info,
      gallery,
      attribute,
      userHasCollect,
      issue,
      comment,
      brand,
      specificationList,
    };
  }
}