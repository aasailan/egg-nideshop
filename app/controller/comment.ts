/*
 * @Author: qiao
 * @Date: 2018-07-04 14:15:14
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-10 10:02:12
 * 评论控制器
 */
import { Controller } from 'egg';
import { IPage } from '../entity/page';
import { Op } from 'sequelize';
// import Sequelize from 'sequelize';

export default class CommentCtrl extends Controller {
  public async list() {
    const { helper, request, model, response } = this.ctx;
    const { valueId, typeId, size, page = 1 } = helper.validateParams({
      valueId: { type: 'numberString', field: 'valueId' },
      typeId: { type: 'numberString', field: 'typeId' },
      size: { type: 'numberString', field: 'size' },
      page: { type: 'numberString', required: false, field: 'page' },
      // // 选择评论的类型 0 全部， 1 只显示图片
      showType: { type: 'numberString', required: false, field: 'showType' },
    }, request.query, this.ctx);

    const { count, rows } = await model.Comment.findAndCountAll({
      where: { type_id: typeId, value_id: valueId },
      offset: helper.pageOffset(page, size),
      limit: size,
    });

    // 最后返回的评论列表
    const commentList = [];
    for (const commentItem of rows) {
      const comment: any = {};
      comment.content = Buffer.from(commentItem.content, 'base64').toString();
      comment.type_id = commentItem.type_id;
      comment.value_id = commentItem.value_id;
      comment.id = commentItem.value_id;
      comment.add_time = new Date(commentItem.add_time * 1000);

      const [ userInfo, picList ] = await Promise.all([
        model.User.find({
          attributes: ['username', 'avatar', 'nickname'],
          where: { id: commentItem.user_id },
        }),
        model.CommentPicture.findAll({
          where: { comment_id: commentItem.id },
        }),
      ]);

      comment.user_info = userInfo;
      comment.pic_list = picList;
      commentList.push(comment);
    }

    response.body = {
      count,
      totalPages: helper.pageTotal(count, size),
      pageSize: size,
      currentPage: page,
      data: commentList,
    } as IPage;
  }

  public async count() {
    const { helper, request, response, model } = this.ctx;
    const { valueId, typeId } = helper.validateParams({
      valueId: { type: 'numberString', field: 'valueId' },
      typeId: { type: 'numberString', field: 'typeId' },
    }, request.query, this.ctx);

    const allCount = await model.Comment.count({
      where: { type_id: typeId, value_id: valueId },
      col: 'id',
    });

    // sequelizejs 默认只有left join与inner join，需要right join的时候，只能调换表的位置，把right join改为 left join
    // 任然无法满足需求的时候，只能自己拆分多次查表
    const comments = await model.Comment.findAll({
      attributes: ['id'],
      where: { type_id: typeId, value_id: valueId },
    });
    const hasPicCount = await model.CommentPicture.count({
      where: { comment_id: { [Op.in]: comments.map((comment) => comment.id) } },
      col: 'comment_id',
    });

    response.body = {
      allCount,
      hasPicCount,
    };
  }
}
