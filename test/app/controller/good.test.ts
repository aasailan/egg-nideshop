/*
 * @Author: qiao
 * @Date: 2018-07-10 15:20:24
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 10:50:40
 * 货物控制器测试
 */

import * as assert from 'assert';
import mock, { BaseMockApplication } from 'egg-mock';
import { Application, Context } from 'egg';

import { IStandardResponseBody } from './../../../app/middleware/response_handler';

describe('good ctrl test', () => {
  let app: BaseMockApplication<Application, Context>;

  before(() => {
    app = mock.app();
    return app.ready();
  });

  it('test api/goods/count', async () => {
    const apiPrefix = app.config.apiPrefix;
    const res = await app.httpRequest().get(apiPrefix + '/goods/count')
    .expect(200);
    const body: IStandardResponseBody = res.body;

    assert(body.errno === 0);
    assert(body.data.goodsCount === 239);
  });

  it('test api/goods/category', async () => {
    const apiPrefix = app.config.apiPrefix;
    const catagoryId = 1008002;
    const res = await app.httpRequest().get(apiPrefix + '/goods/category?id=' + catagoryId)
    .expect(200);
    const body: IStandardResponseBody = res.body;

    assert(body.errno === 0);
    assert(body.data.currentCategory.id === catagoryId);
    assert(body.data.parentCategory.id === body.data.currentCategory.parent_id);
    assert(body.data.brotherCategory.length > 0);
    assert(body.data.brotherCategory[0].parent_id === body.data.currentCategory.parent_id);
  });

  it('test api/goods/list', async () => {
    const apiPrefix = app.config.apiPrefix;

    const queryObj = {
      categoryId: 1008002,
      keyword: null,
      brandId: null,
      isNew: null,
      isHot: null,

      page: 1,
      size: 1000,
      sort: 'desc',
    };

    for (const key in queryObj) {
      if (queryObj[key] === null) {
        delete queryObj[key];
      }
    }

    const res = await app.httpRequest().get(apiPrefix + '/goods/list')
    .query(queryObj)
    .expect(200);
    const body: IStandardResponseBody = res.body;
    assert(body.errno === 0);
    assert(body.data.count > 0);
    assert(body.data.data.length > 0);
    assert(body.data.filterCategory.length > 0);
  });
});
