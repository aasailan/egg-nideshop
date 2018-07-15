// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Auth from '../../../app/controller/auth';
import Catalog from '../../../app/controller/catalog';
import Comment from '../../../app/controller/comment';
import Good from '../../../app/controller/good';
import Home from '../../../app/controller/home';
import Index from '../../../app/controller/index';
import Topic from '../../../app/controller/topic';

declare module 'egg' {
  interface IController {
    auth: Auth;
    catalog: Catalog;
    comment: Comment;
    good: Good;
    home: Home;
    index: Index;
    topic: Topic;
  }
}
