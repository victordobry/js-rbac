import { Model } from 'objection';

import { RbacAssignment } from '@brainstaff/rbac';

interface RbacAssignmentModel extends RbacAssignment {}

class RbacAssignmentModel extends Model {
  static get tableName() {
    return 'rbac_assignments';
  }

  static get idColumn() {
    return ['userId', 'role'];
  }
}

export default RbacAssignmentModel;
