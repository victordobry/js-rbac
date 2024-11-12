import { RbacPostgresConfig } from '../RbacPostgresAdapter';
import RbacItemChildModel from '../models/RbacItemChild';

class RbacPostgresItemChildAdapter {
  constructor({ client }: RbacPostgresConfig) {
    RbacItemChildModel.knex(client);
  }
  
  async store(rbacItemChildren: any[]) {
    await RbacItemChildModel.query().delete();
    const itemChildren = await RbacItemChildModel.query().insert(rbacItemChildren) as unknown as any[];
    return itemChildren.map(itemChild => itemChild.toJSON());
  }

  async load() {
    const itemChildren = await RbacItemChildModel.query();
    return itemChildren.map(itemChild => itemChild.toJSON());
  }

  async create(parent: any, child: any) {
    let itemChild = await RbacItemChildModel.query().findById([parent, child]);
    if (itemChild) {
      throw new Error(`Association of ${parent} and ${child} already exists.`);
    }

    itemChild = await RbacItemChildModel.query().insert({ parent, child });
    return itemChild && itemChild.toJSON();
  }

  async findByParent(parent: any) {
    const itemChildren = await RbacItemChildModel.query().where({ parent });
    return itemChildren.map(itemChild => itemChild.toJSON());
  }
}

export default RbacPostgresItemChildAdapter;
