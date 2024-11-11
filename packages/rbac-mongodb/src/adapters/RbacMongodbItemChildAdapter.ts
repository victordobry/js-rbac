import RbacItemChildModel from '../models/RbacItemChild';

export default class RbacMongodbItemChildAdapter {
  constructor() {
  }

  async store(rbacItemChildren: any): Promise<any> {
    await RbacItemChildModel.deleteMany({});
    return await RbacItemChildModel.create(rbacItemChildren);
  }

  async load() {
    return await RbacItemChildModel.find({});
  }

  async create(parent: any, child: any) {
    const currcentItemChild = await RbacItemChildModel.findOne({ parent: parent, child: child });
    if (currcentItemChild) {
      throw new Error(`Association of ${parent} and ${child} already exists.`);
    }

    return await RbacItemChildModel.create({ parent, child });
  }

  async findByParent(parent: any) {
    return await RbacItemChildModel.find({parent});
  }
}
