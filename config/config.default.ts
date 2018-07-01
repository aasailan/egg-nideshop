import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

// for config.{env}.ts
export type DefaultConfig = PowerPartial<EggAppConfig & IBizConfig>;

// app special config scheme
export interface IBizConfig {
  sourceUrl: string;
  apiPrefix: string;
  sequelize: {
    dialect: string;
    database: string;
    host: string;
    port: string;
    username: string;
    password: string;
    // 数据库表名前缀
    tablePrefix: string;
  };
}

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig> & IBizConfig;

  // app special config
  config.sourceUrl = `https://github.com/eggjs/examples/tree/master/${appInfo.name}`;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1530154885564_2259';

  // add your config here
  config.middleware = [
    'responseHandler',
  ];

  // 为中间件过滤请求
  config.responseHandler = {
    enable: true,
    match: [
      /\/api\//,
    ],
  };

  config.apiPrefix = '/api';
  return config;
};
