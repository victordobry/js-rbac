import RbacRuleModel from '../models/RbacRule';

export default class RbacMongodbRuleAdapter {
  constructor() {
  }

  async store(rbacRules: any[]) {
    await RbacRuleModel.deleteMany({});
    return await RbacRuleModel.create(rbacRules);
  }

  async load() {
    return await RbacRuleModel.find({});
  }

  async create(name: any) {
    return await RbacRuleModel.create({ name });
  }
}
