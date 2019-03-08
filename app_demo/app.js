var express = require("express");
var bodyParser = require("body-parser");

var app = express();

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("access-control-expose-headers", "Authorization");
    res.header("Access-Control-Allow-Headers", "Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE");
    next();
});

// json类型的body
app.use(bodyParser.json());
//string类型body
app.use(bodyParser.urlencoded({
    extended: false
}));

// 静态文件目录
app.use(express.static(__dirname + '/public'));

// 图书馆系统后台管理端路由与业务逻辑
app.use('/baseWeb/book/', require('./routes/baseweb_book'));

// 图书馆系统pc客户端路由与业务逻辑
// app.use('/webpc/bookWeb/', require('./routes/webpc_book'));

// 图书馆系统app客户端路由与业务逻辑
app.use('/webphone/bookPhone/', require('./routes/webPhone_book'));

app.listen(8080);