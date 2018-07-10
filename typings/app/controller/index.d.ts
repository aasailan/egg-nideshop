// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Catalog from '../../../app/controller/catalog';
import Comment from '../../../app/controller/comment';
import Home from '../../../app/controller/home';
import Index from '../../../app/controller/index';
import Topic from '../../../app/controller/topic';

declare module 'egg' {
  interface IController {
    catalog: Catalog;
    comment: Comment;
    home: Home;
    index: Index;
    topic: Topic;
  }
}
