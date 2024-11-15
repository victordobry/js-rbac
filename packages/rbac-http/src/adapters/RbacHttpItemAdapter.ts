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

  @rethrow
  async store(values: RbacItem[]) {
    await this.client.post(`/rbac/items`, { rbacItems: values });
  }

  @rethrow
  async load() {
    const res = await this.client.get(`/rbac/items`);
    return res.data.map((x: any) => new RbacItem(x));
  }

  @rethrow
  async create(name: RbacItem['name'], type: RbacItem['type'], rule?: RbacRule['name']) {
    await this.client.post(`/rbac/items`, { name, type, rule });
  }

  @rethrow
  async find(name: RbacItem['name']) {
    const res = await this.client.get(`/rbac/items/${name}`);
    return res.data == null ? null : new RbacItem(res.data);
  }

  @rethrow
  async findByType(type: RbacItem['type']) {
    const res = await this.client.get(`/rbac/items/${type}s`);
    return res.data.map((x: any) => new RbacItem(x));
  }
}
