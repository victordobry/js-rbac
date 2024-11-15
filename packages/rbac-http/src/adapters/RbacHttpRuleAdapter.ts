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

  @rethrow
  async store(values: RbacRule[]) {
    await this.client.post(`/rbac/rules`, { rbacRules: values });
  }

  @rethrow
  async load() {
    const res = await this.client.get(`/rbac/rules`);
    return res.data.map((x: any) => new RbacRule(x));
  }

  @rethrow
  async create(name: RbacRule['name']) {
    await this.client.post(`/rbac/rules`, { name });
  }

  @rethrow
  async find(name: RbacRule['name']) {
    const res = await this.client.get(`/rbac/rules/${name}`);
    return res.data == null ? null : new RbacRule(res.data);
  }
}
