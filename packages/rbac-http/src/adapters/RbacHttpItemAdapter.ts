import { AxiosInstance } from 'axios';

import { RbacItem, RbacItemAdapter, RbacRule } from '@brainstaff/rbac';

export default class RbacHttpItemAdapter implements RbacItemAdapter {
  private client: AxiosInstance;

  constructor(deps: {
    client: AxiosInstance;
  }) {
    this.client = deps.client;
  }

  async store(values: RbacItem[]) {
    try {
      await this.client.post(`/rbac/items`, { rbacItems: values });
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
      const res = await this.client.get(`/rbac/items`);
      return res.data.map((x: any) => new RbacItem(x));
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
      await this.client.post(`/rbac/items`, { name, type, rule });
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
      const res = await this.client.get(`/rbac/items/${name}`);
      return res.data == null ? null : new RbacItem(res.data);
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
      const res = await this.client.get(`/rbac/items/${type}s`);
      return res.data.map((x: any) => new RbacItem(x));
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unknown error.");
      }
    }
  }
}
