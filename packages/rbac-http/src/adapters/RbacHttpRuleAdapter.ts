import { AxiosInstance } from 'axios';

import { RbacRule, RbacRuleAdapter } from '@brainstaff/rbac';

import { rethrow } from '../utils/rethrow';

export default class RbacHttpRuleAdapter implements RbacRuleAdapter {
  private client: AxiosInstance;

  constructor(deps: {
    client: AxiosInstance;
  }) {
    this.client = deps.client;
  }

  async store(values: RbacRule[]) {
    try {
      await this.client.post(`/rbac/rules`, { rbacRules: values });
    } catch (err) {
      rethrow(err);
    }
  }

  async load() {
    try {
      const res = await this.client.get(`/rbac/rules`);
      return res.data.map((x: any) => new RbacRule(x));
    } catch (err) {
      rethrow(err);
    }
  }

  async create(name: RbacRule['name']) {
    try {
      await this.client.post(`/rbac/rules`, { name });
    } catch (err) {
      rethrow(err);
    }
  }

  async find(name: RbacRule['name']) {
    try {
      const res = await this.client.get(`/rbac/rules/${name}`);
      return res.data == null ? null : new RbacRule(res.data);
    } catch (err) {
      rethrow(err);
    }
  }
}
