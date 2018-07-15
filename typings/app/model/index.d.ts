// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Ad from '../../../app/model/ad';
import AdPosition from '../../../app/model/ad_position';
import Attribute from '../../../app/model/attribute';
import Brand from '../../../app/model/brand';
import Category from '../../../app/model/category';
import Channel from '../../../app/model/channel';
import Collect from '../../../app/model/collect';
import Comment from '../../../app/model/comment';
import CommentPicture from '../../../app/model/comment_picture';
import Footprint from '../../../app/model/footprint';
import Good from '../../../app/model/good';
import GoodAttribute from '../../../app/model/good_attribute';
import GoodGallery from '../../../app/model/good_gallery';
import GoodIssue from '../../../app/model/good_issue';
import GoodSpecification from '../../../app/model/good_specification';
import Product from '../../../app/model/product';
import RelatedGood from '../../../app/model/related_good';
import SearchHistory from '../../../app/model/search_history';
import Specification from '../../../app/model/specification';
import Topic from '../../../app/model/topic';
import User from '../../../app/model/user';

declare module 'sequelize' {
  interface Sequelize {
    Ad: ReturnType<typeof Ad>;
    AdPosition: ReturnType<typeof AdPosition>;
    Attribute: ReturnType<typeof Attribute>;
    Brand: ReturnType<typeof Brand>;
    Category: ReturnType<typeof Category>;
    Channel: ReturnType<typeof Channel>;
    Collect: ReturnType<typeof Collect>;
    Comment: ReturnType<typeof Comment>;
    CommentPicture: ReturnType<typeof CommentPicture>;
    Footprint: ReturnType<typeof Footprint>;
    Good: ReturnType<typeof Good>;
    GoodAttribute: ReturnType<typeof GoodAttribute>;
    GoodGallery: ReturnType<typeof GoodGallery>;
    GoodIssue: ReturnType<typeof GoodIssue>;
    GoodSpecification: ReturnType<typeof GoodSpecification>;
    Product: ReturnType<typeof Product>;
    RelatedGood: ReturnType<typeof RelatedGood>;
    SearchHistory: ReturnType<typeof SearchHistory>;
    Specification: ReturnType<typeof Specification>;
    Topic: ReturnType<typeof Topic>;
    User: ReturnType<typeof User>;
  }
}
