import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: {
    type: Date
  },
  checkOut: {
    type: Date
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half-day', 'leave'],
    default: 'absent'
  },
  workHours: {
    type: Number,
    default: 0
  },
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one attendance record per user per day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);