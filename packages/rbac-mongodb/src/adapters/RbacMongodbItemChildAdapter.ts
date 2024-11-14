import { RbacItemChildAdapter } from '@brainstaff/rbac/src/rbac-adapter';
import RbacItemChildModel from '../models/RbacItemChild';
import { RbacItem, RbacItemChild } from '@brainstaff/rbac';

export default class RbacMongodbItemChildAdapter implements RbacItemChildAdapter {
  async store(values: RbacItemChild[]) {
    await RbacItemChildModel.deleteMany({});
    await RbacItemChildModel.create(values);
  }

  async load() {
    const entries = await RbacItemChildModel.find({});
    return entries.map(x => new RbacItemChild(x));
  }

  async create(parent: RbacItem['name'], child: RbacItem['name']) {
    if (await RbacItemChildModel.exists({ parent: parent, child: child })) {
      throw new Error(`Association of ${parent} and ${child} already exists.`);
    }
    await RbacItemChildModel.create({ parent, child });
  }

  async find(parent: RbacItem['name'], child: RbacItem['name']) {
    const entry = await RbacItemChildModel.findOne({ parent, child });
    return entry == null ? null : new RbacItemChild(entry);
  }

  async findByParent(parent: RbacItem['name']) {
    const entries = await RbacItemChildModel.find({parent});
    return entries.map(x => new RbacItemChild(x));
  }
}
