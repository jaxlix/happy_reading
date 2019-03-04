var MongoClient = require('mongodb').MongoClient;

// 创建数据库books
var url = 'mongodb://localhost:27017/books';
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log('数据库books已创建');

    // 在数据库books中创建集合book
    var dbase = db.db("books");
    dbase.createCollection('book', function (err, res) {
        if (err) throw err;
        console.log("创建集合book!");
        db.close();
    });

    // 用户表
    dbase.createCollection('user', function (err, res) {
        if (err) throw err;
        console.log("创建集合user!");
        db.close();
    });

    // 书架表
    dbase.createCollection('bookshelf', function (err, res) {
        if (err) throw err;
        console.log("创建集合bookshelf!");
        db.close();
    });
    
});