var express = require('express');
var router = express.Router();
var User = require('../models/user.js')
var Task = require('../models/task.js')
var Event = require('../models/event.js')

var tasks = [];
var events = [];

var countT = 0;
var countE = 0;


var checkIfEventToday = function(event, callback) {
    var today = new Date();
    Event.findById(event, function (err, event) {
        if (!err) {
            if (event.date.getUTCDate() === today.getDate() &&
                event.date.getUTCFullYear() === today.getFullYear() &&
                event.date.getUTCMonth() === today.getMonth()) {
                events.push(event);
            }
            countE++;
        }
        callback();
    })
}

function getEvents(req, callback) {
    countE = 0;
    User.findOne({username: req.session.user}, function (err, result) {
        if (!err) {
            for (let i = 0; i < result.events.length; i++) {
                checkIfEventToday(result.events[i], function() {
                    if (countE === result.events.length) {
                        callback(null, events);
                    }
                });
            }
        }
    })

}

var checkIfToday = function(task, callback) {
    var today = new Date();
    Task.findById(task, function (err, task) {
        if (!err) {
            if (task.date.getUTCDate() === today.getDate() &&
                task.date.getUTCFullYear() === today.getFullYear() &&
                task.date.getUTCMonth() === today.getMonth()) {
                tasks.push(task);
            }
            countT++;
        }
        callback();
    })
}

function getTasks(req, callback) {
    countT = 0;
        User.findOne({username: req.session.user}, function (err, result) {
            if (!err) {
                for (let i = 0; i < result.tasks.length; i++) {
                    checkIfToday(result.tasks[i], function() {
                        if (countT === result.tasks.length) {
                            callback(null, tasks);
                        }
                    });
                }
            }
        })

}

/* GET home page. */
router.get('/', function(req, res, next) {
    tasks = [];
    events = [];
    if (req.session.user && req.session.user.length > 0) {
        getTasks(req, function (err, t) {
            if (!err) {
            getEvents(req, function (errE, e) {
                if (!err && !errE) {
                    res.render("index", {
                        user: req.session.user,
                        tasks: t,
                        events: e
                    });
                } else {
                    res.render("index", {
                        user: req.session.user,
                        tasks: [],
                        events: []
                    });
                }
            })
            }
        })
    } else {
        res.render("index", {
            user: req.session.user,
            tasks: [],
            events: []
        });
    }
});

module.exports = router;

