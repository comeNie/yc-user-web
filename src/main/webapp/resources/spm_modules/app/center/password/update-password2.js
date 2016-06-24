define(
		'app/center/password/update-password2',
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
				},
				// 带下划线的方法，约定为内部私有方法
				_bindHandle : function() {
					//$("#randomImg").on("click", this._refrashVitentify);
					//$("#refresh").on("click", this._refrashVitentify);
					$("#phoneVerifyCode").on("blur",this._checkPhoneVerifyCodeEmpty);
					$("#phoneVerifyCode").on("focus",this._hidePhoneVerifyCode);
					$("#next").on("click", this._next);
					$("#SENDEMAIL").on("click", this._sendEmail);
					$("#PHONE_IDENTIFY").on("click", this._getPhoneVitentify);
					},
					_hideErroText : function() {
						var _this = this;
						// 初始化展示业务类型
						_this._hideInfo();
						},
						// 获取短信验证码
						_getPhoneVitentify : function() {
							$("#errorSmsMsg").attr("style", "display:none");
							var phoneFlag = $('#errorPhoneFlag').val();
							var picFlag = $('#errorPicFlag').val();
							var passFlag = $('#errorPassFlag').val();
							var smsFlag = $('#errorSMSFlag').val();
							if (phoneFlag != "0") {
								var step = 59;
								$('#PHONE_IDENTIFY').val('重新发送60');
								$("#PHONE_IDENTIFY").attr("disabled", true);
								var _res = setInterval(
									function() {
									$("#PHONE_IDENTIFY").attr(
											"disabled", true);// 设置disabled属性
									$('#PHONE_IDENTIFY').val(
											step + 's后重新发送');
									step -= 1;
									if (step <= 0) {
										$("#PHONE_IDENTIFY")
												.removeAttr("disabled"); // 移除disabled属性
										$('#PHONE_IDENTIFY').val(
												'获取验证码');
										clearInterval(_res);// 清除setInterval
										}
									}, 1000);
								var param = {
									phone : $("#phone").val()
								};
								ajaxController.ajax({
									type : "post",
									processing : false,
									url : _base + "/reg/toSendPhone",
									dataType : "json",
									data : param,
									message : "正在加载数据..",
									success : function(data) {
										if (data.responseHeader.resultCode == "9999") {
											$('#showSmsMsg').text("1分钟后可重复发送 ");
											$("#errorSmsMsg").attr("style","display:");
											$("#phoneVerifyCode").val("");
											return false;
										} else if (data.responseHeader.resultCode == "100002") {
											var msg = data.statusInfo;
											$('#showSmsMsg').text(msg);
											$("#errorSmsMsg").attr("style","display:");
											return false;
										}
									},
										error : function(XMLHttpRequest,
												textStatus, errorThrown) {
											alert(XMLHttpRequest.status);
											alert(XMLHttpRequest.readyState);
											alert(textStatus);
											}

										});
							}

						},
						
						//手机验证码非空校验
						_checkPhoneVerifyCodeEmpty : function(){
							$("#phoneVerifyCodeErrMsg").attr("style", "display:none");
							var phoneVerifyCode = $('#phoneVerifyCode').val().replace(/^\s+|\s+$/g,"");
							if(phoneVerifyCode==""){
								$("#phoneVerifyCodeErrMsgShow").text("手机验证码不能为空");
								$("#phoneVerifyCodeErrMsg").show();
								$("#phoneVerifyCodeEmptyFlag").val("0");
							}
						},
						//隐藏手机验证码错误提示
						_hidePhoneVerifyCode : function(){
							$("#phoneVerifyCodeErrMsg").attr("style", "display:none");
						},
						
						// 校验手机
						_validServicePho : function() {
							$("#phoneErrMsg").attr("style", "display:none");
							var phone = $('#phone').val();
							if (phone == "") {
								$("#phoneErrMsg").attr("style", "display:");
								$('#phoneErrMsg').attr('src',
										_base + '/theme/slp/images/icon-a.png');
								$('#phoneErrMsgShow').text("请输入正确有效的手机号码");
								$("#phoneErrMsg").show();
								$('#phoneErrFlag').val("0");
								return false;
							} else if (!(/^0?1[3|4|5|8][0-9]\d{8}$/.test(phone))) {
								$("#phoneErrMsg").attr("style", "display:");
								$('#phoneErrMsg').attr('src',
										_base + '/theme/slp/images/icon-a.png');
								$('#phoneErrMsgShow').text("请输入正确有效的手机号码");
								$("#phoneErrMsg").show();
								$('#phoneErrFlag').val("0");
								return false;
							} 
								
						},
						//校验邮箱
						_validateEmail : function(){
							$("#emailErrMsg").attr("style", "display:none");
							var email = $('#email').val();
							if (email == "") {
								$("#emailErrMsg").attr("style", "display:");
								$('#emailErrMsg').attr('src',
										_base + '/theme/slp/images/icon-a.png');
								$('#emailErrMsgShow').text("邮箱地址不能为空");
								$("#emailErrMsg").show();
								$('#emailErrFlag').val("0");
								return false;
							} else if (!(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(email))) {
								$("#emailErrMsg").attr("style", "display:");
								$('#emailErrMsg').attr('src',
										_base + '/theme/slp/images/icon-a.png');
								$('#emailErrMsgShow').text("请输入正确的邮箱");
								$("#emailErrMsg").show();
								$('#emailErrFlag').val("0");
								return false;
							} 
								
						},
						//发送验证邮件
						_sendEmail : function(){
								var param = {
								userName: $("#userName").val(),
								email:$("#email").html(),
								tenantId:$("#tenantId").val(),
								};

								ajaxController.ajax({
								type : "post",
								processing : false,
								url : _base + "/center/password/sendVerify?cacheKey="+cacheKey,
								data : param,
								message : "正在加载数据..",
								success : function(data) {
								if(data.responseHeader.resultCode =="100002"){
									$('#EmailErrMsgShow').text("3分钟内不可重复发送");
									$("#passwordErrMsg").show();
									return false;
								}if(data.responseHeader.resultCode=="000000"){
									$("#password-date2").hide();
									$("#send-email").show();
								}
								},
								
								error : function(XMLHttpRequest,
										textStatus, errorThrown) {
									alert(XMLHttpRequest.status);
									alert(XMLHttpRequest.readyState);
									alert(textStatus);
									}

									});
						},

						_next : function() {
							$("#phoneVerifyCodeEmptyFlag").val("1");
							$("#phoneVerifyCodeErrMsg").attr("style", "display:none");
							var param = {
								userMp : $("#phone").val(),
								phoneVerifyCode : $("#phoneVerifyCode").val()
								};
							var phoneVerifyCode =  $("#phoneVerifyCode").val();
							if(phoneVerifyCode==""){
								$("#phoneVerifyCodeErrMsgShow").text("手机验证码不能为空");
								$("#phoneVerifyCodeErrMsg").show();
								$("#phoneVerifyCodeEmptyFlag").val("0");
							}
								ajaxController.ajax({
									type : "post",
									processing : false,
									async: false, 
									url : _base+ "/reg/checkPhoneVerifyCode",
									dataType : "json",
									data : param,
									message : "正在加载数据..",
									success : function(data) {
										if (data.responseHeader.resultCode == "000007") {
											$('#phoneVerifyCodeErrMsgShow').text(
													"手机与发送短信手机不一致");
											$("#phoneVerifyCodeErrMsg").attr("style","display:");
											$('#phoneVerifyCodeErrFlag').val("0");
											return false;
										}
										if (data.responseHeader.resultCode == "000004") {
											$('#phoneVerifyCodeErrMsgShow').text("验证码已失效");
											$("#phoneVerifyCodeErrMsg").attr("style","display:");
											$('#phoneVerifyCodeErrFlag').val("0");
											return false;
										}
										if (data.responseHeader.resultCode == "000003") {
											$('#phoneVerifyCodeErrMsgShow').text(
													"短信验证码错误");
											$("#phoneVerifyCodeErrMsg").attr("style","display:");
											$('#phoneVerifyCodeErrFlag').val("0");
											return false;
										}
										if (data.responseHeader.resultCode == "000000") {
											$('#phoneVerifyCodeErrFlag').val("1");
											$("#phoneVerifyCodeErrMsg").attr("style","display:none");
										}
										window.location.href = _base+"/center/password/toPasswordPage?cacheKey="+cacheKey;
									},
									error : function(XMLHttpRequest,
											textStatus, errorThrown) {
										alert(XMLHttpRequest.status);
										alert(XMLHttpRequest.readyState);
										alert(textStatus);
									}
										});
						}
				    		
			});

			module.exports = UpdatePasswordPager
		});

window.onload=function(){
	$("#VerificationBorder").removeClass()
	.addClass("yellow-border");
	$("#VerificationYuan").removeClass()
	.addClass("yellow-yuan");
	$("#VerificationWord").removeClass()
		.addClass("yellow-word");
	$("#password-date1").hide();
	$("#password-date2").show();
	$("#password-date3").hide();
	$("#password-date4").hide();
}
