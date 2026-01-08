const Instalment = require('../models/Instalment');
const Loan = require('../models/Loan');

// @desc    Get instalments by loan ID
// @route   GET /api/instalments/:loanId
// @access  Private
const getInstalments = async (req, res) => {
  try {
    const instalments = await Instalment.find({ loan: req.params.loanId }).sort({ dueDate: 1 });
    
    // Check for overdue and update status dynamically
    const now = new Date();
    const updatedInstalments = await Promise.all(instalments.map(async (inst) => {
      if (inst.status === 'Pending' && new Date(inst.dueDate) < now) {
        inst.status = 'Overdue';
        // Calculate penalty if needed (e.g., 2% of amount)
        inst.penalty = Math.round(inst.amount * 0.02); 
        await inst.save();
      }
      return inst;
    }));

    res.json(updatedInstalments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Pay instalment
// @route   POST /api/instalments/pay
// @access  Private
const payInstalment = async (req, res) => {
  const { instalmentId, amountPaid } = req.body;

  try {
    const instalment = await Instalment.findById(instalmentId);

    if (instalment) {
      if (instalment.status === 'Paid') {
        return res.status(400).json({ message: 'Instalment already paid' });
      }

      instalment.amountPaid = amountPaid;
      instalment.paymentDate = new Date();
      instalment.status = 'Paid';
      await instalment.save();

      // Check if all instalments are paid for the loan
      const loanId = instalment.loan;
      const pendingInstalments = await Instalment.countDocuments({
        loan: loanId,
        status: { $ne: 'Paid' },
      });

      if (pendingInstalments === 0) {
        await Loan.findByIdAndUpdate(loanId, { status: 'Completed' });
      }

      res.json(instalment);
    } else {
      res.status(404).json({ message: 'Instalment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInstalments,
  payInstalment,
};
