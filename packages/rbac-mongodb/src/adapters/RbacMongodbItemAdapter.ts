import { RbacItem, RbacItemAdapter, RbacRule } from '@brainstaff/rbac';
import RbacItemModel from '../models/RbacItem';

export default class RbacMongodbItemAdapter implements RbacItemAdapter {
  async store(rbacItems: RbacItem[]) {
    await RbacItemModel.deleteMany({});
    return await RbacItemModel.create(rbacItems);
  }

  async load() {
    return await RbacItemModel.find({});
  }

  async create(name: RbacItem['name'], type: RbacItem['type'], rule?: RbacRule['name']) {
    const currentItem = await RbacItemModel.findOne({ name });
    if (currentItem) {
      throw new Error(`Item ${name} already exists.`);
    }
    return await RbacItemModel.create({ name, type, rule });
  }

  async find(name: RbacItem['name']) {
    return await RbacItemModel.findOne({ name });
  }

  async findByType(type: RbacItem['type']) {
    return await RbacItemModel.find({ type });
  }
}
