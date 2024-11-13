import mongoose from 'mongoose';

import { RbacItem } from '@brainstaff/rbac';

const RbacItemSchema = new mongoose.Schema<RbacItem>({
  name: {
    type: String,
    unique: true
  },
  type: {
    type: String,
    enum: [
      'permission',
      'role'
    ]
  },
  rule: {
    type: String,
    ref: 'RbacRule'
  }
});

export default mongoose.model('RbacItem', RbacItemSchema, 'RbacItem');
