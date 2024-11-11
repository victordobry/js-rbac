import { RbacUserId } from '@brainstaff/rbac';

import RbacAssignment from '../models/RbacAssignment';

export default class RbacMongodbAssignmentAdapter {
  constructor() {
  }

  async store(rbacAssignments: any[]) {
    await RbacAssignment.deleteMany({});
    return await RbacAssignment.create(rbacAssignments);
  }

  async load() {
    return await RbacAssignment.find({});
  }

  async create(userId: RbacUserId, role: any) {
    const currentRole = await RbacAssignment.findOne({ userId: userId, role: role });
    if (currentRole) {
      throw new Error(`Role ${role} is already assigned to user ${userId}.`);
    }

    return await RbacAssignment.create({ userId: userId, role: role });
  }

  async find(userId: RbacUserId, role: any) {
    return await RbacAssignment.findOne({ userId: userId, role: role });
  }

  async findByUserId(userId: RbacUserId) {
    return await RbacAssignment.find({ userId: userId });
  }

  async delete(userId: RbacUserId, role: any) {
    const currentRole = await RbacAssignment.findOne({ userId: userId, role: role });

    if (!currentRole) {
      throw new Error(`No assignment between ${userId} and ${role} was found.`);
    }

    return await RbacAssignment.findByIdAndDelete(currentRole._id);
  }

  async deleteByUser(userId: RbacUserId) {
    return await RbacAssignment.deleteMany({ userId });
  }
}
