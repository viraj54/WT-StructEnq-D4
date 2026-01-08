const express = require('express');
const router = express.Router();
const {
  getInstalments,
  payInstalment,
} = require('../controllers/instalmentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:loanId', protect, getInstalments);
router.post('/pay', protect, payInstalment);

module.exports = router;
