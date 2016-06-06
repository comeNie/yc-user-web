define(
		'app/center/password/update-password1',
		function(require, exports, module) {
			'use strict';
			var $ = require('jquery'), Validator = require('arale-validator/0.10.2/index'), Calendar = require('arale-calendar/1.1.2/index'), Widget = require('arale-widget/1.2.0/widget'), Dialog = require("artDialog/src/dialog"), AjaxController = require('opt-ajax/1.0.0/index');

			// 实例化AJAX控制处理对象
			var ajaxController = new AjaxController();

			// 定义页面组件类
			var UpdatePasswordPager = Widget.extend({
				// 属性，使用时由类的构造函数传入
				attrs : {},
				// 事件代理
				events : {
				// key的格式: 事件+空格+对象选择器;value:事件方法
				// "click [id='randomImg']":"_refrashVitentify",
				},
				init : function() {
					_hideErroText();
				},
				// 重写父类
				setup : function() {
					UpdatePasswordPager.superclass.setup.call(this);
					this._hideErroText();
					this._bindHandle();
				},
				_hideInfo : function() {
					$("#userNameErrMsg").attr("style", "display:none");
					$("#captchaErrMsg").attr("style", "display:none");
					$("#errorPicMsg").attr("style", "display:none");
					$("#phoneVerifyCodeErrMsg").attr("style", "display:none");
					$("#emailErrMsg").attr("style", "display:none");
					$("#passwordErrMsg").attr("style", "display:none");
					$("#newPasswordConfirmErrMsg").attr("style", "display:none");
				},
				// 带下划线的方法，约定为内部私有方法
				_bindHandle : function() {
					//$("#randomImg").on("click", this._refrashVitentify);
					//$("#refresh").on("click", this._refrashVitentify);
					$("#userName").on("blur",this._checkUserNameEmpty);
					$("#userName").on("focus",this._hideUserName);
					$("#pictureVitenfy").on("blur",this._checkCaptchaEmpty);
					$("#pictureVitenfy").on("focus",this._hideCaptchaErr);
					$("#next").on("click", this._next);
					$("#PHONE_IDENTIFY").on("click", this._getPhoneVitentify);
					},
					_hideErroText : function() {
						var _this = this;
						// 初始化展示业务类型
						_this._hideInfo();
						},
						//检查用户名是否为空
						_checkUserNameEmpty : function(){
							$("#userNameErrMsg").attr("style", "display:none");
							//去除两头空格
							var userName = $('#userName').val().replace(/^\s+|\s+$/g,"");
							if(userName==""){
								$("#userNameErrMsgShow").text("帐户名不能为空");
								$("#userNameErrMsg").show();
								$("#userNameEmptyFlag").val("0");
							}
						},
						//检查验证码是否为空
						_checkCaptchaEmpty : function(){
							$("#captchaErrMsg").attr("style", "display:none");
							var captcha = $('#pictureVitenfy').val().replace(/^\s+|\s+$/g,"");
							if(captcha==""){
								$("#captchaErrMsgShow").text("验证码不能为空");
								$("#captchaErrMsg").show();
								$("#captchaEmptyFlag").val("0");
							}
						},
						//隐藏账户错误提示
						_hideUserName : function(){
							$("#userNameErrMsg").attr("style", "display:none");
						},
						//隐藏验证码错误提示
						_hideCaptchaErr : function(){
							$("#captchaErrMsg").attr("style", "display:none");
						},
						// 点击下一步用户信息显示
						_next : function() {
							
							var cacheKey="";
							$("#userNameEmptyFlag").val("1");
							$("#captchaEmptyFlag").val("1");
							$('#captchaErrFlag').val("1");
							$('#errorUserNameFlag').val("1");
							
							$("#captchaErrMsg").attr("style", "display:none");
							$("#userNameErrMsg").attr("style", "display:none");
							
							$("#userNameErrMsg").attr("style", "display:none");
							//去除两头空格
							var userName = $('#userName').val().replace(/^\s+|\s+$/g,"");
							if(userName==""){
								$("#userNameErrMsgShow").text("帐户名不能为空");
								$("#userNameErrMsg").show();
								$("#userNameEmptyFlag").val("0");
								return false;
							}
						//检查验证码是否为空
							$("#captchaErrMsg").attr("style", "display:none");
							var captcha = $('#pictureVitenfy').val().replace(/^\s+|\s+$/g,"");
							if(captcha==""){
								$("#captchaErrMsgShow").text("验证码不能为空");
								$("#captchaErrMsg").show();
								$("#captchaEmptyFlag").val("0");
								return false;
							}
							//判断账户是否存在
							var param = {
									tenantId: $("#tenantId").val(),
									userName : $("#userName").val(),
									userType : $("#userType").val(),
									captcha : $("#pictureVitenfy").val()
								};
								ajaxController.ajax({
									type : "post",
									processing : false,
									async: false, 
									url : _base+ "/center/password/validateUserName",
									dataType : "json",
									data : param,
									message : "正在加载数据..",
									success : function(data) {
									if (data.responseHeader.resultCode == "100001") {
										$("#captchaErrMsgShow").text("验证码错误");
										$("#captchaErrMsg").show();
										$('#captchaErrFlag').val("0");
										return false;
									}
									if (data.responseHeader.resultCode == "100004") {
										$("#userNameErrMsgShow").text("此用户不存在，请确认用户类型和帐户名称");
										$("#userNameErrMsg").show();
										$('#errorUserNameFlag').val("0");
										return false;
									}
									cacheKey = data.data;
										},
									error : function(XMLHttpRequest,textStatus, errorThrown) {
											alert(XMLHttpRequest.status);
											alert(XMLHttpRequest.readyState);
											}
									});
								
							var userNameEmptyFlag=$('#userNameEmptyFlag').val();
							var errorUserNameFlag=$('#errorUserNameFlag').val();
							var captchaEmptyFlag=$('#captchaEmptyFlag').val();
							var captchaErrFlag=$('#captchaErrFlag').val();
				    		if(userNameEmptyFlag!=0&&errorUserNameFlag!=0&&captchaEmptyFlag!=0&&captchaErrFlag!=0){
							window.location.href = _base+"/center/password/toIdentity?cacheKey="+cacheKey;
				    		}
						}
						
						
			});

			module.exports = UpdatePasswordPager
		});

function fleshCaptcha(){
	document.getElementById("yazm").src = _base+"/center/password/getImageVerifyCode?id=" + Math.random();
}
