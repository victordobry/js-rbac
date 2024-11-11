import { RbacUserId } from '@brainstaff/rbac';

import RbacAssignmentModel from '../models/RbacAssignment';

export default class RbacMongodbAssignmentAdapter {
  constructor() {
  }

  async store(rbacAssignments: any[]) {
    await RbacAssignmentModel.deleteMany({});
    return await RbacAssignmentModel.create(rbacAssignments);
  }

  async load() {
    return await RbacAssignmentModel.find({});
  }

  async create(userId: RbacUserId, role: any) {
    const currentRole = await RbacAssignmentModel.findOne({ userId: userId, role: role });
    if (currentRole) {
      throw new Error(`Role ${role} is already assigned to user ${userId}.`);
    }

    return await RbacAssignmentModel.create({ userId: userId, role: role });
  }

  async find(userId: RbacUserId, role: any) {
    return await RbacAssignmentModel.findOne({ userId: userId, role: role });
  }

  async findByUserId(userId: RbacUserId) {
    return await RbacAssignmentModel.find({ userId: userId });
  }

  async delete(userId: RbacUserId, role: any) {
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
