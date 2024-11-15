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

  @rethrow
  async store(values: RbacItemChild[]) {
    await this.client.post(`/rbac/item-children`, { rbacItemChildren: values });
  }

  @rethrow
  async load() {
    const res = await this.client.get(`/rbac/item-children`);
    return res.data.map((x: any) => new RbacItemChild(x));
  }

  @rethrow
  async create(parent: RbacItem['name'], child: RbacItem['name']) {
    await this.client.post(`/rbac/item-children`, { parent, child });
  }

  @rethrow
  async find(parent: RbacItem['name'], child: RbacItem['name']) {
    const res = await this.client.get(`/rbac/item-children/${parent}/${child}`);
    return res.data == null ? null : new RbacItemChild(res.data);
  }

  @rethrow
  async findByParent(parent: RbacItem['name']) {
    const res = await this.client.get(`/rbac/item-children/${parent}`);
    return res.data.map((x: any) => new RbacItemChild(x));
  }
}
