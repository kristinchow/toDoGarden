var express = require('express')
var router = express.Router();
var isAuthenticated = require('../middlewares/isAuthenticated')
var User = require('../models/user.js')
var Event = require('../models/event.js')


var checkIfEventToday = function(events, event, date, callback) {
    var today = date;
    Event.findById(event, function (err, event) {
        if (!err) {
            if (event.date.getUTCDate() === today.getDate() &&
                event.date.getUTCFullYear() === today.getFullYear() &&
                event.date.getUTCMonth() === today.getMonth()) {
                events.push(event);
            }
            callback(events);
        }
    })
}
3
var findEvents = function(req, date, callback) {
    var count = 0;
    var events = [];
    User.findOne({username: req.session.user}, function (err, result) {
        if (!err) {
            for (let i = 0; i < result.events.length; i++) {
                checkIfEventToday(events, result.events[i], date, function(e) {
                    events = e;
                    count++;
                    if (count === result.events.length) {
                        callback(null, events);
                    }
                })

            }
        } else {
            callback(null, [])
        }
    })
}

router.get('/monthly', function (req, res) {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var max = lastDay.getDate();
    var it = 0;

    var weeks = [];
    var f = firstDay.getDay();

    while (it != max) {
        var week = [];
        for (let i = 0; i < 7; i++) {
            if (i < f || i > f) {
                var day = {
                    num: 0,
                    events: []
                }
                week.push(day);
            } else {
                f++;
                it++;
                var day = {
                    num: it,
                    events: []
                }
                week.push(day);
                if (it === max) {
                    f = 0;
                }
            }
        }
        f = 0;
        weeks.push(week);
    }

    var promises = [];

    for (let i = 0; i < weeks.length; i++) {
        var w = weeks[i];
        for (let j = 0; j < w.length; j++) {
            var d = w[j];
            if (d.num != 0) {
                //find events
                var day = new Date(date.getFullYear(), date.getMonth(), d.num);
                var p = new Promise(function(resolve, reject) {
                    findEvents(req, day, function(err, e) {
                        resolve(e);
                    });
                })
                promises.push(p);
            }
        }
    }

    Promise.all(promises).then(function(values) {
        var count = 0;
        for (let i = 0; i < weeks.length; i++) {
            var w = weeks[i];
            for (let j = 0; j < w.length; j++) {
                var d = w[j];
                if (d.num != 0) {
                    d.events = values[count];
                    count++;
                }
            }
        }

        console.log(weeks)

        res.render('monthly', {
            user: req.session.user,
            weeks: weeks
        })
    })



})
module.exports = router;