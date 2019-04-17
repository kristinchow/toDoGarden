var express = require('express')
var router = express.Router();
var isAuthenticated = require('../middlewares/isAuthenticated')
var User = require('../models/user.js')
var Event = require('../models/event.js')

router.post('/addEvent', isAuthenticated, function (req, res, next) {
    var user = req.session.user;
    var name = req.body.name;
    var date = req.body.date;
    var allday = req.body.allday;
    var s = req.body.start;
    var e = req.body.end;
    var category = req.body.category;

    var start = s;
    var end = e;
    var allDay = false;

    if (allday === 'on') {
        allDay = true;
        start = '00:00';
        end = '00:10';
    }

    var e = new Event({ name: name, date: date, allDay: allDay, startTime: start, endTime: end, category: category });
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
