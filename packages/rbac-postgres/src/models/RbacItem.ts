import { Model } from 'objection';

interface RbacItem {
  name: any;
  type: any;
  rule: any;
}

class RbacItem extends Model {
  static get tableName() {
    return 'rbac_items';
  }

  static get idColumn() {
    return 'name';
  }
}

export default RbacItem;
