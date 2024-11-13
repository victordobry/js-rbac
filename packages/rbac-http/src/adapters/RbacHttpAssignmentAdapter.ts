import {AxiosInstance} from 'axios';

import { RbacAssignment, RbacAssignmentAdapter, RbacItem, RbacUserId } from '@brainstaff/rbac';

export default class RbacHttpAssignmentAdapter implements RbacAssignmentAdapter {
  private client: AxiosInstance;

  constructor(deps: {
    client: AxiosInstance;
  }) {
    this.client = deps.client;
  }

  async store(rbacAssignments: RbacAssignment[]) {
    try {
      const response = await this.client.post(`/rbac/assignments`, { rbacAssignments });
      return response.data;
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
      const response = await this.client.get(`/rbac/assignments`);
      return response.data;
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
      const response = await this.client.post(`/rbac/assignments`, { userId, role });
      return response.data;
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
      const response = await this.client.get(`/rbac/assignments/${userId}/${role}`);
      return response.data;
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
      const response = await this.client.get(`/rbac/assignments/${userId}`);
      return response.data;
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
      const response = await this.client.delete(`/rbac/assignments/${userId}/${role}`);
      return response.data;
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
      const response = await this.client.delete(`/rbac/assignments/${userId}`);
      return response.data;
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.toString());
      }
    }
  }
}
