import { Model } from 'objection';

import { RbacItem } from '@brainstaff/rbac';

interface RbacItemModel extends RbacItem {}

class RbacItemModel extends Model {
  static get tableName() {
    return 'rbac_items';
  }

  static get idColumn() {
    return 'name';
  }
}

export default RbacItemModel;
