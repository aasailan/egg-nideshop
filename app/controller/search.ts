/*
 * @Author: qiao
 * @Date: 2018-07-21 14:14:36
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-21 15:40:07
 * 搜索接口
 */

import { Controller } from 'egg';
import { Op } from 'sequelize';

export default class SearchCtrl extends Controller {
  /**
   * @description 返回搜索历史与热门搜索
   * @memberof SearchCtrl
   */
  public async index() {
    const { jwtSession, response, model } = this.ctx;

    // 取出输入框默认的关键词
    const defaultKeyword = await model.Keyword.find({
      where: { is_default: 1 },
      raw: true,
    });
    // 取出热搜关键词
    const hotKeywordList = await model.Keyword.findAll({
      attributes: ['keyword', 'is_hot'],
      where: { is_hot: 1 },
      raw: true,
    });
    // 取出历史搜索
    let historyKeywordList = [];
    if (jwtSession && jwtSession.user_id) {
      historyKeywordList = await model.SearchHistory.findAll({
        attributes: ['keyword'],
        where: { user_id: jwtSession.user_id },
        raw: true,
        limit: 10,
      }).then(res => res.map(inst => inst.keyword));
    }

    response.body = {
      defaultKeyword,
      hotKeywordList,
      historyKeywordList,
    };
  }

  /**
   * @description 实时关键词搜索
   * @memberof SearchCtrl
   */
  public async helper() {
    const { request, model, helper, response } = this.ctx;
    const { keyword } = helper.validateParams({
      keyword: { type: 'string' },
    }, request.query, this.ctx);

    const results = await model.Keyword.findAll({
      where: { keyword: { [Op.like]: keyword }},
      limit: 10,
      attributes: ['keyword'],
      raw: true,
    }).then(res => res.map(inst => inst.keyword));

    response.body = results;
  }

  /**
   * @description 清除用户搜索历史
   * @memberof SearchCtrl
   */
  public async clearHistory() {
    const { jwtSession, model, response } = this.ctx;

    if (jwtSession && jwtSession.user_id) {
      await model.SearchHistory.destroy({
        where: { user_id: jwtSession.user_id },
      });
    }

    response.body = '';
  }
}