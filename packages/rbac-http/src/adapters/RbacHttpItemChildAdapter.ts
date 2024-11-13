import { AxiosInstance } from 'axios';

import { RbacItem, RbacItemChild, RbacItemChildAdapter } from '@brainstaff/rbac';

export default class RbacHttpItemChildAdapter implements RbacItemChildAdapter {
  private client: AxiosInstance;

  constructor(deps: {
    client: AxiosInstance;
  }) {
    this.client = deps.client;
  }

  async store(rbacItemChildren: RbacItemChild[]) {
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

  async create(parent: RbacItem['name'], child: RbacItem['name']) {
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

  async findByParent(parent: RbacItem['name']) {
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
