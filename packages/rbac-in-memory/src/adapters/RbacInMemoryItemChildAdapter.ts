export default class RbacInMemoryItemChildAdapter {
  private rbacItemChildren: any[];

  constructor() {
    this.rbacItemChildren = [];
  }

  async store(rbacItemChildren: any) {
    this.rbacItemChildren = rbacItemChildren;
  }

  async load() {
    return this.rbacItemChildren;
  }

  async create(parent: any, child: any) {
    if (this.rbacItemChildren.find(itemChild => itemChild.parent === parent && itemChild.child === child)) {
      throw new Error(`Association of ${parent} and ${child} already exists.`);
    }
    this.rbacItemChildren.push({ parent, child });
  }

  async findByParent(parent: any) {
    return this.rbacItemChildren.filter(rbacItemChild => rbacItemChild.parent === parent);
  }
}
