const { query } = require('../database');

module.exports.generateModulesPerformance = function generateModulesPerformance() {
    const sql = 'SELECT * FROM get_modules_performance()';
    return query(sql).then(function (result) {
        return result.rows;
    }).catch(function (error) {
        throw error;
    });
};

module.exports.calculateStudentsGPA = function calculateStudentsGPA() {
    const sql = 'CALL calculate_students_gpa()';
    return query(sql).then(function () {
        console.log('Calculated students GPA');
    }).catch(function (error) {
        throw error;
    });
};

// Placeholder — wire up to a real DB function when available
module.exports.generateAttendance = function generateAttendance() {
    const sql = 'SELECT * FROM get_modules_attendance()';
    return query(sql).then(function (result) {
        return result.rows;
    }).catch(function (error) {
        throw error;
    });
};
