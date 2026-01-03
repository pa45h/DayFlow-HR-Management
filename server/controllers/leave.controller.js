import Leave from "../models/Leave.js";

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const leave = await Leave.create({
      user: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason
    });

    const populatedLeave = await Leave.findById(leave._id)
      .populate('user', 'firstName lastName employeeId');

    res.status(201).json(populatedLeave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get leave requests
// @route   GET /api/leaves
// @access  Private
const getLeaves = async (req, res) => {
  try {
    const { status, userId } = req.query;

    let query = {};

    // Employees can only see their own leaves
    if (req.user.role === 'employee') {
      query.user = req.user._id;
    } else if (userId) {
      // Admin/HR can filter by user
      query.user = userId;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const leaves = await Leave.find(query)
      .populate('user', 'firstName lastName employeeId')
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single leave request
// @route   GET /api/leaves/:id
// @access  Private
const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('user', 'firstName lastName employeeId')
      .populate('reviewedBy', 'firstName lastName');

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Employees can only view their own leaves
    if (req.user.role === 'employee' && leave.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(leave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update leave status (Approve/Reject)
// @route   PUT /api/leaves/:id
// @access  Private/Admin
const updateLeaveStatus = async (req, res) => {
  try {
    const { status, adminComments } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Leave request already processed' });
    }

    leave.status = status;
    leave.adminComments = adminComments || '';
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = new Date();

    await leave.save();

    const updatedLeave = await Leave.findById(leave._id)
      .populate('user', 'firstName lastName employeeId')
      .populate('reviewedBy', 'firstName lastName');

    res.json(updatedLeave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete leave request
// @route   DELETE /api/leaves/:id
// @access  Private
const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Only the user who created it or admin can delete
    if (req.user.role === 'employee' && leave.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Can't delete approved/rejected leaves
    if (leave.status !== 'pending' && req.user.role === 'employee') {
      return res.status(400).json({ message: 'Cannot delete processed leave requests' });
    }

    await leave.deleteOne();
    res.json({ message: 'Leave request deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { applyLeave, getLeaves, getLeaveById, updateLeaveStatus, deleteLeave };