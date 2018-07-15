// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import JwtSession from '../../../app/middleware/jwt_session';
import ResponseHandler from '../../../app/middleware/response_handler';

declare module 'egg' {
  interface IMiddleware {
    jwtSession: typeof JwtSession;
    responseHandler: typeof ResponseHandler;
  }
}
