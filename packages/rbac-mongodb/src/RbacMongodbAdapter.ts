import { RbacAdapter, RbacHierarchy, RbacItem, RbacRule, RbacUserId } from '@brainstaff/rbac';

import RbacMongodbAssignmentAdapter from './adapters/RbacMongodbAssignmentAdapter';
import RbacMongodbItemAdapter from './adapters/RbacMongodbItemAdapter';
import RbacMongodbItemChildAdapter from './adapters/RbacMongodbItemChildAdapter';
import RbacMongodbRuleAdapter from './adapters/RbacMongodbRuleAdapter';

export default class RbacMongodbAdapter implements RbacAdapter {
  private assignmentAdapter: any;
  private itemAdapter: any;
  private itemChildAdapter: any;
  private ruleAdapter: any;

  constructor() {
    this.assignmentAdapter = new RbacMongodbAssignmentAdapter();
    this.itemAdapter = new RbacMongodbItemAdapter();
    this.itemChildAdapter = new RbacMongodbItemChildAdapter();
    this.ruleAdapter = new RbacMongodbRuleAdapter();
  }

  async store(rbacHierarchy: RbacHierarchy) {
    await this.assignmentAdapter.store(rbacHierarchy.rbacAssignments);
    await this.itemAdapter.store(rbacHierarchy.rbacItems);
    await this.itemChildAdapter.store(rbacHierarchy.rbacItemChildren);
    await this.ruleAdapter.store(rbacHierarchy.rbacRules);
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

  async findItem(name: RbacItem['name']) {
    return await this.itemAdapter.find(name);
  }

  async findItemChildrenByParent(name: RbacItem['name']) {
    return await this.itemChildAdapter.findByParent(name);
  }

  // Core for management

  async createAssignment(userId: RbacUserId, role: RbacItem['name']) {
    return await this.assignmentAdapter.create(userId, role);
  }

  async findAssignment(userId: RbacUserId, role: RbacItem['name']) {
    return await this.assignmentAdapter.find(userId, role);
  }

  async findRoles() {
    return await this.itemAdapter.findByType('role');
  }

  async deleteAssignment(userId: RbacUserId, role: RbacItem['name']) {
    if (role) {
      return await this.assignmentAdapter.delete(userId, role);
    }
    return await this.assignmentAdapter.deleteByUser(userId);
  }

  // Management

  async createItem(name: RbacItem['name'], type: RbacItem['type']) {
    return await this.itemAdapter.create(name, type);
  }

  async createItemChild(parent: RbacItem['name'], child: RbacItem['name']) {
    return await this.itemChildAdapter.create(parent, child);
  }

  async createRule(name: RbacRule['name']) {
    return await this.ruleAdapter.create(name);
  }
}
