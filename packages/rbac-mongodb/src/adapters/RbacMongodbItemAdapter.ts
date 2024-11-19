import { RbacItem, RbacItemAdapter, RbacRule } from '@brainstaff/rbac';
import RbacItemModel from '../models/RbacItem';

export default class RbacMongodbItemAdapter implements RbacItemAdapter {
  async store(values: RbacItem[]) {
    await RbacItemModel.deleteMany({});
    await RbacItemModel.create(values);
  }

  async load() {
    const entries = await RbacItemModel.find({});
    return entries.map(x => new RbacItem(x));
  }

  async create(name: RbacItem['name'], type: RbacItem['type'], rule?: RbacRule['name']) {
    if (await RbacItemModel.exists({ name })) {
      throw new Error(`Item ${name} already exists.`);
    }
    await RbacItemModel.create({ name, type, rule });
  }

  async find(name: RbacItem['name']) {
    const entry = await RbacItemModel.findOne({ name });
    return entry == null ? null : new RbacItem(entry);
  }

  async findByType(type: RbacItem['type']) {
    const entry = await RbacItemModel.find({ type });
    return entry.map(x => new RbacItem(x));
  }
}
