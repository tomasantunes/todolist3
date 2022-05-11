var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const res = require('express/lib/response');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todolist',
});

con.connect(function(err) {
  if (err) {
    console.log("MySQL is not connected.");
    throw err;
  }
  console.log("Connected to MySQL!");
});

app.get("/tasks/list", (req, res) => {
  var sql = "SELECT * FROM tasks;";

  con.query(sql, function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.json(result);
  });
});

app.post("/tasks/add", (req, res) => {
  var task = req.body.task;

  var sql = "INSERT INTO tasks (task, is_done) VALUES (?, ?);";

  con.query(sql, [task, 0], function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.json({status: "OK", data: "A task has been added successfully."});
  });
});

app.post("/tasks/check", (req, res) => {
  var id = req.body.id;
  var is_done = req.body.is_done;

  var sql = "UPDATE tasks SET is_done = ? WHERE id = ?;";

  con.query(sql, [is_done, id], function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.json({status: "OK", data: "A task has been updated."});
  });
});

app.post("/tasks/delete", (req, res) => {
  var id = req.body.id;

  var sql = "DELETE FROM tasks WHERE id = ?;";

  con.query(sql, [id], function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.json({status: "OK", data: "A task has been deleted."})
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname) + '/todolist_frontend/build/index.html');
});

app.use(express.static('todolist_frontend/build'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
