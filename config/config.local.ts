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

    tablePrefix: 'nideshop_',
  };

  config.cors = {
    origin: 'http://localhost:7001',
    // 允许跨域的时候，request携带cookie
    credentials: true,
  };

  return config;
};
