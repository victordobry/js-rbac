import { AxiosInstance } from 'axios';

import { RbacItem, RbacItemAdapter, RbacRule } from '@brainstaff/rbac';

import { rethrow } from '../utils/rethrow';

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
    } catch (err) {
      rethrow(err);
    }
  }

  async load() {
    try {
      const res = await this.client.get(`/rbac/items`);
      return res.data.map((x: any) => new RbacItem(x));
    } catch (err) {
      rethrow(err);
    }
  }

  async create(name: RbacItem['name'], type: RbacItem['type'], rule?: RbacRule['name']) {
    try {
      await this.client.post(`/rbac/items`, { name, type, rule });
    } catch (err) {
      rethrow(err);
    }
  }

  async find(name: RbacItem['name']) {
    try {
      const res = await this.client.get(`/rbac/items/${name}`);
      return res.data == null ? null : new RbacItem(res.data);
    } catch (err) {
      rethrow(err);
    }
  }

  async findByType(type: RbacItem['type']) {
    try {
      const res = await this.client.get(`/rbac/items/${type}s`);
      return res.data.map((x: any) => new RbacItem(x));
    } catch (err) {
      rethrow(err);
    }
  }
}
