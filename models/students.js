const { query } = require('../db');
const { SQL_ERROR_CODE, UNIQUE_VIOLATION_ERROR, RAISE_EXCEPTION_ERROR } = require('../errors');

// Get all students (summary view)
module.exports.retrieveAll = function retrieveAll() {
    const sql = 'SELECT adm_no, stud_name, gender, crse_code FROM student';
    return query(sql).then(function (result) {
        return result.rows;
    });
};

// Get all students (full view)
module.exports.getAllStudents = function getAllStudents() {
    const sql = 'SELECT * FROM student ORDER BY adm_no';
    return query(sql).then(function (result) {
        return result.rows;
    });
};

// Get student by adm_no
module.exports.getStudentByAdmNo = function getStudentByAdmNo(admNo) {
    const sql = 'SELECT * FROM student WHERE adm_no = $1';
    return query(sql, [admNo]).then(function (result) {
        return result.rows;
    });
};

// Get all courses (for dropdown)
module.exports.getAllCourses = function getAllCourses() {
    const sql = 'SELECT crse_code, crse_name FROM course ORDER BY crse_code';
    return query(sql).then(function (result) {
        return result.rows;
    });
};

// Enrol new student
module.exports.enrolNewStudent = function enrolNewStudent(
    adminNumber, studentName, gender, address, dob, nationality, courseCode
) {
    const sql = 'CALL enrol_new_student($1, $2, $3, $4, $5, $6, $7, $8)';

    return query(sql, [
        adminNumber,
        studentName,
        gender,
        address,
        dob,
        nationality,
        courseCode,
        '' // placeholder for OUT parameter err_msg
    ])
    .then(function (result) {
        // Check if stored procedure returned an error message
        if (result.rows.length === 1 && result.rows[0].err_msg) {
            throw new RAISE_EXCEPTION_ERROR(result.rows[0].err_msg);
        }
    })
    .catch(function (error) {
        if (error.code === SQL_ERROR_CODE.UNIQUE_VIOLATION) {
            throw new UNIQUE_VIOLATION_ERROR(
                `Student with adm no ${adminNumber} already exists! Cannot create duplicate.`
            );
        }
        if (error.code === SQL_ERROR_CODE.RAISE_EXCEPTION) {
            throw new RAISE_EXCEPTION_ERROR(error.message);
        }
        throw error;
    });
};