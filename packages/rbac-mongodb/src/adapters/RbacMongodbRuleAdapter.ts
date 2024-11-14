import { RbacRule, RbacRuleAdapter } from '@brainstaff/rbac';

import RbacRuleModel from '../models/RbacRule';

export default class RbacMongodbRuleAdapter implements RbacRuleAdapter {
  async store(values: RbacRule[]) {
    await RbacRuleModel.deleteMany({});
    return RbacRuleModel.create(values);
  }

  async load() {
    const entries = await RbacRuleModel.find({});
    return entries.map(x => new RbacRule(x));
  }

  async create(name: RbacRule['name']) {
    return RbacRuleModel.create({ name });
  }
}
