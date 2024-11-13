import { RbacAssignment, RbacItem, RbacItemChild, RbacRule, RbacUserId } from "./rbac-abstractions";

export interface RbacAssignmentAdapter {
  store: (assignments: RbacAssignment[]) => Promise<any>;
  load: () => Promise<any>;
  create: (userId: RbacUserId, role: RbacItem['name']) => Promise<any>;
  find: (userId: RbacUserId, role: RbacItem['name']) => Promise<any>;
  findByUserId: (userId: RbacUserId) => Promise<any>;
  delete: (userId: RbacUserId, role: RbacItem['name']) => Promise<any>;
  deleteByUser: (userId: RbacUserId) => Promise<any>;
}

interface RbacHierarchy {
  rbacAssignments: RbacAssignment[];
  rbacItems: RbacItem[];
  rbacItemChildren: RbacItemChild[];
  rbacRules: RbacRule[];
}
  
export class RbacAdapter {
  private assignmentAdapter: RbacAssignmentAdapter;
  private itemAdapter: any;
  private itemChildAdapter: any;
  private ruleAdapter: any;

  constructor(deps: {
    assignmentAdapter: RbacAssignmentAdapter,
    itemAdapter: any,
    itemChildAdapter: any,
    ruleAdapter: any,
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
      rbacRules: await this.ruleAdapter.load()
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

  async findItem(name: RbacItem['name']): Promise<RbacItem> {
    return await this.itemAdapter.find(name);
  }

  async findItemChildrenByParent(name: RbacItem['name']): Promise<RbacItemChild[]> {
    return await this.itemChildAdapter.findByParent(name);
  }

  // Core for management

  async createAssignment(userId: RbacUserId, role: RbacItem['name']): Promise<void> {
    return await this.assignmentAdapter.create(userId, role);
  }

  async findAssignment(userId: RbacUserId, role: RbacItem['name']): Promise<RbacAssignment> {
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
