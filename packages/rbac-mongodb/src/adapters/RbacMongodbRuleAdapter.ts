import RbacRule from '../models/RbacRule';

export default class RbacMongodbRuleAdapter {
  constructor() {
  }

  async store(rbacRules: any[]) {
    await RbacRule.deleteMany({});
    return await RbacRule.create(rbacRules);
  }

  async load() {
    return await RbacRule.find({});
  }

  async create(name: any) {
    return await RbacRule.create({ name });
  }
}
