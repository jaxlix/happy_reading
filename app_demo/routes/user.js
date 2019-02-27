var express = require("express");
var router = express.Router();

router.all('/list', function(req, res){
    console.log(req.method);
    console.log(req.baseUrl);
    console.log(req.path);

    console.log(req.headers['user-agent']);
    console.log(req.get('user-agent'));

    // 参数
    console.log(req.query);
    console.log(req.query.id);

    // post请求中获取body中的参数
    console.log(req.body);
    console.log(req.body.name);
    console.log(req.body.pw);

    res.send("hello");
});

router.get('/aa/:id', function(req, res){
    console.log(req.params.id);
    res.send("ok");
});

router.get('/fb', function(req, res){
    res.status(403).send("forbidden!");
});

router.get('/tt', function(req, res){
    res.contentType('application/javascritp');
    res.sendFile('/ok.js', {root: __dirname + '/../public'});
});

router.get('/mm', function(req, res){
    let arr = [
        {name:"lilei"},
        {name:"hanmeimei"},
        {name:"zhangzhidong"}
    ];
    res.json(arr);
});

module.exports = router;