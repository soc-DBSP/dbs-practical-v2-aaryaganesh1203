const { query } = require('../database');
const { SQL_ERROR_CODE, UNIQUE_VIOLATION_ERROR, RAISE_EXCEPTION } = require('../errors');

// GET summary view (used by JWT-protected /students route)
module.exports.retrieveAll = function retrieveAll() {
    const sql = `SELECT adm_no, stud_name, gender, crse_code, gpa, gpa_last_updated FROM student`;
    return query(sql).then(function (result) {
        return result.rows;
    });
};

// GET full view (used by studentsAdmin route)
module.exports.getAllStudents = function getAllStudents() {
    const sql = 'SELECT adm_no, stud_name, gender, crse_code, gpa, gpa_last_updated FROM student ORDER BY adm_no';
    return query(sql).then(function (result) {
        return result.rows;
    });
};

// GET student by adm_no
module.exports.getStudentByAdmNo = function getStudentByAdmNo(admNo) {
    const sql = 'SELECT * FROM student WHERE adm_no = $1';
    return query(sql, [admNo]).then(function (result) {
        return result.rows;
    });
};

// GET all courses (for dropdown)
module.exports.getAllCourses = function getAllCourses() {
    const sql = 'SELECT crse_code, crse_name FROM course ORDER BY crse_code';
    return query(sql).then(function (result) {
        return result.rows;
    });
};

// POST enrol new student — calls the stored procedure
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
        // The stored procedure returns err_msg as an OUT param in result.rows[0]
        // pg-camelcase converts err_msg -> errMsg
        if (result.rows.length === 1 && result.rows[0].errMsg) {
            throw new RAISE_EXCEPTION(result.rows[0].errMsg);
        }
    })
    .catch(function (error) {
        if (error.code === SQL_ERROR_CODE.UNIQUE_VIOLATION) {
            throw new UNIQUE_VIOLATION_ERROR(
                `Student with adm no ${adminNumber} already exists! Cannot create duplicate.`
            );
        }
        if (error.code === SQL_ERROR_CODE.RAISE_EXCEPTION) {
            throw new RAISE_EXCEPTION(error.message);
        }
        throw error;
    });
};
