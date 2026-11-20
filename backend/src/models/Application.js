import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  referenceId: { type: String, required: true, unique: true },
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  citizenName: { type: String, required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  serviceName: { type: String, required: true },
  departmentCode: { type: String, required: true },
  departmentName: { type: String, required: true },
  payload: { type: mongoose.Schema.Types.Mixed, default: {} },
  normalizedData: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: { type: String, enum: ['Submitted', 'Under Review', 'Approved', 'Rejected', 'Completed'], default: 'Submitted' },
  notes: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);
