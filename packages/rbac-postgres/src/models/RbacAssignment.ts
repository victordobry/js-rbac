import { Model } from 'objection';

interface RbacAssignment {
  userId: any;
  role: any;
}

class RbacAssignment extends Model {
  static get tableName() {
    return 'rbac_assignments';
  }

  static get idColumn() {
    return ['userId', 'role'];
  }
}

export default RbacAssignment;
