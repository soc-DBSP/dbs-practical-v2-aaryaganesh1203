const { RAISE_EXCEPTION } = require('../errors');
const staffModel = require('../models/staff');

module.exports.transferStaff = function (req, res) {
    const staffNumber = req.body.staffNumber;
    const departmentCode = req.body.departmentCode;

    return staffModel.transferStaff(staffNumber, departmentCode)
        .then(function () {
            return res.json({ message: `Staff with staff number ${staffNumber} transferred!` });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof RAISE_EXCEPTION) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Unknown Error' });
        });
};
