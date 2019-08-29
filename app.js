var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var docRouter = require('./routes/doc');
var swig = require('swig');
var bodyParser = require('body-parser');

var app = express();

swig.setDefaults({
    loader: swig.loaders.fs(__dirname + '/views'),//从文件载入模板，请写绝对路径，不要使用相对路径
    cache: false//设置swig页面不缓存
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));//设置项目的页面文件，也就是html文件的位置
app.set('view engine', 'html');//设置默认页面扩展名
app.set('view cache',false);//设置模板编译无缓存

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static',express.static(path.join(__dirname, 'public')));
app.use('/doc',express.static(path.join(__dirname, 'doc'),{maxAge:1}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*app.use('/', indexRouter);
app.use('/users', usersRouter);*/
app.use('/',docRouter);
app.engine('html',swig.renderFile); //使用swig渲染html文件

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
  res.render('error',{
      err:err
  });
});


module.exports = app;
