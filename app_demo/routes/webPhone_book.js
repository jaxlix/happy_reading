const express = require("express");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); //加载加密文件
// const redis = require('redis');   // Redis缓存数据库
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = "mongodb://localhost:27017/books";
// 缓存区
const buf = new Buffer.alloc(2048);
// const client = redis.createClient(6379, 'localhost', {});

// 连接数据库
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    const DBO = db.db("books");

    // app端注册
    router.post('/enroll', function(req, res){
        let data = {
            userName: req.body.userName,
            sex: req.body.sex,
            userPhone: req.body.userPhone,
            userEmail: req.body.userEmail,
            password: req.body.password,
            status: 1
        }
        for(let k in data){
            if(!data[k]){
                res.json({code:4, content:"参数异常"});
                return false
            }
        }
        DBO.collection("user").find({userPhone: data.userPhone}).count(function(err, num){
            if(err) throw err;
            if(num == 0){
                // 密码加密
                let pwObj = encrypt(data.password);
                data.password = pwObj.pw;
                data.key = pwObj.key;
                DBO.collection("user").insertOne(data, function(err, result) {
                    if (err){
                        res.json({code:4, content: "服务器异常"});
                        throw err;
                    }
                    res.json({code:1, content: "添加成功"});
                })
            }else{
                res.json({code:2, content: "此手机号码已注册"})
            }
        });
    });

    // APP端验证登录
    router.post('/login', function(req, res){
        let userPhone = req.body.userPhone;
        let password = req.body.password;
        if(userPhone && password){
            DBO.collection("user").find({userPhone: userPhone}).toArray(function(err, resArr) {
                if (err) throw err;
                if (resArr.length > 0) {
                    password = password + resArr[0].key;
                    let md5 = crypto.createHash('md5');
                    let r = md5.update(password).digest('hex');
                    if (r == resArr[0].password) {
                        res.json({code: 1,content: resArr[0]._id});
                    } else {
                        res.json({code: 2,content: "密码错误"});
                    }
                } else {
                    res.json({code: 2,content: "该手机号暂未注册"});
                }
            })
        }else{
            res.json({code: 4, content: "参数异常"});
        }
    });

    // 查询用户信息
    router.post('/findUserById', function(req, res){
        let userInfoId = req.body.userInfoId;
        if(!userInfoId){
            res.json({code:4, content: "参数异常"});
            return false;
        }
        DBO.collection("user").find({_id: ObjectID(userInfoId)}).toArray(function(err, result) {
            if (err) throw err;
            res.json({code:1, content:result[0]});
        });
    });

    // 分页获取书籍列表
    router.post('/findBooksOfPage', function(req, res){
        let dataNumber = req.body.dataNumber;
        let keyWord = req.body.keyWord;
        let data = {
            status: '1'
        }
        if(req.body.classes != '0'){
            data.classes = req.body.classes
        }
        if(keyWord){
            data.$or = [
                {bookName: new RegExp(keyWord)},
                {author: new RegExp(keyWord)}
            ]
        }
        DBO.collection("book").find(data).skip(dataNumber).limit(10).toArray(function(err, result) {
            if (err) throw err;
            res.json({code:1, content:result});
        });
    });

    // 书籍详情
    router.post('/findBookById', function (req, res) {
        let id = req.body.bookInfoId;
        DBO.collection("book").find({_id: ObjectID(id)}).toArray(function (err, result) {
            if (err) throw err;
            res.json({code: 1,content: result[0]});
        });
    });

    // 查询书架列表
    router.post('/findBookshelfOfPage', function(req, res){
        let userInfoId = req.body.userInfoId;
        let dataNumber = req.body.dataNumber;
        DBO.collection("bookshelf").find({userInfoId: userInfoId}).skip(dataNumber).limit(10).toArray(function(err, result) {
            if (err) throw err;
            res.json({code:1, content:result});
        });
    });

    // 加入书架
    router.post('/addToBookshelf', function(req, res){
        let data = {
            userInfoId: req.body.userInfoId,
            bookInfoId: req.body.bookInfoId,
            bookName: req.body.bookName,
            author: req.body.author,
            bookImg: req.body.bookImg,
            bookSize: req.body.bookSize,
            location: "0"
        }
        for(let k in data){
            if(k != 'location' && !data[k]){
                res.json({code:4, content: "参数异常"});
                return false;
            }
        }
        DBO.collection("bookshelf").find({userInfoId: data.userInfoId, bookInfoId: data.bookInfoId}).toArray(function(err, result) {
            if (err) throw err;
            if(result.length>0){
                res.json({code:2, content: "书籍已存在于书架"});
            }else{
                DBO.collection("bookshelf").insertOne(data, function(err, result){
                    if (err) throw err;
                    res.json({code:1, content:"已添加至书架"});
                })
            }
        });
    });

    // 下载图片接口
    router.get('/downloadImg', function(req, res){
        let img = req.query.fileName;
        if(!img){return}
        let url = path.resolve(__dirname, '../public/scratch_file/', img);
        try{
            fs.accessSync(url);
            res.sendFile(url);
        }catch(e){
            url = path.resolve(__dirname, '../public/books_img/', img);
            res.sendFile(url);
        }
    });

    // 删除书架书籍
    router.post('/delBookshelf', function(req, res){
        let bookInfoId = req.body.bookInfoId;
        let userInfoId = req.body.userInfoId;
        DBO.collection("bookshelf").deleteOne({userInfoId:userInfoId,bookInfoId: bookInfoId}, function(err, result) {
            if (err) throw err;
            res.json({code:1, content: "删除成功"});
        });
    });

    // 查询书架书籍
    router.post('/findBookshelfById', function(req, res){
        let bookInfoId = req.body.bookInfoId;
        let userInfoId = req.body.userInfoId;
        DBO.collection("bookshelf").find({userInfoId:userInfoId,bookInfoId: bookInfoId}).toArray(function(err, result) {
            if (err) throw err;
            res.json({code:1, content: result});
        });
    });

    // 分页读取书籍
    router.post('/findBookOfPage', function(req, res){
        let userInfoId = req.body.userInfoId;
        let bookInfoId = req.body.bookInfoId;
        let location = req.body.location;
        if(!bookInfoId && !location){
            res.json({code:4, content: "服务器异常"});
            return false
        }
        DBO.collection("book").find({_id: ObjectID(bookInfoId)}).toArray(function(err, result) {
            if (err) throw err;
            if(result[0].bookUrl){
                let bookUrl = './public/books_txt/'+result[0].bookUrl;
                fs.open(bookUrl, 'r', function (err, fd) {
                    if (err) throw err;
                    // 读取文件
                    fs.read(fd, buf, 0, buf.length, location, function (err, bytes) {
                        if (err) throw err;
                    
                        // 仅输出读取的字节
                        if (bytes > 0) {
                            res.json({code:1, content: buf.slice(0, bytes).toString()});
                        }else{
                            res.json({code:2, content: "终章"});
                        }
                    
                        // 关闭文件
                        fs.close(fd, function (err) {
                            if (err) throw err;
                        })
                    })
                })
            }else{
                res.json({code:4, content: "服务器异常"});
            }
        });
        let whereStr = {userInfoId: userInfoId,bookInfoId: bookInfoId};  // 查询条件
        let updateStr = {$set: { location: location }};
        DBO.collection("bookshelf").updateOne(whereStr, updateStr, function(err, result) {
            if (err) throw err;
        })
    });

});

// 密码加盐加密
function encrypt(pw){
    let key = Math.random().toString().substring(2);
    pw = pw + key;
    let md5 = crypto.createHash('md5');
    let r = md5.update(pw).digest('hex');
    return {key: key, pw: r}
}

module.exports = router;