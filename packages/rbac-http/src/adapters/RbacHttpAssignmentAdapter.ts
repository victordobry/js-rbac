import {AxiosInstance} from 'axios';

import { RbacUserId } from '@brainstaff/rbac';

export default class RbacHttpAssignmentAdapter {
  private client: AxiosInstance;

  constructor(deps: {
    client: AxiosInstance;
  }) {
    this.client = deps.client;
  }

  async store(rbacAssignments: any[]) {
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

  async create(userId: RbacUserId, role: any) {
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

  async find(userId: RbacUserId, role: any) {
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

  async delete(userId: RbacUserId, role: any) {
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
