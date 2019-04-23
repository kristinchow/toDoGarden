var express = require('express');
var router = express.Router();
var User = require('../models/user.js')
var Task = require('../models/task.js')
var Event = require('../models/event.js')

var checkIfEventToday = function(event, callback) {
    var today = new Date();
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

function getEvents(req, callback) {
    var promises = [];
    User.findOne({username: req.session.user}, function (err, result) {
        if (!err) {
            for (let i = 0; i < result.events.length; i++) {
                var p = new Promise(function(resolve, reject) {
                    checkIfEventToday(result.events[i], function (event) {
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

var checkIfToday = function(task, callback) {
    var today = new Date();
    Task.findById(task, function (err, task) {
        if (!err) {
            if (task.date.getUTCDate() === today.getDate() &&
                task.date.getUTCFullYear() === today.getFullYear() &&
                task.date.getUTCMonth() === today.getMonth()) {
                callback(task);
            } else {
                callback(null);
            }

        } else {
            callback(null);
        }
    })
}

function getTasks(req, callback) {
    var promises = [];
    User.findOne({username: req.session.user}, function (err, result) {
            if (!err) {
                for (let i = 0; i < result.tasks.length; i++) {
                    var p = new Promise(function(resolve, reject) {
                        checkIfToday(result.tasks[i], function(task) {
                            if (task != null) {
                                resolve(task);
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

/* GET home page. */
router.get('/', function(req, res, next) {
    var promises = []
    if (req.session.user && req.session.user.length > 0) {
        var pT = new Promise(function(resolve, reject) {
            getTasks(req, function (err, t) {
                if (!err) {
                    resolve(t);
                } else {
                    reject;
                }
            });
        })

        var pE = new Promise(function(resolve, reject) {
            getEvents(req, function (errE, e) {
                if (!errE) {
                    resolve(e);
                } else {
                    reject;
                }
            });
        })
        promises.push(pT);
        promises.push(pE);

        Promise.all(promises).then(function(values) {
            var tasks = [];
            for (let i = 0; i < values[0].length; i++) {
                if (values[0][i] != null) {
                    tasks.push(values[0][i]);
                }
            }

            var events = [];
            for (let j = 0; j < values[1].length; j++) {
                if (values[1][j] != null) {
                    events.push(values[1][j])
                }
            }
            res.render("index", {
                user: req.session.user,
                tasks: tasks,
                events: events
            });
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

