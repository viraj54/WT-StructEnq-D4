const Loan = require('../models/Loan');
const Instalment = require('../models/Instalment');
const Customer = require('../models/Customer');

// Helper to calculate EMI
const calculateEMI = (principal, rate, tenure) => {
  const r = rate / 12 / 100; // Monthly interest rate
  const emi = (principal * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1);
  return Math.round(emi);
};

// @desc    Get all loans
// @route   GET /api/loans
// @access  Private
const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find({}).populate('customer', 'name phone');
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a loan application
// @route   POST /api/loans
// @access  Private
const createLoan = async (req, res) => {
  const { customerId, loanAmount, interestRate, tenure } = req.body;

  try {
    const emiAmount = calculateEMI(loanAmount, interestRate, tenure);

    const loan = new Loan({
      customer: customerId,
      loanAmount,
      interestRate,
      tenure,
      emiAmount,
      status: 'Pending',
    });

    const createdLoan = await loan.save();
    res.status(201).json(createdLoan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get loan by ID
// @route   GET /api/loans/:id
// @access  Private
const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate('customer');
    if (loan) {
      res.json(loan);
    } else {
      res.status(404).json({ message: 'Loan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve loan and generate instalments
// @route   PUT /api/loans/:id/approve
// @access  Private (Admin/Officer)
const approveLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (loan) {
      if (loan.status !== 'Pending') {
        return res.status(400).json({ message: 'Loan is not in pending status' });
      }

      loan.status = 'Active';
      loan.startDate = new Date();
      await loan.save();

      // Generate Instalments
      const instalments = [];
      for (let i = 1; i <= loan.tenure; i++) {
        const dueDate = new Date(loan.startDate);
        dueDate.setMonth(dueDate.getMonth() + i);

        instalments.push({
          loan: loan._id,
          amount: loan.emiAmount,
          dueDate: dueDate,
          status: 'Pending',
        });
      }

      await Instalment.insertMany(instalments);

      res.json({ message: 'Loan approved and instalments generated', loan });
    } else {
      res.status(404).json({ message: 'Loan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLoans,
  createLoan,
  getLoanById,
  approveLoan,
};
