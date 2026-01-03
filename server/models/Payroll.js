import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  basicSalary: {
    type: Number,
    required: true,
    default: 0
  },
  allowances: {
    housing: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    medical: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  deductions: {
    tax: { type: Number, default: 0 },
    insurance: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  netSalary: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paymentFrequency: {
    type: String,
    enum: ['monthly', 'bi-weekly', 'weekly'],
    default: 'monthly'
  }
}, {
  timestamps: true
});

// Calculate net salary before saving
payrollSchema.pre('save', function (next) {
  if (this.allowances && this.deductions) {
    const totalAllowances = Object.values(this.allowances).reduce((sum, val) => sum + (val || 0), 0);
    const totalDeductions = Object.values(this.deductions).reduce((sum, val) => sum + (val || 0), 0);
    this.netSalary = this.basicSalary + totalAllowances - totalDeductions;
  }
  return next();
});

export default mongoose.model('Payroll', payrollSchema);