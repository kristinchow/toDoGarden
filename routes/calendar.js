var express = require('express')
var router = express.Router();
var isAuthenticated = require('../middlewares/isAuthenticated')
var User = require('../models/user.js')
var Event = require('../models/event.js')


var checkIfEventToday = function(event, date, callback) {
    var today = date;
    Event.findById(event, function (err, event) {
        if (!err) {
            if (event.date.getUTCDate() === today.getDate() &&
                event.date.getUTCFullYear() === today.getFullYear() &&
                event.date.getUTCMonth() === today.getMonth()) {
                callback(event);
            } else {
                callback(null);
            }
        } else {
            callback(null);
        }
    })
}


function getEvents(req, date, callback) {
    var promises = [];
    User.findOne({username: req.session.user}, function (err, result) {
        if (!err) {
            for (let i = 0; i < result.events.length; i++) {
                var p = new Promise(function(resolve, reject) {
                    checkIfEventToday(result.events[i], date, function (event) {
                        if (event != null) {
                            resolve(event);
                        } else {
                            resolve(null);
                        }
                    });
                });
                promises.push(p);
            }
        }
        Promise.all(promises).then(function(values) {
            callback(null, values);
        });
    })
}

router.get('/weekly', function (req, res) {
    var date = new Date();

    var days = [];
    var promises = [];

    var f = date.getDay();
    var d = date.getDate();
    for (let i = 0; i < 7; i++) {
        if (i < f) {
            var diff = f - i;
            var tDay = new Date();
            tDay.setDate(d - diff);
            var day = {
                num: tDay.getDate(),
                month: tDay.getMonth(),
                year: tDay.getFullYear(),
                events: []
            }
            days.push(day);
            var p = new Promise(function (resolve, reject) {
                getEvents(req, tDay, function (err, e) {
                    if (!err) {
                        resolve(e);
                    } else {
                        reject;
                    }
                });
            })
            promises.push(p);
        } else if (i > f) {
            var diff = i - f;
            var tDay = new Date();
            tDay.setDate(d + diff);
            var day = {
                num: tDay.getDate(),
                month: tDay.getMonth(),
                year: tDay.getFullYear(),
                events: []
            }
            days.push(day);
            var p = new Promise(function (resolve, reject) {
                getEvents(req, tDay, function (err, e) {
                    if (!err) {
                        resolve(e);
                    } else {
                        reject;
                    }
                });
            })
            promises.push(p);
        } else {
            var day = {
                num: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear(),
                events: []
            }
            days.push(day);
            var p = new Promise(function (resolve, reject) {
                getEvents(req, date, function (err, e) {
                    if (!err) {
                        resolve(e);
                    } else {
                        reject;
                    }
                });
            })
            promises.push(p);
        }
    }

    Promise.all(promises).then(function (values) {
        for (let i = 0; i < values.length; i++) {
            var events = [];
            var d = days[i];
            for (let k = 0; k < values[i].length; k++) {
                if (values[i][k] != null) {
                    events.push(values[i][k]);
                }
            }

        //sort events by time
        events.sort(function(a, b) {
            const aStart = a.startTime.toUpperCase();
            const bStart = b.startTime.toUpperCase();

            let comparison = 0;
            if (aStart > bStart) {
                comparison = 1;
            } else if (aStart < bStart) {
                comparison = -1;
            }
            return comparison;
        });

        d.events = events;
    }

        var times = [];
        times.push('00:00');
        times.push('00:15');
        times.push('00:30');
        times.push('00:45');
        times.push('01:00');
        times.push('01:15');
        times.push('01:30');
        times.push('01:45');
        times.push('02:00');
        times.push('02:15');
        times.push('02:30');
        times.push('02:45');
        times.push('03:00');
        times.push('03:15');
        times.push('03:30');
        times.push('03:45');
        times.push('04:00');
        times.push('04:15');
        times.push('04:30');
        times.push('04:45');
        times.push('05:00');
        times.push('05:15');
        times.push('05:30');
        times.push('05:45');
        times.push('06:00');
        times.push('06:15');
        times.push('06:30');
        times.push('06:45');
        times.push('07:00');
        times.push('07:15');
        times.push('07:30');
        times.push('07:45');
        times.push('08:00');
        times.push('08:15');
        times.push('08:30');
        times.push('08:45');
        times.push('09:00');
        times.push('09:15');
        times.push('09:30');
        times.push('09:45');
        times.push('10:00');
        times.push('10:15');
        times.push('10:30');
        times.push('10:45');
        times.push('11:00');
        times.push('11:15');
        times.push('11:30');
        times.push('11:45');
        times.push('12:00');
        times.push('12:15');
        times.push('12:30');
        times.push('12:45');
        times.push('13:00');
        times.push('13:15');
        times.push('13:30');
        times.push('13:45');
        times.push('14:00');
        times.push('14:15');
        times.push('14:30');
        times.push('14:45');
        times.push('15:00');
        times.push('15:15');
        times.push('15:30');
        times.push('15:45');
        times.push('16:00');
        times.push('16:15');
        times.push('16:30');
        times.push('16:45');
        times.push('17:00');
        times.push('17:15');
        times.push('17:30');
        times.push('17:45');
        times.push('18:00');
        times.push('18:15');
        times.push('18:30');
        times.push('18:45');
        times.push('19:00');
        times.push('19:15');
        times.push('19:30');
        times.push('19:45');
        times.push('20:00');
        times.push('20:15');
        times.push('20:30');
        times.push('20:45');
        times.push('21:00');
        times.push('21:15');
        times.push('21:30');
        times.push('21:45');
        times.push('22:00');
        times.push('22:15');
        times.push('22:30');
        times.push('22:45');
        times.push('23:00');
        times.push('23:15');
        times.push('23:30');
        times.push('23:45');

        var time = [];

        for (let s = 0; s < times.length; s++) {
            var arr = [];
            for (let t = 0; t < 7; t++) {
                arr.push({
                    num: t,
                    events: []
                });
            }
            var t = {
                time: times[s],
                days: arr
            }
            time.push(t);
        }

        for (let i = 0; i < days.length; i++) {
            var day = days[i];
            for (let j = 0; j < times.length; j++) {
                var e = [];
                for (let k = 0; k < day.events.length; k++) {
                    if (!day.events[k].allDay && day.events[k].startTime <= times[j] && day.events[k].endTime > times[j]) {
                        e.push(day.events[k]);
                    }
                }
                time[j].days[i].events = e;
            }
        }

        res.render('weekly', {
            user: req.session.user,
            times: time,
            week: days
        })

    });

});


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
                    getEvents(req, day, function(err, e) {
                        if (!err) {
                            resolve(e);
                        } else {
                            reject;
                        }
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
                    var events = [];
                    for (let k = 0; k < values[count].length; k++) {
                        if (values[count][k] != null) {
                            events.push(values[count][k]);
                        }
                    }

                    //sort events by time
                    events.sort(function(a, b) {
                        const aStart = a.startTime.toUpperCase();
                        const bStart = b.startTime.toUpperCase();

                        let comparison = 0;
                        if (aStart > bStart) {
                            comparison = 1;
                        } else if (aStart < bStart) {
                            comparison = -1;
                        }
                        return comparison;
                    });

                    d.events = events;
                    count++;
                }
            }
        }

        res.render('monthly', {
            user: req.session.user,
            weeks: weeks
        })
    })
})
router.post('/weekly', isAuthenticated, function (req, res, next) {
    var user = req.session.user;
    var name = req.body.name;
    var date = req.body.date;
    var allday = req.body.allday;
    var s = req.body.start;
    var e = req.body.end;
    var category = req.body.category;
    var color;
    if (category === 'green') {
        color = '#C6E484';
    } else if (category === 'blue') {
        color = '#CDFFF5';
    } else if (category === 'orange') {
        color = '#F1D8AB'
    } else if (category === 'pink') {
        color = '#F1BDAB'
    }

    var start = s;
    var end = e;
    var allDay = false;

    if (allday === 'on') {
        allDay = true;
        start = '00:00';
        end = '00:10';
    }

    var e = new Event({ name: name, date: date, allDay: allDay, startTime: start, endTime: end, category: color })
    e.save(function (err, result) {
        if (err) {
            next(err)
        }
        if (!err) {
            User.findOneAndUpdate({ username: user }, {$push:{events: e}}, {new: true}, (err, result) => {
                if (err) {
                    console.log(err)
                }
            });
            res.redirect('/weekly')
        }
    })
})

router.post('/monthly', isAuthenticated, function (req, res, next) {
    var user = req.session.user;
    var name = req.body.name;
    var date = req.body.date;
    var allday = req.body.allday;
    var s = req.body.start;
    var e = req.body.end;
    var category = req.body.category;
    var color;
    if (category === 'green') {
        color = '#C6E484';
    } else if (category === 'blue') {
        color = '#CDFFF5';
    } else if (category === 'orange') {
        color = '#F1D8AB'
    } else if (category === 'pink') {
        color = '#F1BDAB'
    }

    var start = s;
    var end = e;
    var allDay = false;

    if (allday === 'on') {
        allDay = true;
        start = '00:00';
        end = '00:10';
    }

    var e = new Event({ name: name, date: date, allDay: allDay, startTime: start, endTime: end, category: color })
    e.save(function (err, result) {
        if (err) {
            next(err)
        }
        if (!err) {
            User.findOneAndUpdate({ username: user }, {$push:{events: e}}, {new: true}, (err, result) => {
                if (err) {
                    console.log(err)
                }
            });
            res.redirect('/monthly')
        }
    })
})

router.get('/goals', function (req, res) {
    res.render('goals', {
        user: req.session.user
    })
})
module.exports = router;