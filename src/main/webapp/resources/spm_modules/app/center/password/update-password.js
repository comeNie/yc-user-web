define(
		'app/center/password/update-password',
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
					$("#phone").on("focus", this._hidePhone);
					$("#phone").on("blur", this._checkPhoneEmpty);
					$("#phone").on("blur", this._validServicePho);
					$("#email").on("blur", this._checkEmailEmpty);
					$("#email").on("focus", this._hideEmailErr);
					$("#phoneVerifyCode").on("blur",this._checkPhoneVerifyCodeEmpty);
					$("#phoneVerifyCode").on("focus",this._hidePhoneVerifyCode);
					$("#userName").on("blur",this._checkUserNameEmpty);
					$("#userName").on("focus",this._hideUserName);
					$("#pictureVitenfy").on("blur",this._checkCaptchaEmpty);
					$("#pictureVitenfy").on("focus",this._hideCaptchaErr);
					$("#newPassword").on("blur", this._checkPasswordEmpty);
					$("#newPassword").on("blur", this._validServicePaw);
					$("#newPassword").on("focus",this._hidePassword);
					$("#newPasswordConfirm").on("focus",this._hidePasswordConfirm);
					$("#newPasswordConfirm").on("blur", this._checknewPasswordConfirmEmpty);
					$("#newPasswordConfirm").on("blur", this._passwordConfirmation);
					$("#next1").on("click", this._next1);
					$("#next2").on("click", this._next2);
					$("#PHONE_IDENTIFY").on("click", this._getPhoneVitentify);
					$("#BTN_PASSWORD").on("click", this._submit);
	
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
						//手机号非空校验
						_checkPhoneEmpty : function(){
							$("#phoneErrMsg").attr("style", "display:none");
							var phone = $('#phone').val().replace(/^\s+|\s+$/g,"");
							if(phone==""){
								$("#phoneErrMsgShow").text("手机号不能为空");
								$("#phoneErrMsg").show();
								$("#phoneEmptyFlag").val("0");
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
						//手机验证码非空校验
						_checkEmailEmpty : function(){
							$("#emailErrMsg").attr("style", "display:none");
							var email = $('#email').val().replace(/^\s+|\s+$/g,"");
							if(email==""){
								$("#emailErrMsgShow").text("邮箱不能为空");
								$("#emailErrMsg").show();
								$("#emailEmptyFlag").val("0");
							}
						},
						//密码非空校验
						_checkPasswordEmpty : function(){
							$("#passwordErrMsg").attr("style", "display:none");
							var password = $('#newPassword').val().replace(/^\s+|\s+$/g,"");
							if(password==""){
								$("#passwordErrMsgShow").text("密码不能为空");
								$("#passwordErrMsg").show();
								$("#passwordEmptyFlag").val("0");
							}
						},
						//密码确认非空校验
						_checknewPasswordConfirmEmpty : function(){
							$("#newPasswordErrMsg").attr("style", "display:none");
							var newPasswordConfirm = $('#newPasswordConfirm').val().replace(/^\s+|\s+$/g,"");
							if(newPasswordConfirm==""){
								$("#newPasswordErrMsgShow").text("新密码不能为空");
								$("#newPasswordErrMsg").show();
								$("#newPasswordEmptyFlag").val("0");
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
						//隐藏手机错误提示
						_hidePhone : function(){
							$("#phoneErrMsg").attr("style", "display:none");
						},
						//隐藏手机验证码错误提示
						_hidePhoneVerifyCode : function(){
							$("#phoneVerifyCodeErrMsg").attr("style", "display:none");
						},
						//隐藏邮箱错误提示
						_hideemailErr : function(){
							$("#emailErrMsg").attr("style", "display:none");
						},
						//隐藏密码错误提示
						_hidePassword : function(){
							$("#passwordErrMsg").attr("style", "display:none");
						},
						//隐藏确认密码错误提示
						_hidePasswordConfirm : function(){
							$("#newPasswordErrMsg").attr("style", "display:none");
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
						_passShow : function() {
							$("#errorPawMsg").show();
							$("#passwordImage").show();
							$("#showPawMsg").show();
							$("#showPawMsg").text("6-20个字符，可用字母、数字及符号的组合");
							$("#passwordImage").attr("src",
									_base + "/theme/slp/images/icon-d.png")
						},
						// 校验密码
						_validServicePaw : function() {
							var password = $('#newPassword').val();
							if (password == "") {
								$('#passwordErrMsgShow').text("请输入密码");
								$("#passwordErrMsg").show();
								return false;
							} else if (/[\x01-\xFF]*/.test(password)) {
							  if (/^\S*$/.test(password)) {
								if (/^[\x21-\x7E]{6,20}$/.test(password)) {
								$("#passwordErrMsg").hide();
								$('#passwordErrFlag').val("1");
								} else {
								$("#passwordErrMsg").show();
								$('#passwordErrMsgShow').text("6-20个字符，可用字母、数字及符号的组合 ");
								$('#passwordErrFlag').val("0");
								return false;
								}
								} else {
									$('#passwordErrMsgShow').text("不允许有空格 ");
									$("#passwordErrMsg").attr("style", "display:");
									$('#passwordErrFlag').val("0");
									return false;
								}
							} else {
								$('#passwordErrMsgShow').text("支持数字、字母、符号组合 ");
								$("#passwordErrMsg").attr("style", "display:");
								$('#passwordErrFlag').val("0");
								return false;
							}
						},

						// 点击下一步用户信息显示
						_next1 : function() {
							
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
									if (data.responseHeader.resultCode == "10012") {
										$("#captchaErrMsgShow").text("验证码错误");
										$("#captchaErrMsg").show();
										$('#captchaErrFlag').val("0");
										return false;
									}
									if (data.responseHeader.resultCode == "10013") {
										$("#userNameErrMsgShow").text("此用户不存在，请确认用户类型和帐户名称");
										$("#userNameErrMsg").show();
										$('#errorUserNameFlag').val("0");
										return false;
									}
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
							$("#VerificationBorder").removeClass()
									.addClass("yellow-border");
							$("#VerificationYuan").removeClass().addClass(
									"yellow-yuan");
							$("#VerificationWord").removeClass().addClass(
									"yellow-word");
							$("#password-date1").hide();
							$("#password-date2").show();
							$("#password-date3").hide();
							$("#password-date4").hide();
				    		}
						},
						
						_next2 : function() {
							var email = $('#email').val().replace(/^\s+|\s+$/g,"");
							var phone = $('#phone').val().replace(/^\s+|\s+$/g,"");
							var phoneVerifyCode = $('#phoneVerifyCode').val().replace(/^\s+|\s+$/g,"");
							
							$("#phoneVerifyCodeErrMsg").attr("style", "display:none");
							var param = {
								userMp : $("#phone").val(),
								phoneVerifyCode : $("#phoneVerifyCode").val()
								};
								ajaxController.ajax({
									type : "post",
									processing : false,
									async: false, 
									url : _base
											+ "/reg/checkPhoneVerifyCode",
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
										} else if (data.responseHeader.resultCode == "000004") {
											$('#phoneVerifyCodeErrMsgShow').text("验证码已失效");
											$("#phoneVerifyCodeErrMsg").attr("style","display:");
											$('#phoneVerifyCodeErrFlag').val("0");
											return false;
										} else if (data.responseHeader.resultCode == "000003") {
											$('#phoneVerifyCodeErrMsgShow').text(
													"短信验证码错误");
											$("#phoneVerifyCodeErrMsg").attr("style","display:");
											$('#phoneVerifyCodeErrFlag').val("0");
											return false;
										} else if (data.responseHeader.resultCode == "000000") {
											$('#phoneVerifyCodeErrFlag').val("1");
											$("#phoneVerifyCodeErrMsg").attr("style","display:none");
										}
									},
									error : function(XMLHttpRequest,
											textStatus, errorThrown) {
										alert(XMLHttpRequest.status);
										alert(XMLHttpRequest.readyState);
										alert(textStatus);
									}
										});
							var phoneVerifyCodeErrFlag = $("#phoneVerifyCodeErrFlag").val();
							var phoneEmptyFlag = $("#phoneEmptyFlag").val();
							var phoneErrFlag = $("#phoneErrFlag").val();
							var emailEmptyFlag = $("#emailEmptyFlag").val();
							var emailErrFlag = $("#emailErrFlag").val();
							if((phoneVerifyCodeErrFlag==1&&phoneEmptyFlag!=0&&phoneErrFlag!=0)||(emailEmptyFlag!=0&&emailErrFlag!=0)){
							$("#PasswordVerificationBorder").removeClass()
								.addClass("yellow-border");
							$("#PasswordVerificationYuan").removeClass()
									.addClass("yellow-yuan");
							$("#PasswordVerificationWord").removeClass()
									.addClass("yellow-word");
							$("#password-date1").hide();
							$("#password-date2").hide();
							$("#password-date3").show();
							$("#password-date4").hide();
							}
						},

						// 密码校验
						_passwordConfirmation : function() {
							var inputPassword = $("#newPassword").val();
							var confirmationPassword = $("#newPasswordConfirm").val();
							
							if (inputPassword != confirmationPassword) {
								$("#confirmationPasswordImage").attr('src',
										_base + '/theme/slp/images/icon-a.png');
								$("#newPasswordErrMsg").text("两次输入的密码不一致");
								$("#newPasswordErrMsgShow").show();
								$("#newPasswordErrMsg").show();
								$("#passwordNotEqualFlag").val("0");
								return false;
							} else {
								$("#newPasswordErrMsg").hide();
								$("#passwordNotEqualFlag").val("1");
								$("#confirmationPasswordImage").attr('src',
										_base + '/theme/slp/images/icon-b.png');
								return true;
							}
						},
						_submit : function() {
							var phoneFlag = $('#phoneErrFlag').val();
							var errorUserNameFlag = $('#errorUserNameFlag')
									.val();
							var errorPassFlag = $('#passwordErrFlag').val();
							var phoneVerifyCodeErrFlag = $('#phoneVerifyCodeErrFlag').val();
							var errorConfirmFlag = $('#newPasswordEmptyFlag').val();
							var errorPassEqualsFlag = $("#passwordNotEqualFlag")
									.val();
							var userType = $("#userType").val();
							
							if (errorUserNameFlag != "0" && phoneFlag != "0"
								&& errorPassFlag != "0"
								&& phoneVerifyCodeErrFlag != "0"
								&& errorConfirmFlag != "0"
								&& errorPassEqualsFlag != "0") {
							var param = {
								userLoginName: $("#userName").val(),
								userLoginPwd: hex_md5($("#newPassword").val()),
								userType:$("#userType").val(),
								tenantId:$("#tenantId").val()
								};

								ajaxController.ajax({
								type : "post",
								processing : false,
								url : _base + "/center/password/updatePassword",
								data : param,
								message : "正在加载数据..",
								success : function(data) {
								if (data.responseHeader.resultCode == "success") {
								$("#FinishPasswordBorder").removeClass()
									.addClass("yellow-border");
								$("#FinishPasswordYuan").removeClass()
										.addClass("yellow-yuan");
								$("#FinishPasswordWord").removeClass()
										.addClass("yellow-word");
								$("#password-date1").hide();
								$("#password-date2").hide();
								$("#password-date3").hide();
								$("#password-date4").show();
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
						
						//获取短信验证码
				    	_getPhoneVitentify: function(){
				    		var phoneFlag=$('#phoneErrFlag').val();
				    		if(phoneFlag!="0"){
				            	 var step = 59;
				                 $('#PHONE_IDENTIFY').val('重新发送60');
				                 $("#PHONE_IDENTIFY").attr("disabled", true);
				                 var _res = setInterval(function(){
				                     $("#PHONE_IDENTIFY").attr("disabled", true);//设置disabled属性
				                     $('#PHONE_IDENTIFY').val(step+'s后重新发送');
				                     step-=1;
				                     if(step <= 0){
				                     $("#PHONE_IDENTIFY").removeAttr("disabled"); //移除disabled属性
				                     $('#PHONE_IDENTIFY').val('获取验证码');
				                     clearInterval(_res);//清除setInterval
				                     }
				                 },1000);
				            	 var	param={
				     					phone:	$("#phone").val()
				     				   };
				         		ajaxController.ajax({
				     			        type: "post",
				     			        processing: false,
				     			        url: _base+"/reg/toSendPhone",
				     			        dataType: "json",
				     			        data: param,
				     			        message: "正在加载数据..",
				     			        success: function (data) {
				     			        	if(data.responseHeader.resultCode=="9999"){
				    			        		$('#phoneVerifyCodeErrMsgShow').text("1分钟后可重复发送 ");
				    			    			$("#errorSmsMsg").attr("style","display:");
				    			    			$("#phoneVerifyCode").val("");
				    							return false;
				    			        	}else if(data.responseHeader.resultCode=="100002"){
				    			        		var msg = data.statusInfo;
				    			        		$('#showSmsMsg').text(msg);
				    			    			$("#errorSmsMsg").attr("style","display:");
				    							return false;
				    			        	}
				     			        },
				     			        error: function(XMLHttpRequest, textStatus, errorThrown) {
				     						 alert(XMLHttpRequest.status);
				     						 alert(XMLHttpRequest.readyState);
				     						 alert(textStatus);
				     						   }
				     			        
				     			    }); 
				             }
				    		
				    	}
						
			});

			module.exports = UpdatePasswordPager
		});

function fleshCaptcha(){
	document.getElementById("yazm").src = _base+"/center/password/getImageVerifyCode?id=" + Math.random();
}