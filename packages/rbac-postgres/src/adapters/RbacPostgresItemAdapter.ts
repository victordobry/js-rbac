import { Knex } from 'knex';

import RbacItemModel from '../models/RbacItem';
import { RbacItem, RbacItemAdapter, RbacRule } from '@brainstaff/rbac';

export default class RbacPostgresItemAdapter implements RbacItemAdapter {
  constructor(deps: {
    client: Knex
  }) {
    RbacItemModel.knex(deps.client);
  }

  async store(rbacItems: RbacItem[]) {
    await RbacItemModel.query().delete();
    const items = await RbacItemModel.query().insert(rbacItems);
    return items.map(assignment => assignment.toJSON());
  }

  async load() {
    const items = await RbacItemModel.query();
    return items.map(assignment => assignment.toJSON());
  }

  async create(name: RbacItem['name'], type: RbacItem['type'], rule?: RbacRule['name']) {
    let item = await RbacItemModel.query().findOne({ name });
    if (item) {
      throw new Error(`Item ${name} already exists.`);
    }
    item = await RbacItemModel.query().insert({ name, type, rule });
    return item && item.toJSON();
  }

  async find(name: RbacItem['name']) {
    const item = await RbacItemModel.query().findById(name);
    return item && item.toJSON();
  }

  async findByType(type: RbacItem['type']) {
    const items = await RbacItemModel.query().where({ type });
    return items.map(item => item.toJSON());
  }
}
