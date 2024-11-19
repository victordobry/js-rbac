import { RbacAssignment, RbacItem, RbacItemChild, RbacRule, RbacUserId } from "./rbac-abstractions";

export interface RbacAssignmentAdapter {
  store: (assignments: RbacAssignment[]) => Promise<void>;
  load: () => Promise<RbacAssignment[]>;
  create: (userId: RbacUserId, role: RbacItem['name']) => Promise<void>;
  find: (userId: RbacUserId, role: RbacItem['name']) => Promise<RbacAssignment | null>;
  findByUserId: (userId: RbacUserId) => Promise<RbacAssignment[]>;
  delete: (userId: RbacUserId, role: RbacItem['name']) => Promise<void>;
  deleteByUser: (userId: RbacUserId) => Promise<void>;
}

export interface RbacItemAdapter {
  store: (items: RbacItem[]) => Promise<void>;
  load: () => Promise<RbacItem[]>;
  create: (name: RbacItem['name'], type: RbacItem['type'], rule?: RbacRule['name']) => Promise<void>;
  find: (name: RbacItem['name']) => Promise<RbacItem | null>;
  findByType: (type: RbacItem['type']) => Promise<RbacItem[]>;
}

export interface RbacItemChildAdapter {
  store: (itemChildren: RbacItemChild[]) => Promise<void>;
  load: () => Promise<RbacItemChild[]>;
  create: (parent: RbacItem['name'], child: RbacItem['name']) => Promise<void>;
  find: (parent: RbacItem['name'], child: RbacItem['name']) => Promise<RbacItemChild | null>;
  findByParent: (name: RbacItem['name']) => Promise<RbacItemChild[]>;
}

export interface RbacRuleAdapter {
  store: (rules: RbacRule[]) => Promise<void>;
  load: () => Promise<RbacRule[]>;
  create: (name: RbacRule['name']) => Promise<void>;
  find: (name: RbacRule['name']) => Promise<RbacRule | null>;
}

interface RbacHierarchy {
  rbacAssignments: RbacAssignment[];
  rbacItems: RbacItem[];
  rbacItemChildren: RbacItemChild[];
  rbacRules: RbacRule[];
}
  
export class RbacAdapter {
  private assignmentAdapter: RbacAssignmentAdapter;
  private itemAdapter: RbacItemAdapter;
  private itemChildAdapter: RbacItemChildAdapter;
  private ruleAdapter: RbacRuleAdapter;

  constructor(deps: {
    assignmentAdapter: RbacAssignmentAdapter,
    itemAdapter: RbacItemAdapter,
    itemChildAdapter: RbacItemChildAdapter,
    ruleAdapter: RbacRuleAdapter,
  }) {
    this.assignmentAdapter = deps.assignmentAdapter;
    this.itemAdapter = deps.itemAdapter;
    this.itemChildAdapter = deps.itemChildAdapter;
    this.ruleAdapter = deps.ruleAdapter;
  }

  async store(rbacHierachy: RbacHierarchy): Promise<void> {
    await this.assignmentAdapter.store(rbacHierachy.rbacAssignments);
    await this.itemAdapter.store(rbacHierachy.rbacItems);
    await this.itemChildAdapter.store(rbacHierachy.rbacItemChildren);
    await this.ruleAdapter.store(rbacHierachy.rbacRules);
  }

  async load(): Promise<RbacHierarchy> {
    return {
      rbacAssignments: await this.assignmentAdapter.load(),
      rbacItems: await this.itemAdapter.load(),
      rbacItemChildren: await this.itemChildAdapter.load(),
      rbacRules: await this.ruleAdapter.load(),
    };
  }

  async findAllAssignments(): Promise<RbacAssignment[]> {
    return await this.assignmentAdapter.load();
  }

  async findAllItems(): Promise<RbacItem[]> {
    return await this.itemAdapter.load();
  }

  async findAllItemsChild(): Promise<RbacItemChild[]> {
    return await this.itemChildAdapter.load();
  }

  async findAllRules(): Promise<RbacRule[]> {
    return await this.ruleAdapter.load();
  }

  // Core for checkAccess

  async findAssignmentsByUserId(userId: RbacUserId): Promise<RbacAssignment[]> {
    return await this.assignmentAdapter.findByUserId(userId);
  }

  async findItem(name: RbacItem['name']): Promise<RbacItem | null | undefined> {
    return await this.itemAdapter.find(name);
  }

  async findItemChildrenByParent(name: RbacItem['name']): Promise<RbacItemChild[]> {
    return await this.itemChildAdapter.findByParent(name);
  }

  // Core for management

  async createAssignment(userId: RbacUserId, role: RbacItem['name']): Promise<void> {
    return await this.assignmentAdapter.create(userId, role);
  }

  async findAssignment(userId: RbacUserId, role: RbacItem['name']): Promise<RbacAssignment | null | undefined> {
    return await this.assignmentAdapter.find(userId, role);
  }

  async findRoles(): Promise<RbacItem[]> {
    return await this.itemAdapter.findByType('role');
  }

  async deleteAssignment(userId: RbacUserId, role?: RbacItem['name']): Promise<void> {
    if (role) {
      return await this.assignmentAdapter.delete(userId, role);
    }
    return await this.assignmentAdapter.deleteByUser(userId);
  }

  // Management

  async createItem(name: RbacItem['name'], type: RbacItem['type']): Promise<void> {
    return await this.itemAdapter.create(name, type);
  }

  async createItemChild(parent: RbacItem['name'], child: RbacItem['name']): Promise<void> {
    return await this.itemChildAdapter.create(parent, child);
  }

  async createRule(name: RbacRule['name']): Promise<void> {
    return await this.ruleAdapter.create(name);
  }
}
