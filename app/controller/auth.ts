/*
 * @Author: qiao
 * @Date: 2018-07-15 15:43:28
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-15 20:24:53
 * 鉴权控制器
 */
import { Controller } from 'egg';
import { StatusError } from '../entity/status_error';
import * as crypto from 'crypto';
import * as Uuid from 'uuid';
import * as jwt from 'jsonwebtoken';

export default class AuthCtrl extends Controller {

  public async loginByWeChat() {
    const { helper, request, response, logger, app: { httpclient, config }, service, model } = this.ctx;
    const { code, userInfo: fullUserInfo } = helper.validateParams({
      code: { type: 'string' },
      userInfo: { type: 'object' },
    }, request.body, this.ctx);
    const userInfo = fullUserInfo.userInfo;
    const clientIp = ''; // 暂时不记录 ip

    logger.info('code: ' + code);
    logger.info('fullUserInfo: ');
    logger.info(fullUserInfo);

    // 向微信服务器请求登录会话信息
    const sessionData = await httpclient.request('https://api.weixin.qq.com/sns/jscode2session', {
      method: 'GET',
      data: {
        grant_type: 'authorization_code',
        js_code: code,
        secret: config.wechat.secret,
        appid: config.wechat.appid,
      },
      dataType: 'json',
    }).then(res => res.data) as {
      session_key: string;
      openid: string;
      user_id?: number;
    };

    logger.info('sessionData: ');
    logger.info(sessionData);

    if (!sessionData || !sessionData.openid) {
      throw new StatusError('登录失败', StatusError.ERROR_STATUS.SERVER_ERROR);
    }

    // 验证用户信息完整性
    const sha1 = crypto.createHash('sha1').update(fullUserInfo.rawData + sessionData.session_key).digest('hex');
    if (fullUserInfo.signature !== sha1) {
      throw new StatusError('登录失败', StatusError.ERROR_STATUS.SERVER_ERROR);
    }

    // 根据微信服务返回的会话信息解密用户数据
    const weixinUserInfo = await service.wechat.decryptUserInfoData(sessionData.session_key,
      fullUserInfo.encryptedData,
      fullUserInfo.iv) as {
        openId: string;
        nickName: string;
        gender: string;
        language: string;
        city: string;
        province: string;
        country: string;
        avatarUrl: string;
        watermark: {
          timestamp: number;
          appid: string;
        }
      };
    logger.info('weixinUserInfo: ');
    logger.info(weixinUserInfo);

    if (!weixinUserInfo) {
      throw new StatusError('登录失败', StatusError.ERROR_STATUS.SERVER_ERROR);
    }

    // 根据openid查找用户是否已经注册
    let user = await model.User.find({
      where: { weixin_openid: sessionData.openid },
      attributes: ['id', 'username', 'nickname', 'gender', 'avatar', 'birthday'],
      raw: true,
    });
    if (!user) {
      // 注册
      user = await model.User.create({
        username: '微信用户' + Uuid.v1(),
        password: sessionData.openid,
        register_time: Math.floor(new Date().getTime() / 1000),
        register_ip: clientIp,
        last_login_time: Math.floor(new Date().getTime() / 1000),
        last_login_ip: clientIp,
        mobile: '',
        weixin_openid: sessionData.openid,
        avatar: userInfo.avatarUrl || '',
        gender: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
        nickname: userInfo.nickName,
      });
    }

    sessionData.user_id = user.id;

    // 更新登录信息
    model.User.update({
      last_login_ip: clientIp,
      last_login_time: Math.floor(new Date().getTime() / 1000),
    }, {
      where: { id: user.id },
    });

    // 创建token
    const token = jwt.sign(sessionData, config.jwtSession.secret);

    response.body = {
      token,
      userInfo: user,
    };
  }
}
