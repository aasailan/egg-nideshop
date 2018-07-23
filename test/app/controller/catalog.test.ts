/*
 * @Author: qiao
 * @Date: 2018-07-10 11:09:09
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-10 11:50:07
 * 分类控制器测试
 */

import * as assert from 'assert';
import mock, { BaseMockApplication } from 'egg-mock';
import { Application, Context } from 'egg';

import { IStandardResponseBody } from 'app/middleware/response_handler';

describe('catalog ctrl test', () => {
  let app: BaseMockApplication<Application, Context>;

  before(() => {
    app = mock.app();
    return app.ready();
  });

  it('test /api/catalog/index', async () => {
    const apiPrefix = app.config.apiPrefix;
    const res = await app.httpRequest().get(apiPrefix + '/catalog/index')
    .expect(200);
    const body: IStandardResponseBody = res.body;

    assert(body.errno === 0);
    assert(body.data.categoryList.length === 9);
    assert(body.data.currentCategory.id === body.data.categoryList[0].id);

    app.logger.info(body.data.currentCategory.name);
  });

  it('test /api/catalog/current?id=1005001', async () => {
    const apiPrefix = app.config.apiPrefix;
    const catalogId = 1005001;
    const res = await app.httpRequest().get(apiPrefix + '/catalog/current?id=' + catalogId)
    .expect(200);
    const body: IStandardResponseBody = res.body;

    assert(body.errno === 0);
    assert(body.data.currentCategory.id === catalogId);
    assert(body.data.currentCategory.subCategoryList.length > 0);
    assert(body.data.currentCategory.subCategoryList[0].parent_id === catalogId);
  });
});
