const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors=require('cors')
//graphsetup
const schema=require('./schema/igSchema.js')
const expGraph=require('express-graphql')
const root=require('./resolver/resolver.js')

const indexRouter = require('./routes/index');
const testRoute=require('./routes/testRoute.js');
const igRouter=require('./routes/igRouter.js');
const usersRouter = require('./routes/users');

const app = express();

const db=require('mongoose');

db.connect('mongodb://127.0.0.1:27017/igServer',{useNewUrlParser:true});
db.connection.once('open',() => {console.log("berhasil konek yess")});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('express-group-routes')

app.use('/', testRoute);
app.use('/users', usersRouter);
app.use('/v1',igRouter)
app.get('/test', testRoute);

//setGraphql
app.use('/graphql',expGraph({
  schema
}))

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
