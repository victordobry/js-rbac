import mongoose from 'mongoose';

const RbacAssignmentSchema = new mongoose.Schema({
  role: {
    type: String,
    ref: 'RbacItem'
  },
  userId: {
    type: String
  }
});

export default mongoose.model('RbacAssignment', RbacAssignmentSchema, 'RbacAssignment');
