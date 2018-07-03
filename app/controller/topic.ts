/*
 * @Author: qiao
 * @Date: 2018-07-03 14:37:52
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-03 19:58:19
 * 主题控制器
 */
import { Controller } from 'egg';
import { StatusError } from './../entity/status_error';

export default class TopicCtrl extends Controller {

  public async list() {
    const { model, request, response, logger, helper } = this.ctx;

    helper.validateParams({
      page: { type: 'string' },
      size: { type: 'string' },
    }, request.query, this.ctx);

    try {
      const page = parseInt(request.query.page, 10);
      const size = parseInt(request.query.size, 10);

      logger.debug('page: ' + page);
      logger.debug('size: ' + size);

      const totalCount = await model.Topic.count();

      const { totalPages, offset } = helper.paginate(totalCount, size, page);

      const topics = await this.ctx.model.Topic.findAll({
        attributes: ['id', 'title', 'price_info', 'scene_pic_url', 'subtitle'],
        limit: size,
        offset,
      });

      response.body = {
        count: totalCount,
        totalPages,
        pageSize: size,
        currentPage: page,
        data: topics,
      };
    } catch (e) {
      if (e instanceof StatusError) {
        throw e;
      }
      this.ctx.logger.error(e.message);
      throw new StatusError(e.message, StatusError.ERROR_STATUS.SERVER_ERROR);
    }
  }

  public async detail() {
    const { helper, request, model, response } = this.ctx;

    helper.validateParams({
      id: { type: 'string' },
    }, request.query, this.ctx);

    const topicId = parseInt(request.query.id, 10);

    try {
      const topic = await model.Topic.find({
        where: { id: topicId },
      });

      response.body = topic;
    } catch (e) {
      if (e instanceof StatusError) {
        throw e;
      }
      this.ctx.logger.error(e.message);
      throw new StatusError(e.message, StatusError.ERROR_STATUS.SERVER_ERROR);
    }
  }

  public async relate() {
    const { helper, request, response, model } = this.ctx;
    helper.validateParams({
      id: { type: 'string' },
    }, request.query, this.ctx);

    // const topicId = parseInt(request.query.id, 10);

    try {
      const relatedTopics = await model.Topic.findAll({
        attributes: ['id', 'title', 'price_info', 'scene_pic_url', 'subtitle'],
        limit: 4,
      });

      response.body = relatedTopics;
    } catch (e) {
      if (e instanceof StatusError) {
        throw e;
      }
      this.ctx.logger.error(e.message);
      throw new StatusError(e.message, StatusError.ERROR_STATUS.SERVER_ERROR);
    }
  }
}
