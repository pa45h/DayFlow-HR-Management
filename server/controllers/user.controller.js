import User from "../models/User.js";

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Employees can only view their own profile
    if (req.user.role === 'employee' && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this profile' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Employees can only update their own limited fields
    if (req.user.role === 'employee' && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    // Define allowed fields based on role
    let allowedFields;
    if (req.user.role === 'employee') {
      allowedFields = ['phone', 'address', 'profilePicture'];
    } else {
      allowedFields = ['firstName', 'lastName', 'phone', 'address', 'department', 'position', 'profilePicture', 'isActive'];
    }

    // Update only allowed fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getAllUsers, getUserProfile, updateUserProfile, deleteUser };