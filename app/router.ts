import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const apiPrefix = app.config.apiPrefix;

  router.get('/', controller.home.index);

  router.get(apiPrefix + '/test', controller.home.test);

  // 商城首页
  router.get(apiPrefix + '/index/index', controller.index.index);
};
