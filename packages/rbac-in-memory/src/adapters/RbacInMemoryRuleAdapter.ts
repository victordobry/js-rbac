import { RbacRule, RbacRuleAdapter } from "@brainstaff/rbac";

export default class RbacInMemoryRuleAdapter implements RbacRuleAdapter {
  private entries: RbacRule[] = [];

  async store(values: RbacRule[]) {
    this.entries = values.map(x => new RbacRule(x));
  }

  async load() {
    return this.entries;
  }

  async create(name: RbacRule['name']) {
    if (this.entries.find(x => x.name === name)) {
      throw new Error(`Rule ${name} already exists.`);
    }
    this.entries.push(new RbacRule({ name }));
  }
}
