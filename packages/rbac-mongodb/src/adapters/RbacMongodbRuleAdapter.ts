import { RbacRule, RbacRuleAdapter } from '@brainstaff/rbac';

import RbacRuleModel from '../models/RbacRule';

export default class RbacMongodbRuleAdapter implements RbacRuleAdapter {
  async store(values: RbacRule[]) {
    await RbacRuleModel.deleteMany({});
    await RbacRuleModel.create(values);
  }

  async load() {
    const entries = await RbacRuleModel.find({});
    return entries.map(x => new RbacRule(x));
  }

  async create(name: RbacRule['name']) {
    await RbacRuleModel.create({ name });
  }

  async find(name: RbacRule['name']) {
    const entry = await RbacRuleModel.findOne({ name });
    return entry == null ? null : new RbacRule(entry);
  }
}
