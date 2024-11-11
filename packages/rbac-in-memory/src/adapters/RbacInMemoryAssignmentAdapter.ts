import { RbacUserId } from "@brainstaff/rbac";

export default class RbacInMemoryAssignmentAdapter {
  public rbacAssignments: any[];

  constructor() {
    this.rbacAssignments = [];
  }

  async store(rbacAssignments: any[]) {
    this.rbacAssignments = rbacAssignments;
  }

  async load() {
    return this.rbacAssignments;
  }

  async create(userId: RbacUserId, role: any) {
    if (this.rbacAssignments.find(assignment => assignment.userId === userId && assignment.role === role)) {
      throw new Error(`Role ${role} is already assigned to user ${userId}.`);
    }
    this.rbacAssignments.push({ userId, role });
  }

  async find(userId: RbacUserId, role: any) {
    return this.rbacAssignments.find(assignment => assignment.userId === userId && assignment.role === role);
  }

  async findByUserId(userId: RbacUserId) {
    return this.rbacAssignments.filter(assignment => assignment.userId === userId);
  }

  async delete(userId: RbacUserId, role: any) {
    const assignmentIndex = this.rbacAssignments.findIndex(assignment => assignment.userId === userId && assignment.role === role);
    if (assignmentIndex !== -1) {
      this.rbacAssignments.splice(assignmentIndex, 1);
    } else {
      throw new Error(`No assignment between ${userId} and ${role} was found.`);
    }
  }

  async deleteByUser(userId: RbacUserId) {
    let i = this.rbacAssignments.length;
    while (i--) {
      if (this.rbacAssignments[i].userId === userId) {
        this.rbacAssignments.splice(i, 1);
      }
    }
  }
}
