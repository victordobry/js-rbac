import axios from 'axios';

export default class RbacHttpRuleAdapter {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async store(rbacRules: any[]) {
    try {
      const response = await axios.post(`${this.config.baseUrl}/rbac/rules`, { rbacRules }, {
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
      const response = await axios.get(`${this.config.baseUrl}/rbac/rules`, {
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

  async create(name: any) {
    try {
      const response = await axios.post(`${this.config.baseUrl}/rbac/rules`, { name }, {
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
