import { RbacPostgresConfig } from '../RbacPostgresAdapter';
import RbacItemModel from '../models/RbacItem';

class RbacPostgresItemAdapter {
  constructor({ client }: RbacPostgresConfig) {
    RbacItemModel.knex(client);
  }

  async store(rbacItems: any[]) {
    await RbacItemModel.query().delete();
    const items = await RbacItemModel.query().insert(rbacItems) as unknown as any[];
    return items.map(assignment => assignment.toJSON());
  }

  async load() {
    const items = await RbacItemModel.query();
    return items.map(assignment => assignment.toJSON());
  }

  async create(name: any, type: any, rule?: any) {
    let item = await RbacItemModel.query().findOne({ name });
    if (item) {
      throw new Error(`Item ${name} already exists.`);
    }

    item = await RbacItemModel.query().insert({ name, type, rule });
    return item && item.toJSON();
  }

  async find(name: any) {
    const item = await RbacItemModel.query().findById(name);
    return item && item.toJSON();
  }

  async findByType(type: any) {
    const items = await RbacItemModel.query().where({ type });
    return items.map(item => item.toJSON());
  }
}

export default RbacPostgresItemAdapter;
