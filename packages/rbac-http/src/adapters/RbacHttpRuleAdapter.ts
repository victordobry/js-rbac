import { AxiosInstance } from 'axios';

import { RbacRule, RbacRuleAdapter } from '@brainstaff/rbac';

export default class RbacHttpRuleAdapter implements RbacRuleAdapter {
  private client: AxiosInstance;

  constructor(deps: {
    client: AxiosInstance;
  }) {
    this.client = deps.client;
  }

  async store(values: RbacRule[]) {
    try {
      const res = await this.client.post(`/rbac/rules`, { rbacRules: values });
      return res.data;
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unknown error.");
      }
    }
  }

  async load() {
    try {
      const res = await this.client.get(`/rbac/rules`);
      return res.data.map((x: any) => new RbacRule(x));
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unknown error.");
      }
    }
  }

  async create(name: RbacRule['name']) {
    try {
      const res = await this.client.post(`/rbac/rules`, { name });
      return res.data;
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unknown error.");
      }
    }
  }
}
