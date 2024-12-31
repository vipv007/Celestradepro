// Node.js controller code
const Calendarrep = require('./CalrepModel');
exports.getAllCalendardata = (req, res) => {
    Calendarrep.find({}, (err, calendarrep) => {
        if (err) {
            res.send(err);
        }
        res.json(calendarrep);
    });
};
//# sourceMappingURL=CalrepController.js.map