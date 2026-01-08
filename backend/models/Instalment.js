const mongoose = require('mongoose');

const instalmentSchema = mongoose.Schema({
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Loan',
  },
  amount: { // Expected amount
    type: Number,
    required: true,
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  paymentDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Overdue'],
    default: 'Pending',
  },
  penalty: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

const Instalment = mongoose.model('Instalment', instalmentSchema);

module.exports = Instalment;
