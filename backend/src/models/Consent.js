import mongoose from 'mongoose';

const consentSchema = new mongoose.Schema({
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  departmentCode: { type: String, required: true },
  departmentName: { type: String, required: true },
  dataScope: [{ type: String }],
  granted: { type: Boolean, default: true },
  grantedAt: { type: Date, default: Date.now },
  revokedAt: { type: Date, default: null }
}, { timestamps: true });

consentSchema.index({ citizen: 1, departmentCode: 1 }, { unique: true });
export default mongoose.model('Consent', consentSchema);
