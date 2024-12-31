// Node.js controller code
const Calendar = require('./CalendarModel');
exports.getAllCalendar = (req, res) => {
    Calendar.find({}, (err, calendar) => {
        if (err) {
            res.send(err);
        }
        res.json(calendar);
    });
};
//# sourceMappingURL=CalendarController.js.map