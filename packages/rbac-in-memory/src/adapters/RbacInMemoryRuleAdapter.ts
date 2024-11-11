export default class RbacInMemoryRuleAdapter {
  private rbacRules: any[];

  constructor() {
    this.rbacRules = [];
  }

  async store(rbacRules: any[]) {
    this.rbacRules = rbacRules;
  }

  async load() {
    return this.rbacRules;
  }

  async create(name: any) {
    if (this.rbacRules.find(rule => rule.name === name)) {
      throw new Error(`Rule ${name} already exists.`);
    }
    this.rbacRules.push({ name });
  }
}
