import { DefaultConfig } from './config.default';

export default () => {
  const config: DefaultConfig = {};

  // 数据库配置
  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'egg_nideshop',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: '12345678',
    // 数据表名前缀
    tablePrefix: 'nideshop_',
  };

  // 微信配置
  config.wechat = {
    appid: 'wx7dffdfe1be046be9',
    secret: 'b174075db7ef3cf7119b43fdc6f72e9a',
    mch_id: '',
    partner_key: '',
    notify_url: '',
  };

  config.cors = {
    origin: 'http://localhost:7001',
    // 允许跨域的时候，request携带cookie
    credentials: true,
  };

  return config;
};
