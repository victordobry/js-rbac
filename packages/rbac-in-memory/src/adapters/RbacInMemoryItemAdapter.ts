import { RbacItem, RbacItemAdapter, RbacRule } from "@brainstaff/rbac";

export default class RbacInMemoryItemAdapter implements RbacItemAdapter {
  private rbacItems: RbacItem[] = [];

  async store(rbacItems: RbacItem[]) {
    this.rbacItems = [...rbacItems];
  }

  async load() {
    return this.rbacItems;
  }

  async create(name: RbacItem['name'], type: RbacItem['type'], rule?: RbacRule['name']) {
    if (this.rbacItems.find(item => item.name === name)) {
      throw new Error(`Item ${name} already exists.`);
    }
    this.rbacItems.push({ name, type, rule });
  }

  async find(name: RbacItem['name']) {
    return this.rbacItems.find(rbacItem => rbacItem.name === name);
  }

  async findByType(type: RbacItem['type']) {
    return this.rbacItems.filter(rbacItem => rbacItem.type === type);
  }
}
