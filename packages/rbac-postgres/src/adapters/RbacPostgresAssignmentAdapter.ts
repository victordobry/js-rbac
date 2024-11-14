import { Knex } from 'knex';

import { RbacAssignment, RbacAssignmentAdapter, RbacItem, RbacUserId } from '@brainstaff/rbac';

import RbacAssignmentModel from '../models/RbacAssignment';

export default class RbacPostgresAssignmentAdapter implements RbacAssignmentAdapter {
  constructor(deps: {
    client: Knex
  }) {
    RbacAssignmentModel.knex(deps.client);
  }

  async store(values: RbacAssignment[]) {
    await RbacAssignmentModel.query().delete();
    await RbacAssignmentModel.query().insert(values);
  }

  async load() {
    const entries = await RbacAssignmentModel.query();
    return entries.map(x => new RbacAssignment(x));
  }

  async create(userId: RbacUserId, role: RbacItem['name']) {
    if (await RbacAssignmentModel.query().findById([userId, role])) {
      throw new Error(`Role ${role} is already assigned to user ${userId}.`);
    }
    await RbacAssignmentModel.query().insert({ userId, role });
  }

  async find(userId: RbacUserId, role: RbacItem['name']) {
    const entry = await RbacAssignmentModel.query().findById([userId, role]);
    return entry == null ? null : new RbacAssignment(entry);
  }

  async findByUserId(userId: RbacUserId) {
    const entries = await RbacAssignmentModel.query().where({ userId });
    return entries.map(x => new RbacAssignment(x));
  }

  async delete(userId: RbacUserId, role: RbacItem['name']) {
    const entry = await RbacAssignmentModel.query().findById([userId, role]);
    if (!entry) {
      throw new Error(`No assignment between ${userId} and ${role} was found.`);
    }
    await RbacAssignmentModel.query().deleteById([userId, role]);
  }

  async deleteByUser(userId: RbacUserId) {
    const entry = await RbacAssignmentModel.query().where({ userId });
    await RbacAssignmentModel.query().where({ userId }).delete();
  }
}
