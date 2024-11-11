import { RbacUserId } from '@brainstaff/rbac';

import RbacInMemoryAssignmentAdapter from './adapters/RbacInMemoryAssignmentAdapter';
import RbacInMemoryItemAdapter from './adapters/RbacInMemoryItemAdapter';
import RbacInMemoryItemChildAdapter from './adapters/RbacInMemoryItemChildAdapter';
import RbacInMemoryRuleAdapter from './adapters/RbacInMemoryRuleAdapter';

export default class RbacInMemoryAdapter {
  private assignmentAdapter: any;
  private itemAdapter: any;
  private itemChildAdapter: any;
  private ruleAdapter: any;

  constructor() {
    this.assignmentAdapter = new RbacInMemoryAssignmentAdapter();
    this.itemAdapter = new RbacInMemoryItemAdapter();
    this.itemChildAdapter = new RbacInMemoryItemChildAdapter();
    this.ruleAdapter = new RbacInMemoryRuleAdapter();
  }

  /**
   * To be used with `@brainstaff/injector`.
   */
  get dependencies(): string[] {
    return [];
  }

  async store(rbacHierarchy: any) {
    await this.assignmentAdapter.store([...rbacHierarchy.rbacAssignments]);
    await this.itemAdapter.store([...rbacHierarchy.rbacItems]);
    await this.itemChildAdapter.store([...rbacHierarchy.rbacItemChildren]);
    await this.ruleAdapter.store([...rbacHierarchy.rbacRules]);
  }

  async load() {
    return {
      rbacAssignments: await this.assignmentAdapter.load(),
      rbacItems: await this.itemAdapter.load(),
      rbacItemChildren: await this.itemChildAdapter.load(),
      rbacRules: await this.ruleAdapter.load()
    };
  }

  async findAllAssignments() {
    return await this.assignmentAdapter.load();
  }

  async findAllItems() {
    return await this.itemAdapter.load();
  }

  async findAllItemsChild() {
    return await this.itemChildAdapter.load();
  }

  async findAllRules() {
    return await this.ruleAdapter.load();
  }

  // Core for checkAccess

  async findAssignmentsByUserId(userId: RbacUserId) {
    return await this.assignmentAdapter.findByUserId(userId);
  }

  async findItem(name: any) {
    return await this.itemAdapter.find(name);
  }

  async findItemChildrenByParent(name: any) {
    return await this.itemChildAdapter.findByParent(name);
  }

  // Core for management

  async createAssignment(userId: RbacUserId, role: any) {
    return await this.assignmentAdapter.create(userId, role);
  }

  async findAssignment(userId: RbacUserId, role: any) {
    return await this.assignmentAdapter.find(userId, role);
  }

  async findRoles() {
    return await this.itemAdapter.findByType('role');
  }

  async deleteAssignment(userId: RbacUserId, role: any) {
    if (role) {
      return await this.assignmentAdapter.delete(userId, role);
    }

    return await this.assignmentAdapter.deleteByUser(userId);
  }

  // Management

  async createItem(name: any, type: any) {
    return await this.itemAdapter.create(name, type);
  }

  async createItemChild(parent: any, child: any) {
    return await this.itemChildAdapter.create(parent, child);
  }

  async createRule(name: any) {
    return await this.ruleAdapter.create(name);
  }
}
