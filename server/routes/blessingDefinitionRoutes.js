const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { listBlessings, createBlessing, updateBlessing, deleteBlessing } = require('../controllers/blessingDefinitionController');

router.use(protect, authorize('admin'));

router.get('/', listBlessings);
router.post('/', createBlessing);
router.put('/:id', updateBlessing);
router.delete('/:id', deleteBlessing);

module.exports = router;
