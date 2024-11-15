import { AxiosInstance } from 'axios';

import { RbacItem, RbacItemChild, RbacItemChildAdapter } from '@brainstaff/rbac';

import { rethrow } from '../utils/rethrow';

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
    } catch (err) {
      rethrow(err);
    }
  }

  async load() {
    try {
      const res = await this.client.get(`/rbac/item-children`);
      return res.data.map((x: any) => new RbacItemChild(x));
    } catch (err) {
      rethrow(err);
    }
  }

  async create(parent: RbacItem['name'], child: RbacItem['name']) {
    try {
      await this.client.post(`/rbac/item-children`, { parent, child });
    } catch (err) {
      rethrow(err);
    }
  }

  async find(parent: RbacItem['name'], child: RbacItem['name']) {
    try {
      const res = await this.client.get(`/rbac/item-children/${parent}/${child}`);
      return res.data == null ? null : new RbacItemChild(res.data);
    } catch (err) {
      rethrow(err);
    }
  }

  async findByParent(parent: RbacItem['name']) {
    try {
      const res = await this.client.get(`/rbac/item-children/${parent}`);
      return res.data.map((x: any) => new RbacItemChild(x));
    } catch (err) {
      rethrow(err);
    }
  }
}
