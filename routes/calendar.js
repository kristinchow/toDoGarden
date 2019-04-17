var express = require('express')
var router = express.Router();
var isAuthenticated = require('../middlewares/isAuthenticated')
var User = require('../models/user.js')

router.get('/monthly', function (req, res) {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var max = lastDay.getDate();
    var it = 0;

    var weeks = [];
    console.log(max)
    var f = firstDay.getDay();

    while (it != max) {
        var weekObj = {
            days: []
        };
        for (let i = 0; i < 7; i++) {
            if (i < f || i > f) {
                weekObj.days.push(0);
            } else {
                f++;
                it++;
                weekObj.days.push(it);
                if (it === max) {
                    f = 0;
                }
            }
        }
        f = 0;
        weeks.push(weekObj);
    }
    res.render('monthly', {
        user: req.session.user,
        weeks: weeks
    })
})
module.exports = router;