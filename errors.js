/* eslint-disable max-classes-per-file */

// See more: https://www.postgresql.org/docs/current/errcodes-appendix.html
module.exports.SQL_ERROR_CODE = {
    DUPLICATE_TABLE: '42P07',
    UNDEFINED_TABLE: '42P01',
    UNIQUE_VIOLATION: '23505',
    RAISE_EXCEPTION: 'P0001',
};

module.exports.DUPLICATE_TABLE_ERROR = class DUPLICATE_TABLE_ERROR extends Error {
    constructor(tableName) {
        super(`Table ${tableName} already exists!`);
        this.name = 'DUPLICATE_TABLE_ERROR';
    }
};

module.exports.UNDEFINED_TABLE_ERROR = class UNDEFINED_TABLE_ERROR extends Error {
    constructor(tableName) {
        super(`Table ${tableName} does not exist!`);
        this.name = 'UNDEFINED_TABLE_ERROR';
    }
};

module.exports.EMPTY_RESULT_ERROR = class EMPTY_RESULT_ERROR extends Error {
    constructor(message) {
        super(message);
        this.name = 'EMPTY_RESULT_ERROR';
    }
};

module.exports.UNIQUE_VIOLATION_ERROR = class UNIQUE_VIOLATION_ERROR extends Error {
    constructor(message) {
        super(message);
        this.name = 'UNIQUE_VIOLATION_ERROR';
    }
};

// Named RAISE_EXCEPTION to match what controllers and routes expect
module.exports.RAISE_EXCEPTION = class RAISE_EXCEPTION extends Error {
    constructor(message) {
        super(message);
        this.name = 'RAISE_EXCEPTION';
    }
};
