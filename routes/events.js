var express = require('express')
var router = express.Router();
var isAuthenticated = require('../middlewares/isAuthenticated')
var User = require('../models/user.js')
var Event = require('../models/event.js')
var Task = require('../models/task.js')

/*router.post('/add', isAuthenticated, function (req, res, next) {
    var type = req.body.type;
    if (type === "task") {
        var user = req.session.user;
        var name = req.body.name;
        var date = req.body.date;
        var points = req.body.points;
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
        var t = new Task({ name: name, date: date, complete: false, category: color, points: points });
        t.save(function (err, result) {
            if (err) {
                next(err)
            }
            if (!err) {
                console.log(result)
                User.findOneAndUpdate({ username: user }, {$push:{tasks: t}}, {new: true}, (err, result) => {
                    if (err) {
                        console.log(err)
                    }
                });
                res.redirect('/')
            }
        })
    } else {
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

        var e = new Event({ name: name, date: date, allDay: allDay, startTime: start, endTime: end, category: color });
        e.save(function (err, result) {
            if (err) {
                next(err)
            }
            if (!err) {
                console.log(result)
                User.findOneAndUpdate({ username: user }, {$push:{events: e}}, {new: true}, (err, result) => {
                    if (err) {
                        console.log(err)
                    }
                });
                res.redirect('/')
            }
        })
    }
})

router.get('/add', isAuthenticated, function (req, res) {
    res.render('add', { user: req.session.user });
})*/


router.post('/addEvent', isAuthenticated, function (req, res, next) {
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
            console.log(result)
            User.findOneAndUpdate({ username: user }, {$push:{events: e}}, {new: true}, (err, result) => {
                if (err) {
                    console.log(err)
                }
            });
            res.redirect('/')
        }
    })
})

router.get('/addEvent', isAuthenticated, function (req, res) {
    res.render('addEvent', { user: req.session.user });
})

module.exports = router;
