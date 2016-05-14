<!DOCTYPE html>
<%@page import="com.ai.opt.uac.web.constants.Constants"%>
<%@page import="com.ai.opt.sdk.components.mcs.MCSClientFactory"%>
<%@page import="java.net.URLDecoder"%>
<%@page import="java.util.Date"%>
<%@ page pageEncoding="UTF-8"%>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<html lang="zh-cn">
<head>
<%@ include file="/inc/inc.jsp"%>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width; initial-scale=0.8;  user-scalable=0;" />
<title>登录</title>
<link href="theme/slp/styles/login-regsiter.css" rel="stylesheet"
	type="text/css" />
<link href="theme/slp/styles/global.css" rel="stylesheet"
	type="text/css" />
<link href="theme/slp/styles/font-awesome.css" rel="stylesheet"
	type="text/css" />
<script type="text/javascript" src="${_baasBase }/js/md5.js"></script>
<script type="text/javascript" src="${_baasBase }/js/datacheck.js"></script>


<script language="javascript" type="text/javascript">
	$(function() {

		var errors = $("div.login-note").html();
		if (isNull(errors)) {
			$("div.login-note").css("padding", "0px");
		} else {
			$("div.login-note").css("padding", "padding", "3px 10px");
		}

		$("#username").bind("blur", function() {
			resetErrMsg();
		});
		$("#password").bind("blur", function() {
			resetErrMsg();
		});
	});

	function resetErrMsg() {
		$("div.login-note").html("");
		$("div.login-note").css("padding", "0px");
	}

	function encryptPwd(event) {
		if (event.keyCode == 13) {//IE Chrome 回车键
			dologin();
		} else {
			if (event.which == 13) {//Firefox 回车键
				dologin();
			}
		}
	}//end of encryPwd

	function dologin() {
		if (validate()) {
			var inputPassword = document.getElementById("password").value;
			var onceCode = "AIOPT_SALT_KEY";
			var passwordMd5 = hex_md5(onceCode + hex_md5(inputPassword));
			//document.getElementById("password").value = passwordMd5;
			document.getElementById("username").value = $.trim(document
					.getElementById("username").value);
			//提交表单
			document.getElementById('fm1').submit();
			return true;
		} else {
			return false;
		}

	}//end of dologin

	function validate() {
		var username = document.getElementById("username").value;
		var password = document.getElementById("password").value;
		var captchaCode = document.getElementById("captchaCode").value;
		try {
			if (isNull(username)) {
				$("div.login-note").html("请输入用户名/手机号码/邮箱");
				$("div.login-note").css("padding", "3px 10px");
				return false;
			} else {
				$("div.login-note").html("");
			}
			if (isNull(password)) {
				$("div.login-note").html("请输入密码");
				$("div.login-note").css("padding", "3px 10px");
				return false;
			} else {
				$("div.login-note").html("");
			}
			if (isNull(captchaCode)) {
				$("div.login-note").html("请输入验证码");
				$("div.login-note").css("padding", "3px 10px");
				return false;
			} else {
				$("div.login-note").html("");
			}
			return true;
		} catch (ex) {
			return false;
		}
	}//end of validate
	//根据用户类型跳转不同的注册页面
	function jumpTo(){
		var userType = $("#userType").val();
		window.location.href = "${_base}/reg/toRegister?userType="+userType;
	}
</script>
</head>

<body class="logo-body">
	<!--login－头部-->
	<div class="login-head">
		<div class="logo">
			<ul>
				<li><a href="#"><img src="theme/slp/images/login-logo.png" /></a></li>
				<li>用户登录</li>
			</ul>
		</div>
	</div>
	<!--login－头部结束-->
	<div class="logo-banner-big">
		<form:form method="post" id="fm1" name="fm1"
			commandName="${commandName}" htmlEscape="true">
			<div class="banner">
				<!--登录框-->
				<div class="login-main">
					<ul>
						<li><form:select class="select-login-small" id="userType"
								path="userType" tabindex="1" name="userType">
								<option value="10">个人用户</option>
								<option value="11">企业用户</option>
								<option value="12">代理商用户</option>
								<option value="13">分销商用户</option>
							</form:select></li>
					</ul>
					<ul>
						<li class="user"><form:input cssClass="required int-xlarge"
								cssErrorClass="error" id="username" tabindex="1"
								accesskey="${userNameAccessKey}" path="username"
								autocomplete="off" htmlEscape="true" placeholder="用户名/手机号/已验证邮箱" /></li>
						<span><spring:message
								code="screen.welcome.label.netid.accesskey"
								var="userNameAccessKey" /></span>
					</ul>
					<ul> 
						<%-- <li class="password"><form:password
								
								id="password" name="password"  size="25" tabindex="3" path="password"
								accesskey="${passwordAccessKey}" htmlEscape="true"
								autocomplete="off" placeholder="请输入密码"
								onkeydown="encryptPwd(event)" /></li> --%>
							<li><form:input type="password" cssClass="required int-xlarge"
								cssErrorClass="error" path="password" placeholder="请输入密码" 
								accesskey="${passwordAccessKey}" htmlEscape="true"
								autocomplete="off" onkeydown="encryptPwd(event)"/></li>
						<span><spring:message
								code="screen.welcome.label.password.accesskey"
								var="passwordAccessKey" /></span>
					</ul>
					<ul>
						<li class="identifying"><input type="text"
							class="int-xlarge-identifying" style="width: 176px;" size="25"
							tabindex="4" name="captchaCode" path="captchaCode"
							placeholder="请输入验证码" id="captchaCode"> <span><A><img
									src="${_base}/reg/getImageVerifyCode" id="pictureVitenfy"></A></span>
						</li>
						<span><spring:message
								code="screen.welcome.label.captchaCode.accesskey"
								var="passwordAccessKey" /></span>
					</ul>
					<ul>
						<li><p>
								<input id="rememberMe" name="rememberMe" type="checkbox"
									tabindex="5">
							</p>
							<p>记住密码</p></li>
						<li class="right"><a href="#">忘记密码</a>|<a href="#" onclick="javascript:jumpTo()">注册新账户</a></li>
					</ul>
					<ul>
						<div class="login-note">
							<form:errors path="*" id="msg" cssClass="errors" element="div"
								htmlEscape="false" />
						</div>
					</ul>
					<ul>
						<li><input type="button" class="login-bigbtn" value="立即登录"
							accesskey="l" tabindex="6" onclick="javascript:dologin();"></li>
					</ul>
					<input type="hidden" name="lt" value="${loginTicket}" /> <input
						type="hidden" name="execution" value="${flowExecutionKey}" /> <input
						type="hidden" name="_eventId" value="submit" /> <input
						type="hidden" name="tenantId" value="test111" />
				</div>
			</div>
		</form:form>
	</div>
	<!--login－内容结束-->
	</div>
	<!--login－内容结束-->
	<!--login－底部-->
	<div class="login-footer">
		<div class="login-footer-main">
			<ul>
				<li><A href="#">关于我们</A><A href="#">联系我们</A><A href="#">商家入驻</A><A
					href="#">货源合作</A><A href="#">代理合作</A><A href="#">联盟营销</A><A
					href="#">其他链接</A><A href="#">其他链接</A><A href="#">其他链接</A></li>
				<li>京ICP备11005544号-15 京公网安备110108007119号</li>
				<li>©2016-2018 亚信旗下话费充值平台，版权所有  All Rights Reserved</li>
			</ul>
		</div>
	</div>
</body>
</html>
</html>
