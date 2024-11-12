import { RbacUserId } from '@brainstaff/rbac';

import { RbacPostgresConfig } from '../RbacPostgresAdapter';
import RbacAssignmentModel from '../models/RbacAssignment';

class RbacPostgresAssignmentAdapter {
  constructor({ client }: RbacPostgresConfig) {
    RbacAssignmentModel.knex(client);
  }

  async store(rbacAssignments: any[]) {
    await RbacAssignmentModel.query().delete();
    const assignments = await RbacAssignmentModel.query().insert(rbacAssignments) as unknown as any[];
    return assignments.map(assignment => assignment.toJSON());
  }

  async load() {
    const assignments = await RbacAssignmentModel.query();
    return assignments.map(assignment => assignment.toJSON());
  }

  async create(userId: RbacUserId, role: any) {
    let assignment = await RbacAssignmentModel.query().findById([userId, role]);
    if (assignment) {
      throw new Error(`Role ${role} is already assigned to user ${userId}.`);
    }
    assignment = await RbacAssignmentModel.query().insert({ userId: userId, role: role });
    return assignment && assignment.toJSON();
  }

  async find(userId: RbacUserId, role: any) {
    const assignment = await RbacAssignmentModel.query().findById([userId, role]);
    return assignment && assignment.toJSON();
  }

  async findByUserId(userId: RbacUserId) {
    const assignments = await RbacAssignmentModel.query().where({ userId });
    return assignments.map(assignment => assignment.toJSON());
  }

  async delete(userId: RbacUserId, role: any) {
    const assignment = await RbacAssignmentModel.query().findById([userId, role]);
    if (!assignment) {
      throw new Error(`No assignment between ${userId} and ${role} was found.`);
    }
    await RbacAssignmentModel.query().deleteById([userId, role]);
    return assignment.toJSON();
  }

  async deleteByUser(userId: RbacUserId) {
    const assignments = await RbacAssignmentModel.query().where({ userId });
    await RbacAssignmentModel.query().where({ userId }).delete();
    return assignments.map(assignment => assignment.toJSON());
  }
}

export default RbacPostgresAssignmentAdapter;
