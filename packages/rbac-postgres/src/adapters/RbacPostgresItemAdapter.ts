import { Knex } from 'knex';

import { RbacItem, RbacItemAdapter, RbacRule } from '@brainstaff/rbac';

import RbacItemModel from '../models/RbacItem';
import { toRbacItem } from '../utils/mappers';

export default class RbacPostgresItemAdapter implements RbacItemAdapter {
  constructor(deps: {
    client: Knex
  }) {
    RbacItemModel.knex(deps.client);
  }

  async store(values: RbacItem[]) {
    await RbacItemModel.query().delete();
    await RbacItemModel.query().insert(values);
  }

  async load() {
    const entries = await RbacItemModel.query();
    return entries.map(toRbacItem);
  }

  async create(name: RbacItem['name'], type: RbacItem['type'], rule?: RbacRule['name']) {
    if (await RbacItemModel.query().findOne({ name })) {
      throw new Error(`Item ${name} already exists.`);
    }
    await RbacItemModel.query().insert({ name, type, rule });
  }

  async find(name: RbacItem['name']) {
    const value = await RbacItemModel.query().findById([name]);
    return value == null ? null : toRbacItem(value);
  }

  async findByType(type: RbacItem['type']) {
    const entries = await RbacItemModel.query().where({ type });
    return entries.map(toRbacItem);
  }
}
