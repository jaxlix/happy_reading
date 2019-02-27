/**
 *公共方法 
 */

//将2017-10-11或2017-10-11 10:11的字符串转为毫秒数，兼容IE8
function getTimestam(str) {
	var arr;
	if (str.indexOf(":") == -1) { //str是2017-10-11的格式
		arr = str.split("-");
		return (new Date(arr[0], arr[1] - 1, arr[2])).getTime();
	} else { //str是2017-10-11 10:11的格式
		arr = str.replace(" ", "-").replace(":", "-").split("-");
		return (new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4])).getTime();
	}
}

//时间毫秒数转换为：tp:1 yyyy-mm-dd  2:yyyy-mm-dd hh:mm  3:yyyy-mm-dd hh:mm:ss
function timeFormate(val, tp) {
	var date = new Date();
	date.setTime(val);
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var min = date.getMinutes();
	var s = date.getSeconds();
	m = m < 10 ? "0" + m : m;
	d = d < 10 ? "0" + d : d;
	h = h < 10 ? "0" + h : h;
	min = min < 10 ? "0" + min : min;
	s = s < 10 ? "0" + s : s;
	switch (tp) {
		case 1:
			return y + "-" + m + "-" + d;
			break;
		case 2:
			return y + "-" + m + "-" + d + " " + h + ":" + min;
			break;
		case 3:
			return y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s;
			break;
		default:
			return y + "-" + m + "-" + d;
			break;
	}
}

//禁止编辑
function ProhibitEdit(id,e) {
	if (!id) {
		return false;
	}
	var d = $('#' + id);
	var input = d.find("input");
	var textarea = d.find("textarea");
	var select = d.find("select");
	var button = d.find("button");
	if (e) {
		input.attr("disabled", "disabled").css("pointer-events", "none");
		textarea.attr("disabled", "disabled").css("pointer-events", "none");
		select.attr("disabled", "disabled").css("pointer-events", "none");
		button.css("pointer-events", "none");
	} else {
		input.attr("disabled", false).css("pointer-events", "auto");
		textarea.attr("disabled", false).css("pointer-events", "auto");
		select.attr("disabled", false).css("pointer-events", "auto");
		button.css("pointer-events", "auto");
	}
}

//获取url上的参数
function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return decodeURI(r[2]); return null; 
}

//令牌过期
function toOut(){
	
}

//将yyyy-MM-dd转换成long
function dateToLong(val) {
    var time1 = new Date(val).getTime();
    var time2 = time1 - 28800000;    
    return time2;
}

//将yyyy-MM-dd HH:mm转换成long
function dateTimeToLong(val) {
    var time1 = new Date((val).replace(new RegExp("-", "gm"), "/")).getTime();
    return time1;
}


//检查数字，且为正数
function checkNumber(value) {
    var checkEl = /^[0-9]*[1-9][0-9]*$/;
    if (!(checkEl.test(value)) || value < 0) {
        return false;
    }
    return true;
}

// 获取cookie
function getCookie(name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
    	return unescape(arr[2]);
    }else{
    	return null;
    }
}

// layer提示框
function layerAlert(m,t){
	layer.alert(m, {
		icon: t
	}, function (index) {
		layer.close(index)
	})
}









