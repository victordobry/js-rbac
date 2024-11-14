import { Knex } from 'knex';

import RbacItemModel from '../models/RbacItem';
import { RbacItem, RbacItemAdapter, RbacRule } from '@brainstaff/rbac';

export default class RbacPostgresItemAdapter implements RbacItemAdapter {
  constructor(deps: {
    client: Knex
  }) {
    RbacItemModel.knex(deps.client);
  }

  async store(values: RbacItem[]) {
    await RbacItemModel.query().delete();
    const entries = await RbacItemModel.query().insert(values);
    return entries.map(x => x.toJSON());
  }

  async load() {
    const entries = await RbacItemModel.query();
    return entries.map(x => new RbacItem(x));
  }

  async create(name: RbacItem['name'], type: RbacItem['type'], rule?: RbacRule['name']) {
    if (await RbacItemModel.query().findOne({ name })) {
      throw new Error(`Item ${name} already exists.`);
    }
    const entry = await RbacItemModel.query().insert({ name, type, rule });
    return entry.toJSON();
  }

  async find(name: RbacItem['name']) {
    const value = await RbacItemModel.query().findById(name);
    return value == null ? null : new RbacItem(value);
  }

  async findByType(type: RbacItem['type']) {
    const entries = await RbacItemModel.query().where({ type });
    return entries.map(x => new RbacItem(x));
  }
}
