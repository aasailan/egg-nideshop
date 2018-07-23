# egg-nideshop
本项目使用egg框架重写[**nideshop开源商城的服务端**](https://github.com/tumobi/nideshop)，网络接口与原版的nideshop服务端几乎完全一样。可以配合[**nideshop小程序端项目**](https://github.com/tumobi/nideshop-mini-program)进行联调（特别提醒：由于小程序sdk升级，原版的[**nideshop小程序端项目**](https://github.com/tumobi/nideshop-mini-program)的用户登录功能已经无法使用，我对用户登录部分代码做了修改，修改后的[**小程序项目点此到达**](https://github.com/aasailan/egg-nideshop-mini-program)）

本项目要点：
* 项目模板基于egg官方脚手架的ts模板
* 技术栈：typescript + egg + Sequelize + mysql
* 使用jwt + egg-userrole完成会话控制
* 所有请求需要做参数校验
* 测试数据来源于 NideShop商城 项目
* 针对大部分controller提供单元测试
* 本项目使用git flow工作流进行管理，请大家选择master分支进行clone

## 本地开发环境配置

### 本地运行
1. git clone https://github.com/aasailan/egg-nideshop.git
2. 使用navicat等工具创建egg-nideshop数据库，并运行sql/egg-nideshop.sql文件。注意数据库字符编码为utf8mb4
3. config/config.local.ts 中修改数据库配置，默认配置如下：
    ```javascript
    config.sequelize = {
        dialect: 'mysql',
        database: 'egg_nideshop',
        host: 'localhost',
        port: '3306',
        username: 'root',
        password: '12345678',
        // 数据表名前缀
        tablePrefix: 'nideshop_',
      };
    ```
4. 填写小程序信息，配置如下（微信支付功能还未实现）：
    ```javascript
    const config: DefaultConfig = {};
    config.wechat = {
      // 小程序appid
      appid: '', 
      // 小程序secret
      secret: '', 

      mch_id: '',
      partner_key: '',
      notify_url: '',
    };
    ```

5. 安装依赖并启动
    ```bash
    npm install
    npm run dev
    ```
6. egg默认监听7001端口，与nideshop小程序项目进行联调时，请记得将nideshop小程序项目的api端口改为7001。

### 调试

```bash
在vscode中安装eggjs拓展，在项目安装依赖后，按f5进入debug模式。按shift + f5 退出debug模式
```

### 生成type文件
```bash
npm run type
```

### 运行测试用例
```bash
npm run test-local
```

### Requirement

- Node.js 8.x
- Typescript 2.8+

## 项目目录说明

* app文件夹：egg工程源码目录
* config：egg工程配置目录
* sql：数据表与测试数据文件，其中egg-nideshop.sql是整体文件，其余子文件夹是拆分出的各个数据表文件。
* test：测试用例文件夹
* typings：项目类型生命文件夹

## 下一步计划
* 完成支付功能
* 编写docker-compose文件，实现docker部署
