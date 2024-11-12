import { AxiosInstance } from 'axios';
import { RbacHttpConfig } from '../RbacHttpAdapter';

export default class RbacHttpRuleAdapter {
  private client: AxiosInstance;

  constructor({ client }: RbacHttpConfig) {
    this.client = client;
  }

  async store(rbacRules: any[]) {
    try {
      const response = await this.client.post(`/rbac/rules`, { rbacRules });
      return response.data;
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
      const response = await this.client.get(`/rbac/rules`);
      return response.data;
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unknown error.");
      }
    }
  }

  async create(name: any) {
    try {
      const response = await this.client.post(`/rbac/rules`, { name });
      return response.data;
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unknown error.");
      }
    }
  }
}
