const express = require('express');
const router = express.Router();
const {
  getLoans,
  createLoan,
  getLoanById,
  approveLoan,
} = require('../controllers/loanController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getLoans).post(protect, createLoan);
router.route('/:id').get(protect, getLoanById);
router.route('/:id/approve').put(protect, approveLoan);

module.exports = router;
