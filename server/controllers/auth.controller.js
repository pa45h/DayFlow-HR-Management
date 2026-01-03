import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Payroll from "../models/Payroll.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      firstName,
      lastName,
    } = req.body;

    console.log('Signup request body:', req.body);
    

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    console.log('User exists:', userExists);
    

    if (userExists) {
      return res.status(400).json({
        message: "User with this email or employee ID already exists",
      });
    }

    // Create user
    const user = await User.create({
      // employeeId,
      email,
      password,
      role: role || "employee",
      firstName,
      lastName,
      // department,
      // position,
    });

    console.log('Created user:', user);

    // Create default payroll entry
    await Payroll.create({
      user: user._id,
      basicSalary: 0,
    });

    console.log('Default payroll created for user:', user._id);

    if (user) {
      res.status(201).json({
        _id: user._id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during signup", error: error.message });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { signup, login, getMe };
