/*
 * @Author: qiao
 * @Date: 2018-07-03 16:54:19
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-03 19:55:50
 * topic控制器单元测试
 */
import * as assert from 'assert';
import mock, { BaseMockApplication } from 'egg-mock';
import { Application, Context } from 'egg';

import { IStandardResponseBody } from './../../../app/middleware/response_handler';

describe('topic ctrl test', () => {
  let app: BaseMockApplication<Application, Context>;

  before(() => {
    app = mock.app();
    return app.ready();
  });

  it('test api/topic/list', async () => {
    const apiPrefix = app.config.apiPrefix;
    const res = await app.httpRequest().get(apiPrefix + '/topic/list?page=1&size=10')
    .expect(200);
    const data: IStandardResponseBody = res.body;

    assert(data.errno === 0);
    assert(data.data.count === 20);
    assert(data.data.totalPages === 2);
    assert(data.data.pageSize === 10);
    assert(data.data.currentPage === 1);
    assert(data.data.data.length === 10);
  });

  it('test api/topic/detail?id=314', async () => {
    const apiPrefix = app.config.apiPrefix;
    const res = await app.httpRequest().get(apiPrefix + '/topic/detail?id=314')
    .expect(200);
    const data: IStandardResponseBody = res.body;

    assert(data.errno === 0);
    assert(data.data.id === 314);
    assert(data.data.title === '关爱他成长的每一个足迹');
  });

  it('test api/topic/related', async () => {
    const apiPrefix = app.config.apiPrefix;
    const res = await app.httpRequest().get(apiPrefix + '/topic/related?id=314')
    .expect(200);
    const data: IStandardResponseBody = res.body;

    assert(data.errno === 0);
    assert(data.data.length === 4);
  });
});
