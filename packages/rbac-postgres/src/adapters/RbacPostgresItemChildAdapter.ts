import { Knex } from 'knex';

import { RbacItem, RbacItemChild, RbacItemChildAdapter } from '@brainstaff/rbac';

import RbacItemChildModel from '../models/RbacItemChild';

export default class RbacPostgresItemChildAdapter implements RbacItemChildAdapter {
  constructor(deps: {
    client: Knex
  }) {
    RbacItemChildModel.knex(deps.client);
  }
  
  async store(values: RbacItemChild[]) {
    await RbacItemChildModel.query().delete();
    const entries = await RbacItemChildModel.query().insert(values);
    return entries.map(x => x.toJSON());
  }

  async load() {
    const entries = await RbacItemChildModel.query();
    return entries.map(x => new RbacItemChild(x));
  }

  async create(parent: RbacItem['name'], child: RbacItem['name']) {
    if (await RbacItemChildModel.query().findById([parent, child])) {
      throw new Error(`Association of ${parent} and ${child} already exists.`);
    }
    const entry = await RbacItemChildModel.query().insert({ parent, child });
    return entry.toJSON();
  }

  async findByParent(parent: RbacItem['name']) {
    const entries = await RbacItemChildModel.query().where({ parent });
    return entries.map(x => new RbacItemChild(x));
  }
}
