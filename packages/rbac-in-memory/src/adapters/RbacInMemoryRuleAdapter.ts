import { RbacRule, RbacRuleAdapter } from "@brainstaff/rbac";

export default class RbacInMemoryRuleAdapter implements RbacRuleAdapter {
  private rbacRules: RbacRule[] = [];

  async store(rbacRules: RbacRule[]) {
    this.rbacRules = [...rbacRules];
  }

  async load() {
    return this.rbacRules;
  }

  async create(name: RbacRule['name']) {
    if (this.rbacRules.find(rule => rule.name === name)) {
      throw new Error(`Rule ${name} already exists.`);
    }
    this.rbacRules.push({ name });
  }
}
