import { Knex } from 'knex';

import { RbacRule, RbacRuleAdapter } from '@brainstaff/rbac';

import RbacRuleModel from '../models/RbacRule';

export default class RbacPostgresRuleAdapter implements RbacRuleAdapter {
  constructor(deps: {
    client: Knex
  }) {
    RbacRuleModel.knex(deps.client);
  }

  async store(values: RbacRule[]) {
    await RbacRuleModel.query().delete();
    const entries = await RbacRuleModel.query().insert(values);
    return entries.map(x => x.toJSON());
  }

  async load() {
    const entries = await RbacRuleModel.query();
    return entries.map(x => new RbacRule(x));
  }

  async create(name: RbacRule['name']) {
    if (await RbacRuleModel.query().findById(name)) {
      throw new Error(`Rule ${name} already exists.`);
    }
    const entry = await RbacRuleModel.query().insert({ name });
    return entry.toJSON();
  }
}
