const { query } = require('../database');
const { SQL_ERROR_CODE, RAISE_EXCEPTION } = require('../errors');

// Uses stored procedure transfer_staff (raises exception for HOD)
module.exports.transferStaff = function transferStaff(staffNumber, departmentCode) {
    const sql = 'CALL transfer_staff($1, $2)';
    return query(sql, [staffNumber, departmentCode])
        .then(function () {
            console.log('Staff transferred');
        })
        .catch(function (error) {
            if (error.code === SQL_ERROR_CODE.RAISE_EXCEPTION) {
                throw new RAISE_EXCEPTION(error.message);
            }
            throw error;
        });
};
