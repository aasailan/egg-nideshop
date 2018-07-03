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
};
