export type RbacUserId = string;

export interface RbacRule {
  name: string
}

export type RbacRulePayload = any;

export interface RbacRuleInstance {
  execute: (payload?: RbacRulePayload) => Promise<boolean>;
}

export interface RbacRuleFactory {
  createRule: (name: RbacRule['name']) => RbacRuleInstance;
}

export interface RbacItem {
  type: 'role' | 'permission';
  name: string;
  rule?: RbacRule['name'];
}

export interface RbacItemChild {
  parent: RbacItem['name'];
  child: RbacItem['name'];
}

export interface RbacAssignment {
  userId: RbacUserId;
  role: RbacItem['name'];
}

export interface RbacHierarchy {
  rbacAssignments: RbacAssignment[];
  rbacItems: RbacItem[];
  rbacItemChildren: RbacItemChild[];
  rbacRules: RbacRule[];
}

export interface RbacAdapter {
  store(hierarchy: RbacHierarchy): Promise<void>;
  load(): Promise<RbacHierarchy>;
  findAllAssignments(): Promise<RbacAssignment[]>;
  findAllItems(): Promise<RbacItem[]>;
  findAllItemsChild(): Promise<RbacItemChild[]>;
  findAllRules(): Promise<RbacRule[]>;

  // Core for checkAccess
  findAssignmentsByUserId(userId: RbacUserId): Promise<RbacAssignment[]>;
  findItem(name: RbacItem['name']): Promise<RbacItem>;
  findItemChildrenByParent(name: RbacItem['name']): Promise<RbacItemChild[]>;

  // Core for management
  createAssignment(userId: RbacUserId, role: RbacItem['name']): Promise<void>;
  findAssignment(userId: RbacUserId, role: RbacItem['name']): Promise<RbacAssignment>;
  findRoles(): Promise<RbacItem[]>;
  deleteAssignment(userId: RbacUserId, role?: RbacItem['name']): Promise<void>;

  // Management
  createItem(name: RbacItem['name'], type: RbacItem['type']): Promise<void>;
  createItemChild(parent: RbacItem['name'], child: RbacItem['name']): Promise<void>;
  createRule(name: RbacRule['name']): Promise<void>;
}

export class RbacAdapter implements RbacAdapter {
  private assignmentAdapter: any;
  private itemAdapter: any;
  private itemChildAdapter: any;
  private ruleAdapter: any;

  constructor(deps: {
    assignmentAdapter: any,
    itemAdapter: any,
    itemChildAdapter: any,
    ruleAdapter: any,
  }) {
    this.assignmentAdapter = deps.assignmentAdapter;
    this.itemAdapter = deps.itemAdapter;
    this.itemChildAdapter = deps.itemChildAdapter;
    this.ruleAdapter = deps.ruleAdapter;
  }

  async store(rbacHierachy: RbacHierarchy) {
    await this.assignmentAdapter.store(rbacHierachy.rbacAssignments);
    await this.itemAdapter.store(rbacHierachy.rbacItems);
    await this.itemChildAdapter.store(rbacHierachy.rbacItemChildren);
    await this.ruleAdapter.store(rbacHierachy.rbacRules);
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

export class RbacManager {
  private rbacCacheAdapter: RbacAdapter;
  private rbacPersistentAdapter: RbacAdapter;
  private rbacRuleFactory: RbacRuleFactory;
  private isCacheLoaded: any;

  constructor({ rbacCacheAdapter, rbacPersistentAdapter, rbacRuleFactory }: {
    rbacCacheAdapter: RbacAdapter,
    rbacPersistentAdapter: RbacAdapter,
    rbacRuleFactory: RbacRuleFactory,
  }) {
    this.rbacCacheAdapter = rbacCacheAdapter;
    this.rbacPersistentAdapter = rbacPersistentAdapter;
    this.rbacRuleFactory = rbacRuleFactory;
    this.isCacheLoaded = false;
  }

  async loadCache() {
    this.rbacCacheAdapter.store(await this.rbacPersistentAdapter.load());
    this.isCacheLoaded = true;
  }

  get currentAdapter() {
    if (this.isCacheLoaded) {
      return this.rbacCacheAdapter;
    } else {
      return this.rbacPersistentAdapter;
    }
  }

  async checkAccess(userId: RbacUserId, permissionOrRoleName: RbacItem['name'], payload?: RbacRulePayload) {
    const assignments = await this.currentAdapter.findAssignmentsByUserId(userId);
    for (let i = 0; i < assignments.length; i++) {
      if (await this.checkItem(assignments[i].role, permissionOrRoleName, payload)) {
        return true;
      }
    }
    return false;
  }

  async checkItem(currentItemName: RbacItem['name'], expectedItemName: RbacItem['name'], payload?: RbacRulePayload) {
    const currentItem = await this.currentAdapter.findItem(currentItemName);
    if (!currentItem) {
      return false;
    }
    if (currentItemName === expectedItemName) {
      // If we found permission we execute business rule
      if (currentItem.type === 'permission' && currentItem.rule) {
        return await this.rbacRuleFactory.createRule(currentItem.rule).execute(payload);
      } else {
        return true;
      }
    } else {
      // Before going deeper let's check business rule
      if (currentItem.type === 'permission' && currentItem.rule) {
        if (!(await this.rbacRuleFactory.createRule(currentItem.rule).execute(payload))) {
          return false;
        }
      }
      const children = await this.currentAdapter.findItemChildrenByParent(currentItemName);
      for (let i = 0; i < children.length; i++) {
        if (await this.checkItem(children[i].child, expectedItemName, payload)) {
          return true;
        }
      }
      return false;
    }
  }

  async assign(userId: RbacUserId, role: RbacItem['name']) {
    const item = await this.currentAdapter.findItem(role);
    if (!item || item.type !== 'role') {
      throw new Error(`No such role ${role}.`);
    }
    const assignment = await this.currentAdapter.findAssignment(userId, role);
    if (assignment) {
      return true;
    }
    if (this.isCacheLoaded) {
      await this.rbacCacheAdapter.createAssignment(userId, role);
    }
    return await this.rbacPersistentAdapter.createAssignment(userId, role);
  }

  async revoke(userId: RbacUserId, role: RbacItem['name']) {
    const assignment = await this.currentAdapter.findAssignment(userId, role);
    if (!assignment) {
      throw new Error(`Role "${role}" is not attached to the "${userId}".`);
    }
    if (this.isCacheLoaded) {
      await this.rbacCacheAdapter.deleteAssignment(userId, role);
    }
    return await this.rbacPersistentAdapter.deleteAssignment(userId, role);
  }

  async revokeAll(userId: RbacUserId) {
    if (this.isCacheLoaded) {
      await this.rbacCacheAdapter.deleteAssignment(userId);
    }
    return await this.rbacPersistentAdapter.deleteAssignment(userId);
  }

  async fetchUserAssignments(userId: RbacUserId) {
    return await this.currentAdapter.findAssignmentsByUserId(userId);
  }

  async fetchRoles() {
    return await this.currentAdapter.findRoles();
  }

  async fetchAllAssignments() {
    return await this.currentAdapter.findAllAssignments();
  }

  async fetchAllItems() {
    return await this.currentAdapter.findAllItems();
  }

  async fetchAllItemsChild() {
    return await this.currentAdapter.findAllItemsChild();
  }

  async fetchAllRules() {
    return await this.currentAdapter.findAllRules();
  }
}
