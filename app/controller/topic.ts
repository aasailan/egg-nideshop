/*
 * @Author: qiao
 * @Date: 2018-07-03 14:37:52
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-09 16:45:05
 * 主题控制器
 */
import { Controller } from 'egg';

export default class TopicCtrl extends Controller {

  public async list() {
    const { model, request, response, helper } = this.ctx;
    const { page, size } = helper.validateParams({
      page: { type: 'numberString', field: 'page' },
      size: { type: 'numberString', field: 'size' },
    }, request.query, this.ctx);

    const { count, rows } = await model.Topic.findAndCountAll({
      attributes: ['id', 'title', 'price_info', 'scene_pic_url', 'subtitle'],
      limit: size,
      offset: helper.pageOffset(page, size),
    });

    response.body = {
      count,
      totalPages: helper.pageTotal(count, size),
      pageSize: size,
      currentPage: page,
      data: rows,
    };
  }

  public async detail() {
    const { helper, request, model, response } = this.ctx;

    const params = helper.validateParams({
      id: { type: 'numberString', field: 'id' },
    }, request.query, this.ctx);

    // const topicId = parseInt(request.query.id, 10);
    const topicId = params.id;

    const topic = await model.Topic.find({
      where: { id: topicId },
    });

    response.body = topic;
  }

  public async relate() {
    const { helper, request, response, model } = this.ctx;
    // 其实传上来的id并没有卵用
    helper.validateParams({
      id: { type: 'string' },
    }, request.query, this.ctx);

    // const topicId = parseInt(request.query.id, 10);

    const relatedTopics = await model.Topic.findAll({
      attributes: ['id', 'title', 'price_info', 'scene_pic_url', 'subtitle'],
      limit: 4,
    });

    response.body = relatedTopics;
  }
}
