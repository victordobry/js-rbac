import { RbacItem, RbacItemChild, RbacItemChildAdapter } from "@brainstaff/rbac";

export default class RbacInMemoryItemChildAdapter implements RbacItemChildAdapter {
  private rbacItemChildren: RbacItemChild[] = [];

  async store(rbacItemChildren: RbacItemChild[]) {
    this.rbacItemChildren = [...rbacItemChildren];
  }

  async load() {
    return this.rbacItemChildren;
  }

  async create(parent: RbacItem['name'], child: RbacItem['name']) {
    if (this.rbacItemChildren.find(itemChild => itemChild.parent === parent && itemChild.child === child)) {
      throw new Error(`Association of ${parent} and ${child} already exists.`);
    }
    this.rbacItemChildren.push({ parent, child });
  }

  async findByParent(parent: RbacItem['name']) {
    return this.rbacItemChildren.filter(rbacItemChild => rbacItemChild.parent === parent);
  }
}
