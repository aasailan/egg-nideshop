import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const apiPrefix = app.config.apiPrefix;

  router.get('/', controller.home.index);

  router.get(apiPrefix + '/test', controller.home.test);
};
