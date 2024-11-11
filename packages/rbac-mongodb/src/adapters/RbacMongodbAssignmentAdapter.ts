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

  async create(userId: any, role: any) {
    const currentRole = await RbacAssignment.findOne({ userId: userId, role: role });
    if (currentRole) {
      throw new Error(`Role ${role} is already assigned to user ${userId}.`);
    }

    return await RbacAssignment.create({ userId: userId, role: role });
  }

  async find(userId: any, role: any) {
    return await RbacAssignment.findOne({ userId: userId, role: role });
  }

  async findByUserId(userId: any) {
    return await RbacAssignment.find({ userId: userId });
  }

  async delete(userId: any, role: any) {
    const currentRole = await RbacAssignment.findOne({ userId: userId, role: role });

    if (!currentRole) {
      throw new Error(`No assignment between ${userId} and ${role} was found.`);
    }

    return await RbacAssignment.findByIdAndDelete(currentRole._id);
  }

  async deleteByUser(userId: any) {
    return await RbacAssignment.deleteMany({ userId });
  }
}
