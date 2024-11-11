import RbacItem from '../models/RbacItem';

export default class RbacMongodbItemAdapter {
  constructor() {
  }

  async store(rbacItems: any[]) {
    await RbacItem.deleteMany({});
    return await RbacItem.create(rbacItems);
  }

  async load() {
    return await RbacItem.find({});
  }

  async create(name: any, type: any, rule?: any) {
    const currentItem = await RbacItem.findOne({ name });
    if (currentItem) {
      throw new Error(`Item ${name} already exists.`);
    }

    return await RbacItem.create({ name, type, rule });
  }

  async find(name: any) {
    return await RbacItem.findOne({ name });
  }

  async findByType(type: any) {
    return await RbacItem.find({ type });
  }
}
