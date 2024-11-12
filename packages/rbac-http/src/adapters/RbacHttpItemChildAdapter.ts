import { AxiosInstance } from 'axios';
import { RbacHttpConfig } from '../RbacHttpAdapter';

export default class RbacHttpItemChildAdapter {
  private client: AxiosInstance;

  constructor({ client }: RbacHttpConfig) {
    this.client = client;
  }

  async store(rbacItemChildren: any[]) {
    try {
      const response = await this.client.post(`/rbac/item-children`, { rbacItemChildren });
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
      const response = await this.client.get(`/rbac/item-children`);
      return response.data;
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unknown error.");
      }
    }
  }

  async create(parent: any, child: any) {
    try {
      const response = await this.client.post(`/rbac/item-children`, { parent, child });
      return response.data;
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unknown error.");
      }
    }
  }

  async findByParent(parent: any) {
    try {
      const response = await this.client.get(`/rbac/item-children/${parent}`);
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
