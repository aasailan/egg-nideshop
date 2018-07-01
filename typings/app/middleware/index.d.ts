// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import ResponseHandler from '../../../app/middleware/response_handler';

declare module 'egg' {
  interface IMiddleware {
    responseHandler: typeof ResponseHandler;
  }
}
