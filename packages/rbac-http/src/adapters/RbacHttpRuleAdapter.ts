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
      await this.client.post(`/rbac/rules`, { rbacRules: values });
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
      await this.client.post(`/rbac/rules`, { name });
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unknown error.");
      }
    }
  }

  async find(name: RbacRule['name']) {
    try {
      const res = await this.client.get(`/rbac/rules/${name}`);
      return res.data == null ? null : new RbacRule(res.data);
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.toString());
      }
    }
  }
}
