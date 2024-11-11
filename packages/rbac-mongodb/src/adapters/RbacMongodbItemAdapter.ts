import RbacItemModel from '../models/RbacItem';

export default class RbacMongodbItemAdapter {
  constructor() {
  }

  async store(rbacItems: any[]) {
    await RbacItemModel.deleteMany({});
    return await RbacItemModel.create(rbacItems);
  }

  async load() {
    return await RbacItemModel.find({});
  }

  async create(name: any, type: any, rule?: any) {
    const currentItem = await RbacItemModel.findOne({ name });
    if (currentItem) {
      throw new Error(`Item ${name} already exists.`);
    }

    return await RbacItemModel.create({ name, type, rule });
  }

  async find(name: any) {
    return await RbacItemModel.findOne({ name });
  }

  async findByType(type: any) {
    return await RbacItemModel.find({ type });
  }
}
