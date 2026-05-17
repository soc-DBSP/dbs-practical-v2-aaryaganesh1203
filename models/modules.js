const { query } = require('../database');
const { EMPTY_RESULT_ERROR, SQL_ERROR_CODE, UNIQUE_VIOLATION_ERROR, RAISE_EXCEPTION } = require('../errors');

// Uses stored procedure create_module (raises exception on duplicate)
module.exports.create = function create(code, name, credit) {
    return query('CALL create_module($1, $2, $3)', [code, name, credit])
        .then(function () {
            console.log('Module created successfully');
        })
        .catch(function (error) {
            if (error.code === SQL_ERROR_CODE.UNIQUE_VIOLATION) {
                throw new UNIQUE_VIOLATION_ERROR(`Module ${code} already exists! Cannot create duplicate.`);
            }
            if (error.code === SQL_ERROR_CODE.RAISE_EXCEPTION) {
                throw new RAISE_EXCEPTION(error.message);
            }
            throw error;
        });
};

module.exports.retrieveByCode = function retrieveByCode(code) {
    const sql = `SELECT * FROM module WHERE mod_code = $1`;
    return query(sql, [code]).then(function (result) {
        if (result.rows.length === 0) {
            throw new EMPTY_RESULT_ERROR(`Module ${code} not found!`);
        }
        return result.rows[0];
    });
};

// Uses stored procedure delete_module (raises exception if not found)
module.exports.deleteByCode = function deleteByCode(code) {
    return query('CALL delete_module($1)', [code])
        .then(function () {
            console.log('Module deleted successfully');
        })
        .catch(function (error) {
            if (error.code === SQL_ERROR_CODE.RAISE_EXCEPTION) {
                throw new EMPTY_RESULT_ERROR(`Module ${code} not found!`);
            }
            throw error;
        });
};

// Uses stored procedure update_module (raises exception if not found)
module.exports.updateByCode = function updateByCode(code, credit) {
    return query('CALL update_module($1, $2)', [code, credit])
        .then(function () {
            console.log('Module updated successfully');
        })
        .catch(function (error) {
            if (error.code === SQL_ERROR_CODE.RAISE_EXCEPTION) {
                throw new EMPTY_RESULT_ERROR(`Module ${code} not found!`);
            }
            throw error;
        });
};

module.exports.retrieveAll = function retrieveAll() {
    const sql = `SELECT * FROM module`;
    return query(sql).then(function (result) {
        return result.rows;
    });
};
