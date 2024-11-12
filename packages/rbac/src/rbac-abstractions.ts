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
