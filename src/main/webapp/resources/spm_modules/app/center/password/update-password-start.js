define(
		'app/center/password/update-password-start',
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
					$("#errorPhoneMsg").attr("style", "display:none");
					$("#errorPawMsg").attr("style", "display:none");
					$("#errorPicMsg").attr("style", "display:none");
					$("#errorSmsMsg").attr("style", "display:none");
					$("#errorShowPM").attr("style", "display:none");
				},
				// 带下划线的方法，约定为内部私有方法
				_bindHandle : function() {
					//$("#randomImg").on("click", this._refrashVitentify);
					//$("#refresh").on("click", this._refrashVitentify);
					$("#phone").on("focus", this._hidePhoneError);
					$("#phone").on("keyup", this._validServicePho);
					$("#phone").on("blur", this._checkPhoneEmpty);
					$("#email").on("blur", this._checkEmailEmpty);
					$("#password").on("blur", this._checkPasswordEmpty);
					$("#newPassowrd").on("blur", this._checkNewPassowrdEmpty);
					$("#phoneVerifyCode").on("blur",this._checkPhoneVerifyCodeEmpty);
					$("#userName").on("blur",this._checkUserNameEmpty);
					$("#pictureVitenfy").on("blur",this._checkCaptchaEmpty);
					$("#password").on("blur", this._checkPasswordEmpty);
					$("#newPassword").on("blur", this._checkNewPasswordEmpty);
					$("#inputPassword").on("keyup",this._validServicePaw);
					$("#inputPassword").on("blur",this._validServicePaw);
					$("#confirmationPassword").on("focus",
							this._passwordConfirmationShow);
					$("#confirmationPassword").on("keyup",
							this._checkConfirmPassword);
					$("#confirmationPassword").on("keyup",
							this._passwordConfirmation);
					$("#confirmationPassword").on("blur",
							this._checkConfirmPassword);
					$("#confirmationPassword").on("blur",
							this._passwordConfirmation);
					$("#pictureVitenfy").on("focus", this._hidePicError);
					$("#pictureVitenfy").on("blur",this._validServicePic);
					$("#phoneVerifyCode").on("keyup",this._validPhoneVerifyCode);
					$("#next1").on("click", this._next1);
					$("#next2").on("click", this._next2);
					$("#PHONE_IDENTIFY").on("click",
							this._validServicePho);
					$("#PHONE_IDENTIFY").on("click",
							this._getPhoneVitentify);
					$("#BTN_PASSWORD").on("click", this._userNameCheck);
					$("#BTN_PASSWORD").on("click",
							this._passwordConfirmation);
					$("#BTN_PASSWORD").on("click",
							this._validServicePaw);
					$("#BTN_PASSWORD").on("click",
							this._validServiceSSM);
					$("#BTN_PASSWORD").on("click",
							this._checkConfirmPassword);
					$("#BTN_PASSWORD").on("click",
							this._validServicePho);
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
											$('#showSmsMsg').text(
													"1分钟后可重复发送 ");
											$("#errorSmsMsg")
													.attr("style",
															"display:");
											$("#phoneVerifyCode").val(
													"");
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
								$("userNameEmptyFlag").val("0");
							}
						},
						//检查验证码是否为空
						_checkCaptchaEmpty : function(){
							$("captchaErrMsg").attr("style", "display:none");
							var captcha = $('#pictureVitenfy').val().replace(/^\s+|\s+$/g,"");
							if(captcha==""){
								$("#captchaErrMsgShow").text("验证码不能为空");
								$("#captchaErrMsg").show();
								$("captchaEmptyFlag").val("0");
							}
						},
						//手机号非空校验
						_checkPhoneEmpty : function(){
							$("phoneErrMsg").attr("style", "display:none");
							var phone = $('#phone').val().replace(/^\s+|\s+$/g,"");
							if(phone==""){
								$("#phoneErrMsgShow").text("手机号不能为空");
								$("#phoneErrMsg").show();
								$("phoneEmptyFlag").val("0");
							}
						},
						//手机验证码非空校验
						_checkPhoneVerifyCodeEmpty : function(){
							$("phoneVerifyCodeErrMsg").attr("style", "display:none");
							var phoneVerifyCode = $('#phoneVerifyCode').val().replace(/^\s+|\s+$/g,"");
							if(phoneVerifyCode==""){
								$("#phoneVerifyCodeErrMsgShow").text("手机验证码不能为空");
								$("#phoneVerifyCodeErrMsg").show();
								$("phoneVerifyCodeEmptyFlag").val("0");
							}
						},
						//手机验证码非空校验
						_checkEmailEmpty : function(){
							$("emailErrMsg").attr("style", "display:none");
							var email = $('#email').val().replace(/^\s+|\s+$/g,"");
							if(email==""){
								$("#emailErrMsgShow").text("邮箱不能为空");
								$("#emailErrMsg").show();
								$("emailEmptyFlag").val("0");
							}
						},
						//密码非空校验
						_checkPasswordEmpty : function(){
							$("passwordErrMsg").attr("style", "display:none");
							var password = $('#password').val().replace(/^\s+|\s+$/g,"");
							if(password==""){
								$("#passwordErrMsgShow").text("密码不能为空");
								$("#passwordErrMsg").show();
								$("passwordEmptyFlag").val("0");
							}
						},
						//新密码非空校验
						_checkNewPasswordEmpty : function(){
							$("newPasswordErrMsg").attr("style", "display:none");
							var newPassword = $('#newPassword').val().replace(/^\s+|\s+$/g,"");
							if(newPassword==""){
								$("#newPasswordErrMsgShow").text("新密码不能为空");
								$("#newPasswordErrMsg").show();
								$("newPasswordEmptyFlag").val("0");
							}
						},
						
						// 刷新验证码
						_refrashVitentify : function() {
							// 隐藏错误提示
							$("#errorPicMsg").attr("style", "display:none");
							var timestamp = (new Date()).valueOf();
							$("#pictureVitenfy").html("");
							$("#randomImg").attr("src",_base+ "/reg/getImageVerifyCode?timestamp="+ timestamp);
						},
						// 隐藏手机提示信息
						_hidePhoneError : function() {
							$("#errorPhoneMsg").attr("style", "display:none");
						},
						// 隐藏图片验证提示信息
						_hidePicError : function() {
							$("#errorPicMsg").attr("style", "display:none");
						},
						
						_hideUserNameError : function() {
							$("#errorUserNameMsg").show();
							$("#userNameErrMsgShow").show();
							$("#userNameImage").show();
							$("#userNameErrMsgShow").text(
									"帐户名不能为空");
							$('#userNameImage').attr('src',
									_base + '/theme/slp/images/icon-d.png');
						},
						// 校验手机
						_validServicePho : function() {
							$("#errorPhoneMsg").attr("style", "display:none");
							var phone = $('#phone').val();
							if (phone == "") {
								$("#phoneText").show();
								$('#showPhoneMsg').text("请输入手机号码");
								$("#errorPhoneMsg").attr("style", "display:");
								$('#errorPhoneFlag').val("0");
								$('#phoneImage').attr('src',_base + '/theme/slp/images/icon-a.png');
								return false;
							} else if (/^0?1[3|4|5|8][0-9]\d{8}$/.test(phone)) {
								var param = {
									userMp : $("#phone").val(),
									userType : $("#userType").val()
								};
								ajaxController.ajax({
									type : "post",
									processing : false,
									url : _base + "/reg/checkPhone",
									dataType : "json",
									data : param,
									message : "正在加载数据..",
									success : function(data) {
									if (data.responseHeader.resultCode == "10003") {
										$("#errorPhoneMsg").show();
										$("#phoneText").show();
										$("#showPhoneMsg").show();
										$("#phoneImage").show();
										$('#phoneText').text(
												"手机号码已注册");
										$('#phoneImage').attr('src',_base+ '/theme/slp/images/icon-a.png');
										$('#errorPhoneFlag').val("0");
										return false;
										} else if (data.responseHeader.resultCode == "000000") {
											$("#errorPhoneMsg").show();
											$("#phoneText").hide();
											$('#errorPhoneFlag').val("1");
											$('#phoneImage').attr('src',_base+ '/theme/slp/images/icon-b.png');
										}

											},
											error : function(XMLHttpRequest,
													textStatus, errorThrown) {
												alert(XMLHttpRequest.status);
												alert(XMLHttpRequest.readyState);
												alert(textStatus);
											}

										});
							} else {
								$("#errorPhoneMsg").attr("style", "display:");
								$("#phoneText").show();
								$('#phoneImage').attr('src',
										_base + '/theme/slp/images/icon-a.png');
								$('#showPhoneMsg').text("请输入正确有效的手机号码");
								$('#errorPhoneFlag').val("0");
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
						_passwordConfirmationShow : function() {
							var password = $('#inputPassword').val();
							if (password == "") {
								$('#passwordImage').attr('src',_base + '/theme/slp/images/icon-a.png');
								$('#showPawMsg').text("请输入密码");
								$("#showPawMsg").show();
								$("#errorPawMsg").show();
							}
							$("#errorPasswordMsg").attr("style", "display:none");
						},
						// 校验密码
						_validServicePaw : function() {
							$("#errorShowPM").attr("style", "display:none");
							$("#errorPawMsg").attr("style", "display:none");
							var password = $('#inputPassword').val();
							if (password == "") {
								$('#passwordImage').attr('src',_base + '/theme/slp/images/icon-a.png');
								$('#showPawMsg').text("请输入密码");
								$("#showPawMsg").show();
								$("#errorPawMsg").show();
								return false;
							} else if (/[\x01-\xFF]*/.test(password)) {
							  if (/^\S*$/.test(password)) {
								if (/^[\x21-\x7E]{6,20}$/.test(password)) {
								$("#errorPawMsg").show();
								$("#showPawMsg").hide();
								$('#errorPassFlag').val("1");
								$('#passwordImage').attr('src',_base+ '/theme/slp/images/icon-b.png');
								} else {
								$("#errorPawMsg").show();
								$("#passwordImage").show();
								$('#showPawMsg').show();
								$('#passwordImage').attr('src',_base+ '/theme/slp/images/icon-a.png');
								$('#showPawMsg').text("6-20个字符，可用字母、数字及符号的组合 ");
								$('#errorPassFlag').val("0");
								return false;
								}

								} else {
									$('#showPawMsg').text("不允许有空格 ");
									$("#errorPawMsg").attr("style", "display:");
									$('#errorPassFlag').val("0");
									return false;
								}
							} else {
								$('#showPawMsg').text("支持数字、字母、符号组合 ");
								$("#errorPawMsg").attr("style", "display:");
								$('#errorPassFlag').val("0");
								return false;
							}
						},

						_validPhoneVerifyCode : function() {
							$("#errorSmsMsg").attr("style", "display:none");
							var phone = $("#phone").val();
							var smsCode = $('#phoneVerifyCode').val();
							if (phone == "") {
								$("#errorPhoneMsg").show();
								return false;
							}
							if (smsCode == "") {
								$('#showSmsMsg').text("请输入短信验证码 ");
								$("#errorSmsMsg").attr("style", "display:");
								$('#errorSMSFlag').val("0");
								return false;
							} else {
								var param = {
									userMp : $("#phone").val(),
									phoneVerifyCode : $("#phoneVerifyCode")
											.val()
								};
								ajaxController.ajax({
									type : "post",
									processing : false,
									url : _base
											+ "/reg/checkPhoneVerifyCode",
									dataType : "json",
									data : param,
									message : "正在加载数据..",
									success : function(data) {
										if (data.responseHeader.resultCode == "000007") {
											$('#showSmsMsg').text(
													"手机与发送短信手机不一致");
											$("#errorSmsMsg").attr("style","display:");
											$('#errorSMSFlag').val("0");
											return false;
										} else if (data.responseHeader.resultCode == "000004") {
											$('#showSmsMsg').text("验证码已失效");
											$("#errorSmsMsg").attr("style","display:");
											$('#errorSMSFlag').val("0");
											return false;
										} else if (data.responseHeader.resultCode == "000003") {
											$('#showSmsMsg').text(
													"短信验证码错误");
											$("#errorSmsMsg").attr("style","display:");
											$('#errorSMSFlag').val("0");
											return false;
										} else if (data.responseHeader.resultCode == "000000") {
											$('#errorSMSFlag').val("1");
											$("#errorSmsMsg").attr("style","display:none");
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

						// 短信验证码
						_validServiceSSM : function() {
							var smsCode = $('#phoneVerifyCode').val();
							if (smsCode == "") {
								$('#showSmsMsg').text("请输入短信验证码 ");
								$("#errorSmsMsg").attr("style", "display:");
								$('#errorSMSEmptyFlag').val("0");
								return false;
							} else {
								$('#errorSMSEmptyFlag').val("1");
								$("#errorSmsMsg").attr("style", "display:none");
								return true;
							}
						},
						// 点击下一步用户信息显示
						_next1 : function() {
							var userName = $('#userName').val().replace(/^\s+|\s+$/g,"");
							var captcha = $('#pictureVitenfy').val().replace(/^\s+|\s+$/g,"");
							if(userName==""){
								$("#userNameErrMsgShow").text("帐户名不能为空");
								$("#userNameErrMsg").show();
								$("userNameEmptyFlag").val("0");
							}
							if(captcha==""){
								$("#captchaErrMsgShow").text("验证码不能为空");
								$("#captchaErrMsg").show();
								$("captchaEmptyFlag").val("0");
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
									url : _base+ "/center/password/validateUserName",
									dataType : "json",
									data : param,
									message : "正在加载数据..",
									success : function(data) {
									if (data.responseHeader.resultCode == "10013") {
										$("#userNameErrMsgShow").text("此用户不存在，请确认用户类型和帐户名称");
										$("#userNameErrMsg").show();
										$('#errorUserNameFlag').val("0");
									}
									if (data.responseHeader.resultCode == "10012") {
										$("#captchaErrMsgShow").text("验证码错误");
										$("#captchaErrMsg").show();
										$('#captchaErrFlag').val("0");
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
				    			}
						},
						_next2 : function() {
							$("#PasswordVerificationBorder").removeClass()
								.addClass("yellow-border");
							$("#PasswordVerificationYuan").removeClass()
									.addClass("yellow-yuan");
							$("#PasswordVerificationWord").removeClass()
									.addClass("yellow-word");
							$("#password-date1").hide();
							$("#password-date2").hide();
							$("#password-date3").show();
						},


						_checkConfirmPassword : function() {

							var confirmationPassword = $("#confirmationPassword").val();
							var inputPassword = $("#inputPassword").val();

							if (confirmationPassword != "") {
								$("#confirmationPasswordImage").attr('src',
										_base + '/theme/slp/images/icon-b.png');
								$("#errorConfirmFlag").val("1");
								$("#errorPasswordMsg").hide();
							} else if (confirmationPassword == "") {
								$("#confirmationPasswordImage").attr('src',
										_base + '/theme/slp/images/icon-a.png');
								$("#showPasswordMsg").text("请输入确认密码");
								$("#errorPasswordMsg").show();
								$("#errorConfirmFlag").val("0");
							}
						},

						// 密码校验
						_passwordConfirmation : function() {
							var inputPassword = $("#inputPassword").val();
							if (inputPassword == "") {
								$("#errorPawMsg").show();
								$("#showPawMsg").text("请输入密码");
								return false;
							}
							var confirmationPassword = $(
									"#confirmationPassword").val();
							if (inputPassword != ""
									&& confirmationPassword == "") {
								$("#errorPasswordMsg").show();
								$("#showPasswordMsg").show();
								$("#showPasswordMsg").text("请输入确认密码");
								return false;
							} else {
								$("#errorPasswordMsg").hide();
								$("#showPasswordMsg").hide();
							}
							if (inputPassword != confirmationPassword) {
								$("#confirmationPasswordImage").attr('src',
										_base + '/theme/slp/images/icon-a.png');
								$("#showPasswordMsg").text("两次输入的密码不一致");
								$("#errorPasswordMsg").show();
								$("#showPasswordMsg").show();
								$("#errorPassEqualsFlag").val("0");
								return false;
							} else {
								$("#errorPasswordMsg").show();
								$("#showPasswordMsg").hide();
								$("#errorPassEqualsFlag").val("1");
								$("#confirmationPasswordImage").attr('src',
										_base + '/theme/slp/images/icon-b.png');
								return true;
							}
						},
						_submit : function() {
							var phoneFlag = $('#errorPhoneFlag').val();
							var errorUserNameFlag = $('#errorUserNameFlag')
									.val();
							var errorPassFlag = $('#errorPassFlag').val();
							var errorConfirmFlag = $('#errorConfirmFlag').val();
							var errorPassEqualsFlag = $("#errorPassEqualsFlag")
									.val();
							var userType = $("#userType").val();
							var checkbox = $("#agreeChecbox").is(':checked');
							if (!checkbox) {
								$("#agreeProtocol").show();
								return false;
							} else {
								$("#agreeProtocol").hide();
							}
							if (phoneFlag != "0" && errorUserNameFlag != "0"
								&& errorPassFlag != "0"
								&& errorConfirmFlag != "0"
								&& errorPassEqualsFlag != "0") {
							var param = {
								request : "{ucUserParam:{"
								+ "userMp:'"
								+ $("#phone").val()
								+ "',"
								+ "userLoginName:'"
								+ $("#userName").val()
								+ "',"
								+ "userLoginPwd:"
								+ "'"
								+ hex_md5($("#inputPassword").val())
								+ "'" + "," + "userType:" + "'"
								+ $("#userType").val() + "'" + ","
								+ "phoneVerifyCode:" + "'"
								+ $("#phoneVerifyCode").val() + "'"
								+ "}}"
								};

								ajaxController.ajax({
								type : "post",
								processing : false,
								url : _base + "/reg/register",
								dataType : "json",
								data : param,
								message : "正在加载数据..",
								success : function(data) {
								if (data.responseHeader.resultCode == "000002") {
									$('#showPicMsg').text(
											"验证码已失效 ");
									$("#errorPicMsg").attr("style",
													"display:");
									return false;
									} else if (data.responseHeader.resultCode == "000001") {
										$('#showPicMsg').text("图形验证码错误 ");
										$("#errorPicMsg").attr("style","display:");
										return false;
									} else if (data.responseHeader.resultCode == "000007") {
										$('#showSmsMsg').text("请重新发送验证码  ");
										$("#errorSmsMsg").attr("style","display:");
										$('#phoneVerifyCode').val("");
										return false;
									} else if (data.responseHeader.resultCode == "000004") {
										$('#showSmsMsg').text("验证码已失效  ");
										$("#errorSmsMsg").attr("style","display:");
										return false;
									} else if (data.responseHeader.resultCode == "000003") {
										$('#showSmsMsg').text("短信验证码错误 ");
										$("#errorSmsMsg").attr("style","display:");
										return false;
									} else if (data.responseHeader.resultCode == "10003") {
										$('#showPhoneMsg').text("手机号码已注册");
										$("#errorPhoneMsg").attr("style","display:");
										$('#phoneVerifyCode').val("");
										return false;
									} else if (data.responseHeader.resultCode == "000000") {
										$("#errorSmsMsg").attr("style","display:none");
										var loginName = data.data;
										window.location.href = _base+ "/reg/toRegisterSuccess?loginName="
										+ loginName+ "&userType="+ userType;
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

						}
					});

			module.exports = UpdatePasswordPager
		});

function fleshCaptcha(){
	document.getElementById("yazm").src = _base+"/center/password/getImageVerifyCode?id=" + Math.random();
}