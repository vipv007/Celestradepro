const Event = require('./EventModel');

exports.getAllEvents = (req, res) => {
    Event.find({}, (err, events) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(events);
        }
    });
};
