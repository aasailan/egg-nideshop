/*
 * @Author: qiao
 * @Date: 2018-07-03 10:36:05
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 10:32:27
 * index控制器测试文件
 */

/**
 * 1、测试脚本文件统一按 ${filename}.test.js 命名，必须以 .test.js 作为文件后缀。
 * 2、统一使用 egg-bin 来运行测试脚本， 自动将内置的 Mocha、co-mocha、power-assert，nyc 等模块组合
 * 引入到测试脚本中， 让我们聚焦精力在编写测试代码上，而不是纠结选择那些测试周边工具和模块。
 * 3、app.httpRequest() 是 egg-mock 封装的 SuperTest 请求实例。(https://github.com/visionmedia/supertest#getting-started)
 * 4、SuperTest本身又是superagent的封装，一些详细的api可以查看superagent的api文档。（https://visionmedia.github.io/superagent/#get-requests）
 * 5、egg-mock api https://github.com/eggjs/egg-mock#api
 */

import * as assert from 'assert';
import mock, { BaseMockApplication } from 'egg-mock';
import { Application, Context } from 'egg';

import { IStandardResponseBody } from './../../../app/middleware/response_handler';

describe('index ctrl test', () => {
  let app: BaseMockApplication<Application, Context>;

  before(() => {
    app = mock.app();
    return app.ready();
  });

  it('test api/index/index', async () => {
    const apiPrefix = app.config.apiPrefix;
    const res = await app.httpRequest().get( apiPrefix + '/index/index').expect(200);
    const data: IStandardResponseBody = res.body;
    assert(data.errno === 0);
  });
});