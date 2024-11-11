import axios from 'axios';

export default class RbacHttpItemChildAdapter {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async store(rbacItemChildren: any[]) {
    try {
      const response = await axios.post(`${this.config.baseUrl}/rbac/item-children`, { rbacItemChildren }, {
        headers: this.config.headers,
        withCredentials: this.config.withCredentials,
      });
      return response.data;
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unknown error.");
      }
    }
  }

  async load() {
    try {
      const response = await axios.get(`${this.config.baseUrl}/rbac/item-children`, {
        headers: this.config.headers,
        withCredentials: this.config.withCredentials,
      });
      return response.data;
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unknown error.");
      }
    }
  }

  async create(parent: any, child: any) {
    try {
      const response = await axios.post(`${this.config.baseUrl}/rbac/item-children`, { parent, child }, {
        headers: this.config.headers,
        withCredentials: this.config.withCredentials,
      });
      return response.data;
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unknown error.");
      }
    }
  }

  async findByParent(parent: any) {
    try {
      const response = await axios.get(`${this.config.baseUrl}/rbac/item-children/${parent}`, {
        headers: this.config.headers,
        withCredentials: this.config.withCredentials,
      });
      return response.data;
    } catch (error: any) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Unknown error.");
      }
    }
  }
}
