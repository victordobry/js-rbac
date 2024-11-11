import RbacItemChild from '../models/RbacItemChild';

export default class RbacMongodbItemChildAdapter {
  constructor() {
  }

  async store(rbacItemChildren: any): Promise<any> {
    await RbacItemChild.deleteMany({});
    return await RbacItemChild.create(rbacItemChildren);
  }

  async load() {
    return await RbacItemChild.find({});
  }

  async create(parent: any, child: any) {
    const currcentItemChild = await RbacItemChild.findOne({ parent: parent, child: child });
    if (currcentItemChild) {
      throw new Error(`Association of ${parent} and ${child} already exists.`);
    }

    return await RbacItemChild.create({ parent, child });
  }

  async findByParent(parent: any) {
    return await RbacItemChild.find({parent});
  }
}
