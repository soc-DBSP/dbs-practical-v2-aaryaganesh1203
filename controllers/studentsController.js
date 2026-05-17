const { UNIQUE_VIOLATION_ERROR, RAISE_EXCEPTION } = require('../errors');
const studentModel = require('../models/students');

// GET all students — summary view (used by JWT-protected /students route)
module.exports.retrieveAll = function (req, res) {
    return studentModel
        .retrieveAll()
        .then(function (allStudents) {
            return res.json({ students: allStudents });
        })
        .catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: 'Unknown Error' });
        });
};

// GET all students — full view (used by studentsAdmin route)
module.exports.getAllStudents = async function (req, res) {
    try {
        const students = await studentModel.getAllStudents();
        return res.json({ students });
    } catch (error) {
        console.error('Error fetching students:', error);
        return res.status(500).json({ error: 'Unknown Error' });
    }
};

// GET student by adm_no
module.exports.getStudentByAdmNo = async function (req, res) {
    try {
        const admNo = req.params.admNo;
        const rows = await studentModel.getStudentByAdmNo(admNo);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching student:', error);
        return res.status(500).json({ error: 'Unknown Error' });
    }
};

// GET all courses (for dropdown)
module.exports.getAllCourses = async function (req, res) {
    try {
        const courses = await studentModel.getAllCourses();
        return res.json({ courses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        return res.status(500).json({ error: 'Unknown Error' });
    }
};

// POST enrol new student
module.exports.enrolNewStudent = async function (req, res) {
    const {
        adminNumber,
        studentName,
        gender,
        address,
        dob,
        nationality,
        courseCode
    } = req.body;

    if (!adminNumber || !studentName || !gender ||
        !address || !dob || !nationality || !courseCode) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        await studentModel.enrolNewStudent(
            adminNumber, studentName, gender, address, dob, nationality, courseCode
        );
        return res.json({ message: `Student ${adminNumber} enrolled successfully!` });
    } catch (error) {
        console.error('Error enrolling student:', error);
        if (error instanceof UNIQUE_VIOLATION_ERROR || error instanceof RAISE_EXCEPTION) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Unknown Error' });
    }
};
