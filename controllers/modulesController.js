const { EMPTY_RESULT_ERROR, UNIQUE_VIOLATION_ERROR, RAISE_EXCEPTION, DUPLICATE_TABLE_ERROR } = require('../errors');
const modulesModel = require('../models/modules');

module.exports.create = function (req, res) {
    const code = req.body.code;
    const name = req.body.name;
    const credit = req.body.credit;

    return modulesModel
        .create(code, name, credit)
        .then(function () {
            return res.sendStatus(201);
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof UNIQUE_VIOLATION_ERROR || error instanceof RAISE_EXCEPTION) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        });
};

module.exports.retrieveByCode = function (req, res) {
    const code = req.params.code;

    return modulesModel
        .retrieveByCode(code)
        .then(function (module) {
            return res.json({ module: module });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof EMPTY_RESULT_ERROR) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        });
};

module.exports.deleteByCode = function (req, res) {
    const code = req.params.code;
    return modulesModel
        .deleteByCode(code)
        .then(function () {
            return res.status(200).json({ msg: 'deleted!' });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof EMPTY_RESULT_ERROR) {
                return res.status(404).json({ error: 'No such module!' });
            }
            return res.status(500).json({ error: error.message });
        });
};

module.exports.updateByCode = function (req, res) {
    const code = req.params.code;
    const credit = req.body.credit;
    return modulesModel
        .updateByCode(code, credit)
        .then(function () {
            return res.status(200).json({ msg: 'updated!' });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof EMPTY_RESULT_ERROR) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        });
};

module.exports.retrieveAll = function (req, res) {
    return modulesModel
        .retrieveAll()
        .then(function (modules) {
            return res.json({ modules: modules });
        })
        .catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
};
