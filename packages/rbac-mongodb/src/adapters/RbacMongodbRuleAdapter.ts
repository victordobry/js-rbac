import { RbacRule, RbacRuleAdapter } from '@brainstaff/rbac';

import RbacRuleModel from '../models/RbacRule';

export default class RbacMongodbRuleAdapter implements RbacRuleAdapter {
  async store(rbacRules: RbacRule[]) {
    await RbacRuleModel.deleteMany({});
    return await RbacRuleModel.create(rbacRules);
  }

  async load() {
    return await RbacRuleModel.find({});
  }

  async create(name: RbacRule['name']) {
    return await RbacRuleModel.create({ name });
  }
}
