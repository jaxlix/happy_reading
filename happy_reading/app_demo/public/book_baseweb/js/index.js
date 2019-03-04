/*
 *layui模块化入口文件
 * */
var layer, form, upload, element;

//1.确认模块名
// layui.define(function(exports) {
// 	exports('common');
// });

//2.设定扩展模块所在的目录
// layui.config({
// 	base: "/book_baseweb/js/"
// }).extend({
// 	common: "common"
// });

//3.预先加载模块
layui.use(['layer', 'form', 'upload', 'element'], function() {
	layer = layui.layer;
	form = layui.form;
	upload = layui.upload;
	element = layui.element;
	bind();
});


//绑定公共事件
function bind() {
	// 绑定顶部导航，显示对应的左侧导航
	$("#nav-top").on("click", "li", function () {
		var i = $(this).attr("data-id");
		$("#" + i).addClass("nav-left-show").siblings().removeClass("nav-left-show");
		//加载左侧导航第一项
		$(".nav-left-show .jump-page").eq(0).trigger("click").addClass("layui-this").siblings().removeClass("layui-this");
	});

	// 绑定左侧导航，显示对应主体内容
	$('body').on("click", ".jump-page", function() {
		var url = $(this).attr("lUrl");
		$("#index-content").load(url);
		document.title = $(this).find("a").html();
	});
	
	//默认加载顶部导航第一项
	$("#nav-top>li").eq(0).trigger("click").addClass("layui-this");
	
	//easyui列表查询事件
	$('body').on("click", "#query-enter", function() {
		// 获取Form内的值,表单内的值必须加上name属性
		var obj = {};
		$($("#query-form").serializeArray()).each(function(i,b){
			obj[b.name] = b.value;
		});
		$('#dg').datagrid('options').queryParams = obj;
		$("#dg").datagrid('load');
	});

	//绑定点击详情中的编辑
	$('body').on("click", ".bj-btn", function() {
		var formId = $(this).attr("formId");
		var btnId = $(this).attr("btnId");
		//点击编辑，使表单可编辑
		if (formId) {
			$(formId).find("input").attr("disabled", false);
			$(formId).find("textarea").attr("disabled", false);
			$(formId).find("select").attr("disabled", false);
			$(formId).find(".easy-enable").combobox("enable");
		}
		if(formId=="#guizeForm"){
			$(".addInput").show();
			$(".addInput").siblings(".cs").children(".layui-icon").show();
		}
		//点击编辑，显示立即提交
		if (btnId) {
			$(btnId).show();
		}
		//刷新sel 赋值完成后必须刷新
		form.render();
	});
	
	//绑定查看图片
	$('body').on("click", ".big-img", function() {
		var src = $(this).attr("src")
		var data = {
			"title": "查看图片",
			"start": 0,
			"id": "imgid",
			"data": [{
				"alt": "",
				"pid": "id",
				"src": src,
				"thumb": ""
			}]
		};
		layer.photos({
			photos: data,
			anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机
		});
	});

	//返回事件
	$('#body').on("click", ".return-load", function() {
		$("#centent-con .centent-conIn:first").next().show();
		$("#centent-con .centent-conIn:first").remove();
		$("#dg").datagrid("reload"); //刷新当前列表
	});

	// 自定义表单校验方法
	form.verify({
		required: function(value) {
			if (value == "请选择" || !value) {
				return '必填项不能为空';
			}
		},
		requiredImg: function(e) {
			if (!e) {
				return '请上传图片';
			}
		}
	});
}
