var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieSession = require('cookie-session');
var logger = require('morgan');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var Task = require('./models/task.js')

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todogarden')

var indexR = require("./routes/index");
var accountRouter = require('./routes/account.js');
var calendarRouter = require('./routes/calendar.js');
var taskR = require('./routes/tasks.js');
var eventsR = require('./routes/events.js');


var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieSession({
    name: 'local-session',
    keys: ['spooky'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "njk");

app.use("/", indexR);
app.use('/', accountRouter)
app.use('/', taskR);
app.use('/', calendarRouter);
app.use('/', eventsR);

let nunjunksEnv = nunjucks.configure(path.join(__dirname, "views"), {
    autoescape: true,
    express: app,
    watch: true,
    noCache: true
});

nunjunksEnv.addFilter("string", function(content) {
    return JSON.stringify(content);
});

nunjunksEnv.addFilter("niceDate", function(content) {
    let options = {
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        hour12: true,
        minute: "2-digit"
    };
    let date = content.toLocaleString("en-US", options);
    return date;
});

nunjunksEnv.addFilter("completeTask", function(content) {
    Task.findById(content, function (err, task) {
        console.log(id);
        if(!err) {
            console.log(task);
            return(task);
        }
    })
})
// don't put any routes below here!
app.use(function (err, req, res, next) {
    return res.send('ERROR :  ' + err.message)
})


module.exports = app;
