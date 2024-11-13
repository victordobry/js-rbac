import mongoose from 'mongoose';

import { RbacRule } from '@brainstaff/rbac';

const RbacRuleSchema = new mongoose.Schema<RbacRule>({
  name: {
    type: String,
    unique: true
  }
});

export default mongoose.model('RbacRule', RbacRuleSchema, 'RbacRule');
