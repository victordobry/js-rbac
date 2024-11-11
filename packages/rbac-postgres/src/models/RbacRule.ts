import { Model } from 'objection';

import { RbacRule } from '@brainstaff/rbac';

interface RbacRuleModel extends RbacRule {}

class RbacRuleModel extends Model {
  static get tableName() {
    return 'rbac_rules';
  }

  static get idColumn() {
    return 'name';
  }
}

export default RbacRuleModel;
