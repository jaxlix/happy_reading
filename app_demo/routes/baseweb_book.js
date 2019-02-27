var express = require("express");
var fs = require('fs');
var path = require('path');
var crypto = require('crypto'); //加载加密文件
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var multer  = require('multer');
var url = "mongodb://localhost:27017/books";
var uploadFolder = './public/scratch_file/';
// 上传文件的保存在临时文件目录
try{
    fs.accessSync(uploadFolder); 
}catch(e){
    fs.mkdirSync(uploadFolder);
}

// 密码加盐加密
function encrypt(pw){
    var key = Math.random().toString().substring(2);
    pw = pw + key;
    var md5 = crypto.createHash('md5');
    var r = md5.update(pw).digest('hex');
    return {key: key, pw: r}
}

// 通过 filename 属性定制文件上传名称和路径
var storage = multer.diskStorage({
    // 保存的路径，备注：需要自己创建
    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },
    // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
    filename: function (req, file, cb) {
        cb(null, Date.now()+"-"+file.originalname);  
    }
});
// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage });

// 验证登录
router.post('/login', function(req, res){
    var name = req.body.userName;
    var pw = req.body.password;
    var obj = {
        code: 2,
        content: "用户名或密码错误"
    }
    if(name == "jaxlix" && pw == "abc123"){
        obj = {
            code: 1,
            content: "登录成功！"
        }
    }
    res.json(obj);
});

// 分页获取书籍列表
router.post('/findBooksOfPage', function(req, res){
    var page = parseInt(req.body.page)-1,
        rows = parseInt(req.body.rows);
    if(page<0 || !rows){
        res.json({code: 4, content: "服务器异常"});
        return
    }
    var data = {
        bookName: req.body.bookName,
        classes: req.body.classes,
        status: req.body.status
    }
    var searchObj = {};
    for(var k in data){
        data[k]&&data[k]!='0' ? searchObj[k]=data[k] : ""
    }
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("books");
        dbo.collection("book").find(searchObj).count(function(err, total) {
            if (err) throw err;
            var obj = {total:total,rows:[]};
            dbo.collection("book").find(searchObj).skip(page*rows).limit(rows).toArray(function(err, result) {
                if (err) throw err;
                if(result){
                    obj.rows = result
                }
                res.json(obj);
                db.close();
            });
        });
    });
});

// 上传书籍接口
router.post('/uploadBook', upload.single('fileBook'), function(req, res){
    var file = req.file;
    if(file.path){
        var name = file.path.split("\\").pop();
        res.json({code:1, content: {bookUrl:name, bookSize:file.size}});
    }else{
        res.json({code:4, content: "上传失败"});
    }
});

// 上传图片接口
router.post('/uploadImg', upload.single('fileImg'), function(req, res){
    var file = req.file;
    if(file.path){
        var name = file.path.split("\\").pop();
        res.json({code:1, content: name});
    }else{
        res.json({code:4, content: "上传失败"});
    }
});

// 下载图片接口
router.get('/downloadImg', function(req, res){
    var img = req.query.fileName;
    var url = path.resolve(__dirname, '../public/scratch_file/', img);
    try{
        fs.accessSync(url);
        res.sendFile(url);
    }catch(e){
        url = path.resolve(__dirname, '../public/books_img/', img);
        res.sendFile(url);
    }
});

// 添加书籍
router.post('/addBooks', function(req, res){
    var data = {
        bookName: req.body.bookName,
        author: req.body.author,
        classes: req.body.classes,
        status: req.body.status,
        abstract: req.body.abstract,
        bookUrl: req.body.bookUrl,
        bookImg: req.body.bookImg,
        bookSize: req.body.bookSize
    }
    for(var k in data){
        if(!data[k]){
            res.json({code:4, content:"参数异常"});
            return false
        }
    }
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("books");
        dbo.collection("book").insertOne(data, function(err, result) {
            if (err){
                res.json({code:4, content: "插入数据库出错"});
                throw err;
            }
            // 将临时文件添加到正式文件夹
            var sourceFile = path.resolve(__dirname, '../public/scratch_file/', data.bookUrl);
            var destPath = path.resolve(__dirname, '../public/books_txt/', data.bookUrl);
            fs.rename(sourceFile, destPath, function (err) {
                if (err){
                    res.json({code:4, content: "移动txt出错"});
                    throw err;
                }
                var sourceImg = path.resolve(__dirname, '../public/scratch_file/', data.bookImg);
                var destPathImg = path.resolve(__dirname, '../public/books_img/', data.bookImg);
                fs.rename(sourceImg, destPathImg, function (err) {
                    if (err){
                        res.json({code:4, content: "移动img出错"});
                        throw err;
                    }
                    res.json({code:1, content: "添加成功"});
                });
            });
            db.close();
        });
    });
});

