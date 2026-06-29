const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/studentsController');

// GET all courses (for dropdown)
router.get('/courses', studentsController.getAllCourses);

// GET all students (full detail)
router.get('/', studentsController.getAllStudents);

// GET student by adm_no — must come after /courses to avoid 'courses' matching /:admNo
router.get('/:admNo', studentsController.getStudentByAdmNo);

// POST enrol new student
router.post('/', studentsController.enrolNewStudent);

module.exports = router;