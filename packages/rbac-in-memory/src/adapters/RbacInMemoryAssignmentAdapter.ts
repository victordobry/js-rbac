import { RbacAssignment, RbacAssignmentAdapter, RbacItem, RbacUserId } from "@brainstaff/rbac";

export default class RbacInMemoryAssignmentAdapter implements RbacAssignmentAdapter {
  private entries: RbacAssignment[] = [];

  async store(values: RbacAssignment[]) {
    this.entries = values.map((x) => new RbacAssignment(x));
  }

  async load() {
    return this.entries;
  }

  async create(userId: RbacUserId, role: RbacItem['name']) {
    if (this.entries.find(x => x.userId === userId && x.role === role)) {
      throw new Error(`Role ${role} is already assigned to user ${userId}.`);
    }
    this.entries.push(new RbacAssignment({ userId, role }));
  }

  async find(userId: RbacUserId, role: RbacItem['name']) {
    return this.entries.find(x => x.userId === userId && x.role === role) ?? null;
  }

  async findByUserId(userId: RbacUserId) {
    return this.entries.filter(x => x.userId === userId);
  }

  async delete(userId: RbacUserId, role: RbacItem['name']) {
    const idx = this.entries.findIndex(x => x.userId === userId && x.role === role);
    if (idx === -1) {
      throw new Error(`No assignment between ${userId} and ${role} was found.`);
    }
    this.entries.splice(idx, 1);
  }

  async deleteByUser(userId: RbacUserId) {
    this.entries = this.entries.filter(x => x.userId !== userId);
  }
}
