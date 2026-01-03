import Attendance from "../models/Attendence.js";
import mongoose from "mongoose";

// @desc    Check in
// @route   POST /api/attendance/checkin
// @access  Private
const checkIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    let attendance = await Attendance.findOne({
      user: req.user._id,
      date: today,
    });

    if (attendance && attendance.checkIn) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    if (!attendance) {
      attendance = await Attendance.create({
        user: req.user._id,
        date: today,
        checkIn: new Date(),
        status: "present",
      });
    } else {
      attendance.checkIn = new Date();
      attendance.status = "present";
      await attendance.save();
    }

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Check out
// @route   POST /api/attendance/checkout
// @access  Private
const checkOut = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      user: req.user._id,
      date: today,
    });

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({ message: "Must check in first" });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    attendance.checkOut = new Date();

    // Calculate work hours
    const hours = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);
    attendance.workHours = Math.round(hours * 100) / 100;

    // Update status based on work hours
    if (hours < 4) {
      attendance.status = "half-day";
    }

    await attendance.save();
    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    // Build query
    let query = {};

    // If employee, only show their own records
    if (req.user.role === "employee") {
      query.user = req.user._id;
    } else if (userId) {
      // Admin/HR can filter by user
      query.user = userId;
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query)
      .populate("user", "firstName lastName employeeId")
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update attendance (Admin only)
// @route   PUT /api/attendance/:id
// @access  Private/Admin
const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    const { status, remarks } = req.body;

    if (status) attendance.status = status;
    if (remarks !== undefined) attendance.remarks = remarks;

    await attendance.save();
    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get attendance summary
// @route   GET /api/attendance/summary
// @access  Private
const getAttendanceSummary = async (req, res) => {
  try {
    const userId =
      req.user.role === "employee"
        ? req.user._id
        : req.query.userId || req.user._id;

    const summary = await Attendance.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      present: 0,
      absent: 0,
      "half-day": 0,
      leave: 0,
    };

    summary.forEach((item) => {
      result[item._id] = item.count;
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  checkIn,
  checkOut,
  getAttendance,
  updateAttendance,
  getAttendanceSummary,
};
