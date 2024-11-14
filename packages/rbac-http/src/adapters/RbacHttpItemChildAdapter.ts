import { AxiosInstance } from 'axios';

import { RbacItem, RbacItemChild, RbacItemChildAdapter } from '@brainstaff/rbac';

export default class RbacHttpItemChildAdapter implements RbacItemChildAdapter {
  private client: AxiosInstance;

  constructor(deps: {
    client: AxiosInstance;
  }) {
    this.client = deps.client;
  }

  async store(values: RbacItemChild[]) {
    try {
      await this.client.post(`/rbac/item-children`, { rbacItemChildren: values });
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
      const res = await this.client.get(`/rbac/item-children`);
      return res.data.map((x: any) => new RbacItemChild(x));
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
      await this.client.post(`/rbac/item-children`, { parent, child });
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unknown error.");
      }
    }
  }

  async find(parent: RbacItem['name'], child: RbacItem['name']) {
    try {
      const res = await this.client.get(`/rbac/item-children/${parent}/${child}`);
      return res.data == null ? null : new RbacItemChild(res.data);
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
      const res = await this.client.get(`/rbac/item-children/${parent}`);
      return res.data.map((x: any) => new RbacItemChild(x));
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unknown error.");
      }
    }
  }
}
