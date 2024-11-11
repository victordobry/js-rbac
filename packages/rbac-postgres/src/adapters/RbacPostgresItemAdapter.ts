import RbacItem from '../models/RbacItem';

class RbacPostgresItemAdapter {
  async store(rbacItems: any[]) {
    await RbacItem.query().delete();
    const items = await RbacItem.query().insert(rbacItems) as unknown as any[];
    return items.map(assignment => assignment.toJSON());
  }

  async load() {
    const items = await RbacItem.query();
    return items.map(assignment => assignment.toJSON());
  }

  async create(name: any, type: any, rule?: any) {
    let item = await RbacItem.query().findOne({ name });
    if (item) {
      throw new Error(`Item ${name} already exists.`);
    }

    item = await RbacItem.query().insert({ name, type, rule });
    return item && item.toJSON();
  }

  async find(name: any) {
    const item = await RbacItem.query().findById(name);
    return item && item.toJSON();
  }

  async findByType(type: any) {
    const items = await RbacItem.query().where({ type });
    return items.map(item => item.toJSON());
  }
}

export default RbacPostgresItemAdapter;
