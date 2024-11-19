import mongoose from 'mongoose';

import { RbacItemChild } from '@brainstaff/rbac';

const RbacItemChildSchema = new mongoose.Schema<RbacItemChild>({
  parent: {
    type: String,
    ref: 'RbacItem'
  },
  child: {
    type: String,
    ref: 'RbacItem'
  }
});

export default mongoose.model('RbacItemChild', RbacItemChildSchema, 'RbacItemChild');
