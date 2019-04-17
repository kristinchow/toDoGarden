var express = require('express')
var router = express.Router();
var isAuthenticated = require('../middlewares/isAuthenticated')
var User = require('../models/user.js')
var Task = require('../models/task.js')

router.post('/addTask', isAuthenticated, function (req, res, next) {
    var user = req.session.user;
    var name = req.body.name;
    var date = req.body.date;
    var points = req.body.points;
    var category = req.body.category;
    var t = new Task({ name: name, date: date, complete: false, category: category, points: points });
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

})

router.get('/addTask', isAuthenticated, function (req, res) {
    res.render('addTask', { user: req.session.user });
})

router.post('/completeTask', function(req, res) {
    var { taskID } = req.body
    Task.findById(taskID, function (err, task) {
        console.log(taskID);
        if(!err) {
                task.complete = true;
                task.save(function(err) {
                    console.log(err);
                })
                console.log(task);

        }
    })
})
module.exports = router;
