import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  departmentCode: { type: String, required: true },
  icon: { type: String, default: '◈' },
  eta: { type: String, default: '5–7 working days' },
  requiredConsent: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
