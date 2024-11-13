import { Knex } from 'knex';

import { RbacItem, RbacItemChild, RbacItemChildAdapter } from '@brainstaff/rbac';

import RbacItemChildModel from '../models/RbacItemChild';

class RbacPostgresItemChildAdapter implements RbacItemChildAdapter {
  constructor(deps: {
    client: Knex
  }) {
    RbacItemChildModel.knex(deps.client);
  }
  
  async store(rbacItemChildren: RbacItemChild[]) {
    await RbacItemChildModel.query().delete();
    const itemChildren = await RbacItemChildModel.query().insert(rbacItemChildren);
    return itemChildren.map(itemChild => itemChild.toJSON());
  }

  async load() {
    const itemChildren = await RbacItemChildModel.query();
    return itemChildren.map(itemChild => itemChild.toJSON());
  }

  async create(parent: RbacItem['name'], child: RbacItem['name']) {
    let itemChild = await RbacItemChildModel.query().findById([parent, child]);
    if (itemChild) {
      throw new Error(`Association of ${parent} and ${child} already exists.`);
    }
    itemChild = await RbacItemChildModel.query().insert({ parent, child });
    return itemChild && itemChild.toJSON();
  }

  async findByParent(parent: RbacItem['name']) {
    const itemChildren = await RbacItemChildModel.query().where({ parent });
    return itemChildren.map(itemChild => itemChild.toJSON());
  }
}

export default RbacPostgresItemChildAdapter;
