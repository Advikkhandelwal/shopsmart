const express = require('express');
const router = express.Router();
const { getProjects, getProjectById, createProject, deleteProject, updateProject } = require('../controllers/projectController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/').get(getProjects).post(protect, admin, createProject);
router.route('/:id').get(getProjectById).delete(protect, admin, deleteProject).put(protect, admin, updateProject);

module.exports = router;
