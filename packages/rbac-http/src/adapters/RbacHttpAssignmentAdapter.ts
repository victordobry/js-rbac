import {AxiosInstance} from 'axios';

import { RbacAssignment, RbacAssignmentAdapter, RbacItem, RbacUserId } from '@brainstaff/rbac';

import { rethrow } from '../utils/rethrow';

export default class RbacHttpAssignmentAdapter implements RbacAssignmentAdapter {
  private client: AxiosInstance;

  constructor(deps: {
    client: AxiosInstance;
  }) {
    this.client = deps.client;
  }

  @rethrow
  async store(values: RbacAssignment[]) {
    await this.client.post(`/rbac/assignments`, { rbacAssignments: values });
  }

  @rethrow
  async load() {
    const res = await this.client.get(`/rbac/assignments`);
    return res.data.map((x: any) => new RbacAssignment(x));
  }

  @rethrow
  async create(userId: RbacUserId, role: RbacItem['name']) {
    await this.client.post(`/rbac/assignments`, { userId, role });
  }

  @rethrow
  async find(userId: RbacUserId, role: RbacItem['name']) {
    const res = await this.client.get(`/rbac/assignments/${userId}/${role}`);
    return res.data == null ? null : new RbacAssignment(res.data);
  }

  @rethrow
  async findByUserId(userId: RbacUserId) {
    const res = await this.client.get(`/rbac/assignments/${userId}`);
    return res.data.map((x: any) => new RbacAssignment(x));
  }

  @rethrow
  async delete(userId: RbacUserId, role: RbacItem['name']) {
    await this.client.delete(`/rbac/assignments/${userId}/${role}`);
  }

  @rethrow
  async deleteByUser(userId: RbacUserId) {
    await this.client.delete(`/rbac/assignments/${userId}`);
  }
}
