import { RbacItemChildAdapter } from '@brainstaff/rbac/src/rbac-adapter';
import RbacItemChildModel from '../models/RbacItemChild';
import { RbacItem, RbacItemChild } from '@brainstaff/rbac';

export default class RbacMongodbItemChildAdapter implements RbacItemChildAdapter {
  async store(values: RbacItemChild[]) {
    await RbacItemChildModel.deleteMany({});
    return RbacItemChildModel.create(values);
  }

  async load() {
    const entries = await RbacItemChildModel.find({});
    return entries.map(x => new RbacItemChild(x));
  }

  async create(parent: RbacItem['name'], child: RbacItem['name']) {
    if (await RbacItemChildModel.exists({ parent: parent, child: child })) {
      throw new Error(`Association of ${parent} and ${child} already exists.`);
    }
    return RbacItemChildModel.create({ parent, child });
  }

  async findByParent(parent: RbacItem['name']) {
    const entries = await RbacItemChildModel.find({parent});
    return entries.map(x => new RbacItemChild(x));
  }
}
