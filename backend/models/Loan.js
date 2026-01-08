const mongoose = require('mongoose');

const loanSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Customer',
  },
  loanAmount: {
    type: Number,
    required: true,
  },
  interestRate: {
    type: Number,
    required: true,
  },
  tenure: { // in months
    type: Number,
    required: true,
  },
  emiAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Active', 'Completed', 'Defaulted'],
    default: 'Pending',
  },
  startDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
