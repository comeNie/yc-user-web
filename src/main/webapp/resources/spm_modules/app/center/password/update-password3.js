define(
		'app/center/password/update-password3',
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
					$("#newPassword").on("blur", this._validServicePaw);
					$("#newPassword").on("focus",this._hidePassword);
					$("#newPassword").on("focus",this._hidePasswordConfirm);
					$("#newPassword").on("blur",this._checkConfirm);
					$("#newPasswordConfirm").on("focus",this._hidePasswordConfirm);
					$("#newPasswordConfirm").on("blur", this._passwordConfirmation);
					$("#BTN_PASSWORD").on("click", this._submit);
					},
					_hideErroText : function() {
						var _this = this;
						// 初始化展示业务类型
						_this._hideInfo();
						},
						//隐藏密码错误提示
						_hidePassword : function(){
							$("#passwordErrMsg").attr("style", "display:none");
						},
						//隐藏确认密码错误提示
						_hidePasswordConfirm : function(){
							$("#newPasswordErrMsg").attr("style", "display:none");
						},
						
						// 校验密码
						_validServicePaw : function() {
							var password = $('#newPassword').val();
							if (password == "") {
								$('#passwordErrMsgShow').text("请输入密码");
								$('#passwordImg').attr('src',_base+'/theme/slp/images/icon-a.png');
								$("#passwordErrMsg").show();
								return false;
							} else if (/[\x01-\xFF]*/.test(password)) {
							  if (/^\S*$/.test(password)) {
								if (/^[\x21-\x7E]{6,20}$/.test(password)) {
									$('#passwordErrFlag').val("1");
									$('#passwordImg').attr('src',_base+'/theme/slp/images/icon-b.png');
									$('#passwordErrMsgShow').text("");
									$("#passwordErrMsg").show();
								} else {
									$('#passwordErrMsgShow').text("6-20个字符，可用字母、数字及符号的组合 ");
									$('#passwordImg').attr('src',_base+'/theme/slp/images/icon-e.png');
									$("#passwordErrMsg").show();
								
								$('#passwordErrFlag').val("0");
								return false;
								}
								} else {
									$('#passwordErrMsgShow').text("不允许有空格 ");
									$('#passwordImg').attr('src',_base+'/theme/slp/images/icon-e.png');
									$("#passwordErrMsg").attr("style", "display:");
									$('#passwordErrFlag').val("0");
									return false;
								}
							} else {
								$('#passwordErrMsgShow').text("支持数字、字母、符号组合 ");
								$('#passwordImg').attr('src',_base+'/theme/slp/images/icon-e.png');
								$("#passwordErrMsg").attr("style", "display:");
								$('#passwordErrFlag').val("0");
								return false;
							}
						},

						// 密码校验
						_passwordConfirmation : function() {
							var inputPassword = $("#newPassword").val();
							var confirmationPassword = $("#newPasswordConfirm").val();
							if (confirmationPassword == "") {
								$('#newPasswordErrMsgShow').text("请输入密码");
								$('#confirmationPasswordImage').attr('src',_base+'/theme/slp/images/icon-a.png');
								$("#newPasswordErrMsg").show();
								return false;
							}
							if (inputPassword != confirmationPassword) {
								$("#confirmationPasswordImage").attr('src',
										_base + '/theme/slp/images/icon-a.png');
								$("#newPasswordErrMsgShow").text("两次输入的密码不一致");
								$("#newPasswordErrMsg").show();
								$("#passwordNotEqualFlag").val("0");
								return false;
							} else {
								$("#passwordNotEqualFlag").val("1");
								$('#newPasswordErrMsgShow').text("");
								$("#confirmationPasswordImage").attr('src',_base + '/theme/slp/images/icon-b.png');
								$("#newPasswordErrMsg").show();
								return true;
							}
						},
						
						_submit : function() {
							var passwordErrFlag = $('#passwordErrFlag').val();
							var newPasswordEmptyFlag = $('#newPasswordEmptyFlag').val();
							var passwordNotEqualFlag = $("#passwordNotEqualFlag").val();
							var passwordEmptyFlag = $("#passwordEmptyFlag").val();
							if (passwordErrFlag != "0"
								&& newPasswordEmptyFlag != "0"
								&& passwordNotEqualFlag != "0"
								&&passwordEmptyFlag!="0") {
							var param = {
								userLoginPwd: hex_md5($("#newPassword").val()),
								userId: userId,
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
										.addClass("icon-ok");
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
						//校验密码一致性
						_checkConfirm : function() {
							var inputPassword = $("#newPassword").val();
							var confirmationPassword = $("#newPasswordConfirm").val();
							if (inputPassword != confirmationPassword&&!confirmationPassword=="") {
								$("#newPasswordErrMsgShow").text("两次输入的密码不一致");
								$('#confirmationPasswordImage').attr('src',_base+'/theme/slp/images/icon-a.png');
								$("#newPasswordErrMsg").show();
								$("#passwordNotEqualFlag").val("0");
								return false;
							} 
							$("#newPasswordErrMsg").hide();
						}
			});
			module.exports = UpdatePasswordPager
		});
window.onload=function(){
	$("#VerificationBorder").removeClass().addClass("yellow-border");
	$("#VerificationYuan").removeClass().addClass("yellow-yuan");
	$("#VerificationWord").removeClass().addClass("yellow-word");
	$("#PasswordVerificationBorder").removeClass().addClass("yellow-border");
	$("#PasswordVerificationYuan").removeClass().addClass("yellow-yuan");
	$("#PasswordVerificationWord").removeClass().addClass("yellow-word");
	
	$("#password-date1").hide();
	$("#password-date2").hide();
	$("#password-date3").show();
	$("#password-date4").hide();
	}
