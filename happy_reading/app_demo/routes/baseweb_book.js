const express = require("express");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); //加载加密文件
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const multer  = require('multer');
const url = "mongodb://localhost:27017/books";
const uploadFolder = './public/scratch_file/';
// 上传文件的保存在临时文件目录
try{
    fs.accessSync(uploadFolder); 
}catch(e){
    fs.mkdirSync(uploadFolder);
}

// 密码加盐加密
function encrypt(pw){
    let key = Math.random().toString().substring(2);
    pw = pw + key;
    let md5 = crypto.createHash('md5');
    let r = md5.update(pw).digest('hex');
    return {key: key, pw: r}
}

// 通过 filename 属性定制文件上传名称和路径
const storage = multer.diskStorage({
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
const upload = multer({ storage: storage });


// 连接数据库
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    const DBO = db.db("books");

    // 验证登录
    router.post('/login', function(req, res){
        let name = req.body.userName;
        let pw = req.body.password;
        let obj = {
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
        let page = parseInt(req.body.page)-1,
            rows = parseInt(req.body.rows);
        if(page<0 || !rows){
            res.json({code: 4, content: "服务器异常"});
            return
        }
        let data = {
            bookName: req.body.bookName,
            classes: req.body.classes,
            status: req.body.status
        }
        let searchObj = {};
        for(let k in data){
            data[k]&&data[k]!='0' ? searchObj[k]=data[k] : ""
        }
        DBO.collection("book").find(searchObj).count(function(err, total) {
            if (err) throw err;
            let obj = {total:total,rows:[]};
            DBO.collection("book").find(searchObj).skip(page*rows).limit(rows).toArray(function(err, result) {
                if (err) throw err;
                if(result){
                    obj.rows = result
                }
                res.json(obj);
            });
        });
    });

    // 上传书籍接口
    router.post('/uploadBook', upload.single('fileBook'), function(req, res){
        let file = req.file;
        if(file.path){
            let name = file.path.split("\\").pop();
            res.json({code:1, content: {bookUrl:name, bookSize:file.size}});
        }else{
            res.json({code:4, content: "上传失败"});
        }
    });

    // 上传图片接口
    router.post('/uploadImg', upload.single('fileImg'), function(req, res){
        let file = req.file;
        if(file.path){
            let name = file.path.split("\\").pop();
            res.json({code:1, content: name});
        }else{
            res.json({code:4, content: "上传失败"});
        }
    });

    // 下载图片接口
    router.get('/downloadImg', function(req, res){
        let img = req.query.fileName;
        let url = path.resolve(__dirname, '../public/scratch_file/', img);
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
        let data = {
            bookName: req.body.bookName,
            author: req.body.author,
            classes: req.body.classes,
            status: req.body.status,
            abstract: req.body.abstract,
            bookUrl: req.body.bookUrl,
            bookImg: req.body.bookImg,
            bookSize: req.body.bookSize
        }
        for(let k in data){
            if(!data[k]){
                res.json({code:4, content:"参数异常"});
                return false
            }
        }
        DBO.collection("book").insertOne(data, function(err, result) {
            if (err){
                res.json({code:4, content: "插入数据库出错"});
                throw err;
            }
            // 将临时文件添加到正式文件夹
            let sourceFile = path.resolve(__dirname, '../public/scratch_file/', data.bookUrl);
            let destPath = path.resolve(__dirname, '../public/books_txt/', data.bookUrl);
            fs.rename(sourceFile, destPath, function (err) {
                if (err){
                    res.json({code:4, content: "移动txt出错"});
                    throw err;
                }
                let sourceImg = path.resolve(__dirname, '../public/scratch_file/', data.bookImg);
                let destPathImg = path.resolve(__dirname, '../public/books_img/', data.bookImg);
                fs.rename(sourceImg, destPathImg, function (err) {
                    if (err){
                        res.json({code:4, content: "移动img出错"});
                        throw err;
                    }
                    res.json({code:1, content: "添加成功"});
                });
            });
        });
    });

    // 删除书籍
    router.post('/delBooks', function(req, res){
        let id = req.body.bookInfoId;
        DBO.collection("book").deleteOne({"_id": ObjectID(id)}, function(err, result) {
            if (err){
                res.json({code:4, content: "服务器异常"});
                throw err;
            }
            res.json({code:1, content: "删除成功"})
        });
    });

    // 修改
    router.post('/updBooks', function(req, res){
        let data = {
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
        // 查询
        DBO.collection("book").find({_id: ObjectID(data._id)}).toArray(function(err, resBook) {
            if (err){
                res.json({code:4, content: "服务器异常"});
                throw err;
            }
            // 数据对比
            let o = {};
            for(let k in resBook[0]){
                if(k != "_id" && data[k] != resBook[0][k]){
                    o[k] = data[k];
                }
            }
            // 修改数据库
            DBO.collection("book").updateOne({_id: ObjectID(data._id)},{$set: o}, function(err, result) {
                if (err){
                    res.json({code:4, content: "修改数据库出错"});
                    throw err;
                }
                // 将临时文件添加到正式文件夹
                if(o.bookUrl && o.bookImg){
                    let sourceFile = path.resolve(__dirname, '../public/scratch_file/', data.bookUrl);
                    let destPath = path.resolve(__dirname, '../public/books_txt/', data.bookUrl);
                    fs.rename(sourceFile, destPath, function (err) {
                        if (err){
                            res.json({code:4, content: "移动txt出错"});
                            throw err;
                        }
                        let sourceImg = path.resolve(__dirname, '../public/scratch_file/', data.bookImg);
                        let destPathImg = path.resolve(__dirname, '../public/books_img/', data.bookImg);
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
            });
        });
    });


    // 用户管理**********************************************************

    // 分页获取用户列表
    router.post('/findUsersOfPage', function(req, res){
        let page = parseInt(req.body.page)-1,
            rows = parseInt(req.body.rows);
        if(page<0 || !rows){
            res.json({code: 4, content: "服务器异常"});
            return
        }
        let data = {
            userName: req.body.userName,
            sex: req.body.sex,
            status: req.body.status
        }
        let searchObj = {};
        for(let k in data){
            data[k]&&data[k]!='0' ? searchObj[k]=data[k] : ""
        }
        DBO.collection("user").find(searchObj).count(function(err, total) {
            if (err) throw err;
            let obj = {total:total,rows:[]};
            DBO.collection("user").find(searchObj).skip(page*rows).limit(rows).toArray(function(err, result) {
                if (err) throw err;
                if(result){
                    obj.rows = result
                }
                res.json(obj);
            });
        });
    });

    // 添加用户
    router.post('/addUsers', function(req, res){
        let data = {
            userName: req.body.userName,
            sex: req.body.sex,
            status: req.body.status,
            userPhone: req.body.userPhone,
            userEmail: req.body.userEmail,
            password: req.body.password
        }
        for(let k in data){
            if(!data[k]){
                res.json({code:4, content:"参数异常"});
                return false
            }
        }
        // 密码加密
        let pwObj = encrypt(data.password);
        data.password = pwObj.pw;
        data.key = pwObj.key;
        DBO.collection("user").find({userPhone: data.userPhone}).count(function(err, num){
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
        });
    });

});

module.exports = router;