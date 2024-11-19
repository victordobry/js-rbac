import { RbacItem, RbacItemChild, RbacItemChildAdapter } from "@brainstaff/rbac";

export default class RbacInMemoryItemChildAdapter implements RbacItemChildAdapter {
  private entries: RbacItemChild[] = [];

  async store(values: RbacItemChild[]) {
    this.entries = values.map(x => new RbacItemChild(x));
  }

  async load() {
    return this.entries;
  }

  async create(parent: RbacItem['name'], child: RbacItem['name']) {
    if (this.entries.find(x => x.parent === parent && x.child === child)) {
      throw new Error(`Association of ${parent} and ${child} already exists.`);
    }
    this.entries.push(new RbacItemChild({ parent, child }));
  }

  async find(parent: RbacItem['name'], child: RbacItem['name']) {
    return this.entries.find(x => x.parent === parent && x.child === child) ?? null;
  }

  async findByParent(parent: RbacItem['name']) {
    return this.entries.filter(x => x.parent === parent);
  }
}
