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
    await RbacRuleModel.query().insert(values);
  }

  async load() {
    const entries = await RbacRuleModel.query();
    return entries.map(x => new RbacRule(x));
  }

  async create(name: RbacRule['name']) {
    if (await RbacRuleModel.query().findById(name)) {
      throw new Error(`Rule ${name} already exists.`);
    }
    await RbacRuleModel.query().insert({ name });
  }

  async find(name: RbacRule['name']) {
    const entry = await RbacRuleModel.query().findById([name]);
    return entry == null ? null : new RbacRule(entry);
  }
}
