import { RbacItemChildAdapter } from '@brainstaff/rbac/src/rbac-adapter';
import RbacItemChildModel from '../models/RbacItemChild';
import { RbacItem, RbacItemChild } from '@brainstaff/rbac';

export default class RbacMongodbItemChildAdapter implements RbacItemChildAdapter {
  async store(rbacItemChildren: RbacItemChild[]) {
    await RbacItemChildModel.deleteMany({});
    return await RbacItemChildModel.create(rbacItemChildren);
  }

  async load() {
    return await RbacItemChildModel.find({});
  }

  async create(parent: RbacItem['name'], child: RbacItem['name']) {
    const currcentItemChild = await RbacItemChildModel.findOne({ parent: parent, child: child });
    if (currcentItemChild) {
      throw new Error(`Association of ${parent} and ${child} already exists.`);
    }
    return await RbacItemChildModel.create({ parent, child });
  }

  async findByParent(parent: RbacItem['name']) {
    return await RbacItemChildModel.find({parent});
  }
}
