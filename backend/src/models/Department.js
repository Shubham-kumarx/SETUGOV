import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  connector: { type: String, required: true },
  status: { type: String, enum: ['operational', 'degraded', 'offline'], default: 'operational' },
  lastSync: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Department', departmentSchema);
