import { Knex } from 'knex';

import { RbacRule, RbacRuleAdapter } from '@brainstaff/rbac';

import RbacRuleModel from '../models/RbacRule';

export default class RbacPostgresRuleAdapter implements RbacRuleAdapter {
  constructor(deps: {
    client: Knex
  }) {
    RbacRuleModel.knex(deps.client);
  }

  async store(rbacRules: RbacRule[]) {
    await RbacRuleModel.query().delete();
    const rules = await RbacRuleModel.query().insert(rbacRules);
    return rules.map(rule => rule.toJSON());
  }

  async load() {
    const rules = await RbacRuleModel.query();
    return rules.map(rule => rule.toJSON());
  }

  async create(name: RbacRule['name']) {
    let rule = await RbacRuleModel.query().findById(name);
    if (rule) {
      throw new Error(`Rule ${name} already exists.`);
    }
    rule = await RbacRuleModel.query().insert({ name });
    return rule && rule.toJSON();
  }
}
