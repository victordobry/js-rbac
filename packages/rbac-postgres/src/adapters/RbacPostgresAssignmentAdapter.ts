import { Knex } from 'knex';

import { RbacAssignment, RbacAssignmentAdapter, RbacItem, RbacUserId } from '@brainstaff/rbac';

import RbacAssignmentModel from '../models/RbacAssignment';

class RbacPostgresAssignmentAdapter implements RbacAssignmentAdapter {
  constructor(deps: {
    client: Knex
  }) {
    RbacAssignmentModel.knex(deps.client);
  }

  async store(rbacAssignments: RbacAssignment[]) {
    await RbacAssignmentModel.query().delete();
    const assignments = await RbacAssignmentModel.query().insert(rbacAssignments);
    return assignments.map(assignment => assignment.toJSON());
  }

  async load() {
    const assignments = await RbacAssignmentModel.query();
    return assignments.map(assignment => assignment.toJSON());
  }

  async create(userId: RbacUserId, role: RbacItem['name']) {
    let assignment = await RbacAssignmentModel.query().findById([userId, role]);
    if (assignment) {
      throw new Error(`Role ${role} is already assigned to user ${userId}.`);
    }
    assignment = await RbacAssignmentModel.query().insert({ userId: userId, role: role });
    return assignment && assignment.toJSON();
  }

  async find(userId: RbacUserId, role: RbacItem['name']) {
    const assignment = await RbacAssignmentModel.query().findById([userId, role]);
    return assignment && assignment.toJSON();
  }

  async findByUserId(userId: RbacUserId) {
    const assignments = await RbacAssignmentModel.query().where({ userId });
    return assignments.map(assignment => assignment.toJSON());
  }

  async delete(userId: RbacUserId, role: RbacItem['name']) {
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
