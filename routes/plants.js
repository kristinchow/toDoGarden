var express = require('express')
var router = express.Router();
var isAuthenticated = require('../middlewares/isAuthenticated')
var User = require('../models/user.js')
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


router.get('/myplants', isAuthenticated, function (req, res) {
    getPlants(req, function(err, p) {
        if (!err) {
            res.render('plants', {
                user: req.session.user,
                plants: p
            });
        } else {
            res.render('plants', {
                user: req.session.user,
                plants: []
            });
        }

    });
})


router.get('/addPlant', isAuthenticated, function (req, res) {
    res.render('addPlant', {
        user: req.session.user
    });
})

router.post('/addPlant', isAuthenticated, function (req, res) {
    var user = req.session.user;
    var name = req.body.name;
    var type = req.body.type;
    var date = new Date();

    var p = new Plant({ name: name, date: date, type: type, points: 0})
    console.log(p)
    p.save(function (err, result) {
        if (err) {
            next(err)
        }
        if (!err) {
            console.log(result)
            User.findOneAndUpdate({ username: user }, {$push:{plants: p}}, {new: true}, (err, result) => {
                if (err) {
                    console.log(err)
                }
            });
            res.redirect('/')
        }
    })
})


module.exports = router;
