import mongoose from 'mongoose';

const RbacRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  }
});

export default mongoose.model('RbacRule', RbacRuleSchema, 'RbacRule');
