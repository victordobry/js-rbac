import { RbacAssignment, RbacAssignmentAdapter, RbacItem, RbacUserId } from "@brainstaff/rbac";

export default class RbacInMemoryAssignmentAdapter implements RbacAssignmentAdapter {
  public rbacAssignments: RbacAssignment[] = [];

  async store(rbacAssignments: RbacAssignment[]) {
    this.rbacAssignments = [...rbacAssignments];
  }

  async load() {
    return this.rbacAssignments;
  }

  async create(userId: RbacUserId, role: RbacItem['name']) {
    if (this.rbacAssignments.find(assignment => assignment.userId === userId && assignment.role === role)) {
      throw new Error(`Role ${role} is already assigned to user ${userId}.`);
    }
    this.rbacAssignments.push({ userId, role });
  }

  async find(userId: RbacUserId, role: RbacItem['name']) {
    return this.rbacAssignments.find(assignment => assignment.userId === userId && assignment.role === role);
  }

  async findByUserId(userId: RbacUserId) {
    return this.rbacAssignments.filter(assignment => assignment.userId === userId);
  }

  async delete(userId: RbacUserId, role: RbacItem['name']) {
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
