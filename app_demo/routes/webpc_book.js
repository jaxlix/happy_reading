var express = require("express");
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// 验证登录
router.post('/login', function(req, res){
    var name = req.body.userName;
    var pw = req.body.password;
    var obj = {
        code: 2,
        content: "用户名或密码错误"
    }
    if(name == "李翔" && pw == "abc123"){
        obj = {
            code: 1,
            content: "登录成功！"
        }
    }
    res.json(obj);
});

// 用户注册
router.post('/register', function(req, res){
    var data = {
        userName: req.body.userName,
        userPhone: req.body.userPhone,
        userEmail: req.body.userEmail,
        password: req.body.password
    }
    for(var k in data){
        if(!data[k]){
            res.json({code:4, content:"服务器异常"});
            return false
        }
    }
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("books");
        dbo.collection("user").find({userName:userName}).toArray(function(err, result) {
            if (err) throw err;
            var obj = {
                code: 1,
                content: "注册成功！"
            }
            console.log(result);
            if(!result){
                dbo.collection("user").insertOne(data, function(err, result2) {
                    if (err) throw err;
                    res.json(obj);
                    db.close();
                })
            }else{
                obj.code = 2;
                obj.content = "该用户名已注册";
                res.json(obj);
                db.close();
            }
        });
    });
});

// 分页获取书籍列表
router.post('/findBooksOfPage', function(req, res){
    var page = parseInt(req.body.page)-1;
    var rows = parseInt(req.body.rows);
    var obj = {total:total,rows:[]};
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("books");
        dbo.collection("book").find().skip(page*rows).limit(rows).toArray(function(err, result) {
            if (err) throw err;
            if(result){
                obj.rows = result
            }
            res.json(obj);
            db.close();
        });
    });
});

// 上传书籍接口
router.post('/uploadBook',function(req, res){
    console.log(req.body);
});

// 添加书籍
router.post('/addBooks', function(req, res){
    var bookName = req.body.bookName;
    var author = req.body.author;
    var classes = req.body.classes;
    var status = req.body.status;
    var abstract = req.body.abstract;
    var obj = {
        code: 2,
        content: "添加书籍失败"
    }
    if(bookName && author && classes && status && abstract){
        var o = {
            bookId: Math.round(Math.random()*10e5),
            bookName: bookName,
            author: author,
            classes: classes,
            status: status, 
            abstract: abstract
        }
        data.push(o);
        obj = {
            code: 1,
            content: "添加书籍成功"
        }
    }
    res.json(obj);
});


router.get('/tt', function(req, res){
    res.contentType('application/javascritp');
    res.sendFile('/ok.js', {root: __dirname + '/../public'});
});

module.exports = router;