import { Model } from 'objection';

import { RbacItemChild } from '@brainstaff/rbac';

interface RbacItemChildModel extends RbacItemChild {}

class RbacItemChildModel extends Model {
  static get tableName() {
    return 'rbac_item_children';
  }

  static get idColumn() {
    return ['parent', 'child'];
  }
}

export default RbacItemChildModel;
