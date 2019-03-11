export default class Tool {
    static IP = Tool.getQueryString("locIp") || "http://47.96.19.54:8080";//;"http://127.0.0.1:8080";//
    static SESSION = Tool.getQueryString("session") || "1527ebe0dfb640b3922cae9bb990c7e8";

    //判断安卓或ios
    static isIos(){
        let u = navigator.userAgent;
        if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            return true;
        }else{
            return false;
        }
    }

    // 获取URL参数
    static getQueryString(name){
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null; 
    }

    //原生跳转
    static toNewpage(jUrl){
        window.location.href = jUrl;
        //this.isIos() ? window.webkit.messageHandlers.pushToNewController.postMessage(jUrl) : window.app.pushToNewController(jUrl);
    }

    // 原生返回
    static returnPage(){
        window.history.go(-1);
        //this.isIos() ? window.webkit.messageHandlers.returnPage.postMessage(null) : window.app.returnPage();
    }

    // 原生返回并调用回调中的方法
    static returnPagereload(func) {
        this.isIos() ? window.webkit.messageHandlers.returnPagereload.postMessage(func) : window.app.returnPagereload(func);
    }

    //令牌过期的方法
    static loginOut(){
        this.isIos() ? window.webkit.messageHandlers.loginOut.postMessage(null) : window.app.loginOut();
    }

    //日期格式化
    static formate(t, f) {
        if (!t) {
            return t;
        }
        let time = new Date(t);
        let y = time.getFullYear();
        let m = time.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d = time.getDate();
        d = d < 10 ? '0' + d : d;
        let h = time.getHours();
        h = h < 10 ? '0' + h : h;
        let min = time.getMinutes();
        min = min < 10 ? '0' + min : min;
        let s = time.getSeconds();
        s = s < 10 ? '0' + s : s;
        if (!f) {
            return y + "-" + m + "-" + d;
        } else if (f === 1) {
            return y + "-" + m + "-" + d + " " + h + ":" + min;
        } else if(f === 2){
            return y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s;
        } else if(f === 3){
            return h + ":" + min;
        }else if (f===4) {
            return  m + "-" + d + " " + h + ":" + min;
        }else if (f===5) {
            return m + "-" + d + " " + h + ":" + min
        }
        
    }

    static msg(m,t){console.log(m);
        if(t === 'alert'){
            t='alert'
        }else if(!t ||isNaN(Number(t))){
            t=2000
        }
        let id = Math.random();
        let div = document.createElement("div");
        div.id = id;
        div.className = "layer-model";
        div.setAttribute("flex","main:center cross:center");
        div.innerHTML = "<span class='layer-msg'>"+m+"</span>";
        document.body.appendChild(div);
        if(t !== 'alert'){
            var times = setTimeout(function(){
                document.body.removeChild(document.getElementById(id));
            },t)
        }
        document.getElementById(id).addEventListener("click",function(){
            if(t !== 'alert'){clearInterval(times)}
            document.body.removeChild(document.getElementById(id));
        });
    }

    static classes(k){
        let obj = {
            "1": "小说",
            "2": "名著",
            "3": "随笔",
            "4": "散文",
            "5": "历史",
            "6": "哲学",
            "7": "传记",
            "8": "经济",
            "9": "科技"
        }
        if(k){
            return obj[k]
        }
    }
    
}