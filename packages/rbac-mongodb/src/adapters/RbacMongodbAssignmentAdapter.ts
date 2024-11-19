import { RbacAssignment, RbacAssignmentAdapter, RbacItem, RbacUserId } from '@brainstaff/rbac';

import RbacAssignmentModel from '../models/RbacAssignment';

export default class RbacMongodbAssignmentAdapter implements RbacAssignmentAdapter {
  async store(values: RbacAssignment[]) {
    await RbacAssignmentModel.deleteMany({});
    await RbacAssignmentModel.create(values);
  }

  async load() {
    const entries = await RbacAssignmentModel.find({});
    return entries.map(x => new RbacAssignment(x));
  }

  async create(userId: RbacUserId, role: RbacItem['name']) {
    if (await RbacAssignmentModel.exists({ userId, role })) {
      throw new Error(`Role ${role} is already assigned to user ${userId}.`);
    }
    await RbacAssignmentModel.create(new RbacAssignment({ userId, role }));
  }

  async find(userId: RbacUserId, role: RbacItem['name']) {
    const entry = await RbacAssignmentModel.findOne({ userId, role });
    return entry == null ? null : new RbacAssignment(entry);
  }

  async findByUserId(userId: RbacUserId) {
    const entry = await RbacAssignmentModel.find({ userId });
    return entry.map(x => new RbacAssignment(x));
  }

  async delete(userId: RbacUserId, role: RbacItem['name']) {
    const entry = await RbacAssignmentModel.findOne({ userId, role });
    if (!entry) {
      throw new Error(`No assignment between ${userId} and ${role} was found.`);
    }
    await RbacAssignmentModel.findByIdAndDelete(entry._id);
  }

  async deleteByUser(userId: RbacUserId) {
    await RbacAssignmentModel.deleteMany({ userId });
  }
}
