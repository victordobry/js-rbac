import { RbacAssignment, RbacAssignmentAdapter, RbacItem, RbacUserId } from '@brainstaff/rbac';

import RbacAssignmentModel from '../models/RbacAssignment';

export default class RbacMongodbAssignmentAdapter implements RbacAssignmentAdapter {
  async store(rbacAssignments: RbacAssignment[]) {
    await RbacAssignmentModel.deleteMany({});
    return await RbacAssignmentModel.create(rbacAssignments);
  }

  async load() {
    return await RbacAssignmentModel.find({});
  }

  async create(userId: RbacUserId, role: RbacItem['name']) {
    const currentRole = await RbacAssignmentModel.findOne({ userId: userId, role: role });
    if (currentRole) {
      throw new Error(`Role ${role} is already assigned to user ${userId}.`);
    }
    return await RbacAssignmentModel.create({ userId: userId, role: role });
  }

  async find(userId: RbacUserId, role: RbacItem['name']) {
    return await RbacAssignmentModel.findOne({ userId: userId, role: role });
  }

  async findByUserId(userId: RbacUserId) {
    return await RbacAssignmentModel.find({ userId: userId });
  }

  async delete(userId: RbacUserId, role: RbacItem['name']) {
    const currentRole = await RbacAssignmentModel.findOne({ userId: userId, role: role });
    if (!currentRole) {
      throw new Error(`No assignment between ${userId} and ${role} was found.`);
    }
    return await RbacAssignmentModel.findByIdAndDelete(currentRole._id);
  }

  async deleteByUser(userId: RbacUserId) {
    return await RbacAssignmentModel.deleteMany({ userId });
  }
}
