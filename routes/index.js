var express = require('express');
var router = express.Router();
var User = require('../models/user.js')
var Task = require('../models/task.js')

/* GET home page. */
router.get('/', function(req, res, next) {
    //need to fix this, but it's retrieving today's tasks
    var tasks = [];
    var today = new Date();
    User.findOne({ username: req.session.user }, function (err, result) {
        if(!err) {
            for (let i = 0; i < result.tasks.length; i++) {
                Task.findById(result.tasks[i], function (err, task) {
                    if (!err) {
                        if (task.date.getDate() === today.getDate() &&
                            task.date.getFullYear() === today.getFullYear() &&
                            task.date.getMonth() === today.getMonth()) {
                            tasks.push(task.name);
                        }
                    }
                });
            }
        }
    })

    res.render("index", {
        user: req.session.user,
        tasks: tasks
    });

});

module.exports = router;
