import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const apiPrefix = app.config.apiPrefix;

  router.get('/', controller.home.index);

  router.get(apiPrefix + '/test', controller.home.test);

  // 商城首页
  router.get(apiPrefix + '/index/index', controller.index.index);

  // 主题列表页
  router.get(apiPrefix + '/topic/list', controller.topic.list);
  // 主题详情页
  router.get(apiPrefix + '/topic/detail', controller.topic.detail);
  // 主题相关
  router.get(apiPrefix + '/topic/related', controller.topic.relate);

  // 评论列表
  router.get(apiPrefix + '/comment/list', controller.comment.list);
  router.get(apiPrefix + '/comment/count', controller.comment.count);

  // 商品分类列表
  router.get(apiPrefix + '/catalog/index', controller.catalog.index);
  // 商品当前分类详情
  router.get(apiPrefix + '/catalog/current', controller.catalog.current);

  // 当前正在销售的货物总数
  router.get(apiPrefix + '/goods/count', controller.good.count);
  // 获取分类下的商品
  router.get(apiPrefix + '/goods/category', controller.good.category);
  // 搜索货物列表
  router.get(apiPrefix + '/goods/list', controller.good.list);
  // 货物详情
  router.get(apiPrefix + '/goods/detail', controller.good.detail); ;
  // 相关货物列表
  router.get(apiPrefix + '/goods/related', controller.good.relate);
};
