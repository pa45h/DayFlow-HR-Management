import Payroll from "../models/Payroll.js";

// @desc    Get payroll information
// @route   GET /api/payroll
// @access  Private
const getPayroll = async (req, res) => {
  try {
    const { userId } = req.query;

    let query = {};

    // Employees can only see their own payroll
    if (req.user.role === "employee") {
      query.user = req.user._id;
    } else if (userId) {
      // Admin/HR can filter by user
      query.user = userId;
    }

    const payroll = await Payroll.find(query).populate(
      "user",
      "firstName lastName employeeId email"
    );

    res.json(payroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single payroll
// @route   GET /api/payroll/:id
// @access  Private
const getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate(
      "user",
      "firstName lastName employeeId email"
    );

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    // Employees can only view their own payroll
    if (
      req.user.role === "employee" &&
      payroll.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(payroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get payroll by user ID
// @route   GET /api/payroll/user/:userId
// @access  Private
const getPayrollByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Employees can only view their own payroll
    if (req.user.role === "employee" && userId !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const payroll = await Payroll.findOne({ user: userId }).populate(
      "user",
      "firstName lastName employeeId email"
    );

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    res.json(payroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update payroll (Admin only)
// @route   PUT /api/payroll/:id
// @access  Private/Admin
const updatePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    const { basicSalary, allowances, deductions, currency, paymentFrequency } =
      req.body;

    if (basicSalary !== undefined) payroll.basicSalary = basicSalary;
    if (allowances)
      payroll.allowances = { ...payroll.allowances, ...allowances };
    if (deductions)
      payroll.deductions = { ...payroll.deductions, ...deductions };
    if (currency) payroll.currency = currency;
    if (paymentFrequency) payroll.paymentFrequency = paymentFrequency;

    await payroll.save();

    const updatedPayroll = await Payroll.findById(payroll._id).populate(
      "user",
      "firstName lastName employeeId email"
    );
    res.json(updatedPayroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getPayroll, getPayrollById, getPayrollByUserId, updatePayroll };
