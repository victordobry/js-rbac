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

  async store(values: RbacAssignment[]) {
    try {
      await this.client.post(`/rbac/assignments`, { rbacAssignments: values });
    } catch (err) {
      rethrow(err);
    }
  }

  async load() {
    try {
      const res = await this.client.get(`/rbac/assignments`);
      return res.data.map((x: any) => new RbacAssignment(x));
    } catch (err) {
      rethrow(err);
    }
  }

  async create(userId: RbacUserId, role: RbacItem['name']) {
    try {
      await this.client.post(`/rbac/assignments`, { userId, role });
    } catch (err) {
      rethrow(err);
    }
  }

  async find(userId: RbacUserId, role: RbacItem['name']) {
    try {
      const res = await this.client.get(`/rbac/assignments/${userId}/${role}`);
      return res.data == null ? null : new RbacAssignment(res.data);
    } catch (err) {
      rethrow(err);
    }
  }

  async findByUserId(userId: RbacUserId) {
    try {
      const res = await this.client.get(`/rbac/assignments/${userId}`);
      return res.data.map((x: any) => new RbacAssignment(x));
    } catch (err) {
      rethrow(err);
    }
  }

  async delete(userId: RbacUserId, role: RbacItem['name']) {
    try {
      await this.client.delete(`/rbac/assignments/${userId}/${role}`);
    } catch (err) {
      rethrow(err);
    }
  }

  async deleteByUser(userId: RbacUserId) {
    try {
      await this.client.delete(`/rbac/assignments/${userId}`);
    } catch (err) {
      rethrow(err);
    }
  }
}
