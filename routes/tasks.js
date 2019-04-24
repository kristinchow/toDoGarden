var express = require('express')
var router = express.Router();
var isAuthenticated = require('../middlewares/isAuthenticated')
var User = require('../models/user.js')
var Task = require('../models/task.js')
var Plant = require('../models/plant.js')

var getPlant = function(id, callback) {
    Plant.findById(id, function (err, plant) {
        if (!err) {
            callback(plant)
        } else {
            callback(null);
        }
    })
}

router.post('/addTask', isAuthenticated, function (req, res, next) {
    var user = req.session.user;
    var name = req.body.name;
    var date = req.body.date;
    var points = req.body.points;
    var plantid = req.body.category;
    getPlant(plantid, function(plant) {
        if (plant != null) {
            var t = new Task({ name: name, date: date, complete: false, plant: plant, points: points });
            console.log(t)
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
        }
    })

})

var getPlant = function(id, callback) {
    Plant.findById(id, function (err, plant) {
        if (!err) {
            callback(plant)
        } else {
            callback(null);
        }
    })
}


function getPlants(req, callback) {
    var promises = [];
    User.findOne({username: req.session.user}, function (err, result) {
        if (!err) {
            for (let i = 0; i < result.plants.length; i++) {
                var p = new Promise(function(resolve, reject) {
                    getPlant(result.plants[i], function (plant) {
                        if (plant != null) {
                            resolve(plant);
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


router.get('/addTask', isAuthenticated, function (req, res) {
    getPlants(req, function(err, p) {
        if (!err) {
            res.render('addTask', {
                user: req.session.user,
                plants: p
            });
        } else {
            res.render('addTask', {
                user: req.session.user,
                plants: []
            });
        }

    });
})

var getPlant = function(id, callback) {
    Plant.findById(id, function (err, plant) {
        if (!err) {
            callback(plant)
        } else {
            callback(null);
        }
    })
}


router.post('/completeTask', function(req, res) {
    var { taskID } = req.body
    Task.findById(taskID, function (err, task) {
        console.log(taskID);
        if(!err) {
            var points = task.points;
            var plant = task.plant;
            getPlant(plant, function(p) {
                p.points += points;
                p.save(function(err) {
                    console.log(err);
                });
            });
                task.complete = true;
                task.save(function(err) {
                    console.log(err);
                })
                console.log(task);

        }
    })
})
module.exports = router;
