/*
 * @Author: qiao
 * @Date: 2018-07-03 11:27:05
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-03 11:27:29
 * 测试环境加载插件
 */
import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },
  security: {
    enable: false,
  },

  cors: {
    enable: true,
    package: 'egg-cors',
  },
};

export default plugin;
