import { Knex } from 'knex';

import RbacRuleModel from '../models/RbacRule';

class RbacPostgresRuleAdapter {
  constructor(deps: {
    client: Knex
  }) {
    RbacRuleModel.knex(deps.client);
  }

  async store(rbacRules: any[]) {
    await RbacRuleModel.query().delete();
    const rules = await RbacRuleModel.query().insert(rbacRules) as unknown as any[];
    return rules.map(rule => rule.toJSON());
  }

  async load() {
    const rules = await RbacRuleModel.query();
    return rules.map(rule => rule.toJSON());
  }

  async create(name: any) {
    let rule = await RbacRuleModel.query().findById(name);
    if (rule) {
      throw new Error(`Rule ${name} already exists.`);
    }
    rule = await RbacRuleModel.query().insert({ name });
    return rule && rule.toJSON();
  }
}

export default RbacPostgresRuleAdapter;
