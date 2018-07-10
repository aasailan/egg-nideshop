/*
 * @Author: qiao
 * @Date: 2018-07-09 16:00:03
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-09 19:02:45
 * 评论测试文件
 */

import * as assert from 'assert';
import mock, { BaseMockApplication } from 'egg-mock';
import { Application, Context } from 'egg';

import { IStandardResponseBody } from './../../../app/middleware/response_handler';

describe('comment ctrl test', () => {
  let app: BaseMockApplication<Application, Context>;

  before(() => {
    app = mock.app();
    return app.ready();
  });

  it('test api/comment/list', async () => {
    const apiPrefix = app.config.apiPrefix;
    const res = await app.httpRequest()
    .get( apiPrefix + '/comment/list?valueId=314&typeId=1&size=5')
    .expect(200);
    const body: IStandardResponseBody = res.body;

    assert(body.errno === 0);
    assert(body.data.count === 9);
    assert(body.data.pageSize === 5);
    assert(body.data.currentPage === 1);
    assert(body.data.totalPages === 2);
    assert(body.data.data.length === 5);
    // console.log();
    app.logger.info(body.data.data[0].content);
  });

  it('test api/comment/count', async () => {
    const apiPrefix = app.config.apiPrefix;
    const res = await app.httpRequest()
    .get( apiPrefix + '/comment/count?valueId=314&typeId=1')
    .expect(200);
    const body: IStandardResponseBody = res.body;

    assert(body.errno === 0);
    assert(body.data.allCount === 9);
    assert(body.data.hasPicCount === 0);
  });
});