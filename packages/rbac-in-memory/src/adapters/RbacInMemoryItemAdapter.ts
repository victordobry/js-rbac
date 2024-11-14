import { RbacItem, RbacItemAdapter, RbacRule } from "@brainstaff/rbac";

export default class RbacInMemoryItemAdapter implements RbacItemAdapter {
  private entries: RbacItem[] = [];

  async store(values: RbacItem[]) {
    this.entries = values.map(x => new RbacItem(x));
  }

  async load() {
    return this.entries;
  }

  async create(name: RbacItem['name'], type: RbacItem['type'], rule?: RbacRule['name']) {
    if (this.entries.find(x => x.name === name)) {
      throw new Error(`Item ${name} already exists.`);
    }
    this.entries.push(new RbacItem({ name, type, rule }));
  }

  async find(name: RbacItem['name']) {
    return this.entries.find(x => x.name === name) ?? null;
  }

  async findByType(type: RbacItem['type']) {
    return this.entries.filter(x => x.type === type);
  }
}
