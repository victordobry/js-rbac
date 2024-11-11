import RbacAssignment from '../models/RbacAssignment';

class RbacPostgresAssignmentAdapter {
  async store(rbacAssignments: any[]) {
    await RbacAssignment.query().delete();
    const assignments = await RbacAssignment.query().insert(rbacAssignments) as unknown as any[];
    return assignments.map(assignment => assignment.toJSON());
  }

  async load() {
    const assignments = await RbacAssignment.query();
    return assignments.map(assignment => assignment.toJSON());
  }

  async create(userId: any, role: any) {
    let assignment = await RbacAssignment.query().findById([userId, role]);
    if (assignment) {
      throw new Error(`Role ${role} is already assigned to user ${userId}.`);
    }
    assignment = await RbacAssignment.query().insert({ userId: userId, role: role });
    return assignment && assignment.toJSON();
  }

  async find(userId: any, role: any) {
    const assignment = await RbacAssignment.query().findById([userId, role]);
    return assignment && assignment.toJSON();
  }

  async findByUserId(userId: any) {
    const assignments = await RbacAssignment.query().where({ userId });
    return assignments.map(assignment => assignment.toJSON());
  }

  async delete(userId: any, role: any) {
    const assignment = await RbacAssignment.query().findById([userId, role]);
    if (!assignment) {
      throw new Error(`No assignment between ${userId} and ${role} was found.`);
    }
    await RbacAssignment.query().deleteById([userId, role]);
    return assignment.toJSON();
  }

  async deleteByUser(userId: any) {
    const assignments = await RbacAssignment.query().where({ userId });
    await RbacAssignment.query().where({ userId }).delete();
    return assignments.map(assignment => assignment.toJSON());
  }
}

export default RbacPostgresAssignmentAdapter;
