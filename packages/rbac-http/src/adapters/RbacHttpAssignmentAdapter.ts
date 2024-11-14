import {AxiosInstance} from 'axios';

import { RbacAssignment, RbacAssignmentAdapter, RbacItem, RbacUserId } from '@brainstaff/rbac';

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
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.toString());
      }
    }
  }

  async load() {
    try {
      const res = await this.client.get(`/rbac/assignments`);
      return res.data.map((x: any) => new RbacAssignment(x));
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.toString());
      }
    }
  }

  async create(userId: RbacUserId, role: RbacItem['name']) {
    try {
      await this.client.post(`/rbac/assignments`, { userId, role });
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.toString());
      }
    }
  }

  async find(userId: RbacUserId, role: RbacItem['name']) {
    try {
      const res = await this.client.get(`/rbac/assignments/${userId}/${role}`);
      return res.data == null ? null : new RbacAssignment(res.data);
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.toString());
      }
    }
  }

  async findByUserId(userId: RbacUserId) {
    try {
      const res = await this.client.get(`/rbac/assignments/${userId}`);
      return res.data.map((x: any) => new RbacAssignment(x));
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.toString());
      }
    }
  }

  async delete(userId: RbacUserId, role: RbacItem['name']) {
    try {
      await this.client.delete(`/rbac/assignments/${userId}/${role}`);
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.toString());
      }
    }
  }

  async deleteByUser(userId: RbacUserId) {
    try {
      await this.client.delete(`/rbac/assignments/${userId}`);
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.toString());
      }
    }
  }
}
