export default class RbacInMemoryItemAdapter {
  private rbacItems: any[];

  constructor() {
    this.rbacItems = [];
  }

  async store(rbacItems: any) {
    this.rbacItems = rbacItems;
  }

  async load() {
    return this.rbacItems;
  }

  async create(name: any, type: any, rule: any) {
    if (this.rbacItems.find(item => item.name === name)) {
      throw new Error(`Item ${name} already exists.`);
    }
    this.rbacItems.push({ name, type, rule });
  }

  async find(name: any) {
    return this.rbacItems.find(rbacItem => rbacItem.name === name);
  }

  async findByType(type: any) {
    return this.rbacItems.filter(rbacItem => rbacItem.type === type);
  }
}
