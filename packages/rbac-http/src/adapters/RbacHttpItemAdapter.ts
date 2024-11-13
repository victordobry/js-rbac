import { RbacItem, RbacItemAdapter, RbacRule } from '@brainstaff/rbac';
import { AxiosInstance } from 'axios';

export default class RbacHttpItemAdapter implements RbacItemAdapter {
  private client: AxiosInstance;

  constructor(deps: {
    client: AxiosInstance;
  }) {
    this.client = deps.client;
  }

  async store(rbacItems: RbacItem[]) {
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

  async create(name: RbacItem['name'], type: RbacItem['type'], rule?: RbacRule['name']) {
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

  async find(name: RbacItem['name']) {
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

  async findByType(type: RbacItem['type']) {
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
