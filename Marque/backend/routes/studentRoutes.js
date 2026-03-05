const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Add student
router.post('/add', studentController.addStudent);

// Dropdowns
router.get('/colleges', studentController.getColleges);
router.get('/departments', studentController.getDepartments);
router.get('/organizations', studentController.getOrganizations);
router.get('/roles', studentController.getRoles);

module.exports = router;