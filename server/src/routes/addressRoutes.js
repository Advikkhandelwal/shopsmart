const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} = require('../controllers/addressController');

router.use(protect);

router.get('/', getMyAddresses);
router.post('/', createAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

module.exports = router;
