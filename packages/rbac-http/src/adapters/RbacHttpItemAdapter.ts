import { AxiosInstance } from 'axios';
import { RbacHttpConfig } from '../RbacHttpAdapter';

export default class RbacHttpItemAdapter {
  private client: AxiosInstance;

  constructor({ client }: RbacHttpConfig) {
    this.client = client;
  }

  async store(rbacItems: any[]) {
    try {
      const response = await this.client.post(`/rbac/items`, { rbacItems });
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
      const response = await this.client.get(`/rbac/items`);
      return response.data;
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unknown error.");
      }
    }
  }

  async create(name: any, type: any, rule: any) {
    try {
      const response = await this.client.post(`/rbac/items`, { name, type, rule });
      return response.data;
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unknown error.");
      }
    }
  }

  async find(name: any) {
    try {
      const response = await this.client.get(`/rbac/items/${name}`);
      return response.data;
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unknown error.");
      }
    }
  }

  async findByType(type: any) {
    try {
      const response = await this.client.get(`/rbac/items/${type}s`);
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