// 删除书籍
router.post('/delBooks', function(req, res){
    var id = req.body.bookInfoId;
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err){
            res.json({code:4, content: "服务器异常"});
            throw err;
        }
        var dbo = db.db("books");
        dbo.collection("book").deleteOne({"_id": ObjectID(id)}, function(err, result) {
            if (err){
                res.json({code:4, content: "服务器异常"});
                throw err;
            }
            res.json({code:1, content: "删除成功"})
        });
    });
});

// 修改
router.post('/updBooks', function(req, res){
    var data = {
        _id: req.body.bookInfoId,
        bookName: req.body.bookName,
        author: req.body.author,
        classes: req.body.classes,
        status: req.body.status,
        abstract: req.body.abstract,
        bookUrl: req.body.bookUrl,
        bookImg: req.body.bookImg,
        bookSize: req.body.bookSize
    }
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("books");
        // 查询
        dbo.collection("book").find({_id: ObjectID(data._id)}).toArray(function(err, resBook) {
            if (err){
                res.json({code:4, content: "服务器异常"});
                throw err;
            }
            // 数据对比
            var o = {};
            for(var k in resBook[0]){
                if(k != "_id" && data[k] != resBook[0][k]){
                    o[k] = data[k];
                }
            }
            // 修改数据库
            dbo.collection("book").updateOne({_id: ObjectID(data._id)},{$set: o}, function(err, result) {
                if (err){
                    res.json({code:4, content: "修改数据库出错"});
                    throw err;
                }
                // 将临时文件添加到正式文件夹
                if(o.bookUrl && o.bookImg){
                    var sourceFile = path.resolve(__dirname, '../public/scratch_file/', data.bookUrl);
                    var destPath = path.resolve(__dirname, '../public/books_txt/', data.bookUrl);
                    fs.rename(sourceFile, destPath, function (err) {
                        if (err){
                            res.json({code:4, content: "移动txt出错"});
                            throw err;
                        }
                        var sourceImg = path.resolve(__dirname, '../public/scratch_file/', data.bookImg);
                        var destPathImg = path.resolve(__dirname, '../public/books_img/', data.bookImg);
                        fs.rename(sourceImg, destPathImg, function (err) {
                            if (err){
                                res.json({code:4, content: "移动img出错"});
                                throw err;
                            }
                            res.json({code:1, content: "修改成功"});
                        });
                    });
                }else{
                    res.json({code:1, content: "修改成功"});
                }
                db.close();
            });
        });
    });
});


// 用户管理**********************************************************

// 分页获取用户列表
router.post('/findUsersOfPage', function(req, res){
    var page = parseInt(req.body.page)-1,
        rows = parseInt(req.body.rows);
    if(page<0 || !rows){
        res.json({code: 4, content: "服务器异常"});
        return
    }
    var data = {
        userName: req.body.userName,
        sex: req.body.sex,
        status: req.body.status
    }
    var searchObj = {};
    for(var k in data){
        data[k]&&data[k]!='0' ? searchObj[k]=data[k] : ""
    }
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("books");
        dbo.collection("user").find(searchObj).count(function(err, total) {
            if (err) throw err;
            var obj = {total:total,rows:[]};
            dbo.collection("user").find(searchObj).skip(page*rows).limit(rows).toArray(function(err, result) {
                if (err) throw err;
                if(result){
                    obj.rows = result
                }
                res.json(obj);
                db.close();
            });
        });
    });
});

// 添加用户
router.post('/addUsers', function(req, res){
    var data = {
        userName: req.body.userName,
        sex: req.body.sex,
        status: req.body.status,
        userPhone: req.body.userPhone,
        userEmail: req.body.userEmail,
        password: req.body.password
    }
    for(var k in data){
        if(!data[k]){
            res.json({code:4, content:"参数异常"});
            return false
        }
    }
    // 密码加密
    var pwObj = encrypt(data.password);
    data.password = pwObj.pw;
    data.key = pwObj.key;
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("books");
        dbo.collection("user").find({userPhone: data.userPhone}).count(function(err, num){
            if(err) throw err;
            if(num == 0){
                dbo.collection("user").insertOne(data, function(err, result) {
                    if (err){
                        res.json({code:4, content: "服务器异常"});
                        throw err;
                    }
                    res.json({code:1, content: "添加成功"});
                })
            }else{
                res.json({code:2, content: "此手机号码已注册"})
            }
            db.close();
        });
    });
});

// MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
//     var dbo = db.db("books");
//     dbo.collection("user").deleteOne({"_id": ObjectID("5c3c2e584ea05a1d18d54549")}, function(err, result) {
//         db.close();
//     });
// });

module.exports = router;