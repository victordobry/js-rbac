import axios from 'axios';

import { RbacUserId } from '@brainstaff/rbac';

export default class RbacHttpAssignmentAdapter {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async store(rbacAssignments: any[]) {
    try {
      const response = await axios.post(`${this.config.baseUrl}/rbac/assignments`, { rbacAssignments }, {
        headers: this.config.headers,
        withCredentials: this.config.withCredentials,
      });
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
      const response = await axios.get(`${this.config.baseUrl}/rbac/assignments`, {
        headers: this.config.headers,
        withCredentials: this.config.withCredentials,
      });
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
      const response = await axios.post(`${this.config.baseUrl}/rbac/assignments`, { userId, role }, {
        headers: this.config.headers,
        withCredentials: this.config.withCredentials,
      });
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
      const response = await axios.get(`${this.config.baseUrl}/rbac/assignments/${userId}/${role}`, {
        headers: this.config.headers,
        withCredentials: this.config.withCredentials,
      });
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
      const response = await axios.get(`${this.config.baseUrl}/rbac/assignments/${userId}`, {
        headers: this.config.headers,
        withCredentials: this.config.withCredentials,
      });
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
      const response = await axios.delete(`${this.config.baseUrl}/rbac/assignments/${userId}/${role}`, {
        headers: this.config.headers,
        withCredentials: this.config.withCredentials,
      });
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
      const response = await axios.delete(`${this.config.baseUrl}/rbac/assignments/${userId}`, {
        headers: this.config.headers,
        withCredentials: this.config.withCredentials,
      });
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
