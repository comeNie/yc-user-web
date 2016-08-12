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
<script language="javascript" src="${pageContext.request.contextPath}/resources/spm_modules/app/login/casLoginView.js"></script>  


</head>

<style type="text/css">
/**登录banner**/
.logo-banner-big{ width:100%; float:left; height:456px; background:url(theme/slp/images/bj1.png) no-repeat; min-width:1200px;}
.banner{ width:1200px; margin:0 auto; background:url(theme/slp/images/logo-banner.png) no-repeat; height:456px;}
</style>

<body class="logo-body">
	<!--login－头部-->
	<div class="login-head">
		<div class="logo">
			<ul>
				<li><a href="${mall_index_url}"><img src="theme/slp/images/hnlogo.png" /></a></li>
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
					<li>
						<div class="login-note" style="color:red;">
							<form:errors path="*" id="msg" cssClass="errors" element="div"
								htmlEscape="false"/>
						</div>
					</li>
				</ul>
						<ul>
							<li><form:select class="required int-xlarge" id="userType"
									path="userType" name="userType">
									<option value="10">个人用户</option>
									<option value="11">企业用户</option>
									<option value="12">代理商</option>
									<option value="13">供货商</option>
								</form:select></li>
						</ul>
						<ul>
							<li class="user"><form:input cssClass="required int-xlarge"
									cssErrorClass="error" id="username" tabindex="1"
									path="username" autocomplete="off" htmlEscape="true"
									placeholder="用户名/手机号/已验证邮箱" /></li>
						</ul>
						<ul>
							<li><form:input type="password" id="password"
									cssClass="required int-xlarge" cssErrorClass="error"
									path="password" placeholder="请输入密码" tabindex="2"
									htmlEscape="true" autocomplete="off" /></li>
						</ul>
						<ul>
							<li class="identifying"><input type="text"
								class="int-xlarge-identifying" id="captchaCode"
								style="border: 1px solid #e7e7e7; float: left; font-size: 14px; height: 40px; padding-left: 6px; width: 175px;"
								tabindex="3" name="captchaCode" path="captchaCode" onkeydown="encryptCaptcha(event)"
								placeholder="请输入验证码"> <span><A><img
										src="${_base}/reg/getImageVerifyCode" id="pictureVitenfy"
										onclick="reloadImage('${_base}/reg/getImageVerifyCode');"></A></span></li>
						</ul>
						<ul>
							<li><p>
									<input id="rememberMe" name="rememberMe" type="checkbox" value="true">
								</p>
								<p>记住密码</p></li>
							<li class="right"><a href="#" onclick="jumpToFind();">忘记密码</a>|<a href="#"
								onclick="javascript:jumpTo()">注册新账户</a></li>
						</ul>
						<ul>
						<li><input type="button" class="login-bigbtn" value="立即登录"
							accesskey="l" tabindex="4" onclick="javascript:dologin();"></li>
						</ul>
					<input type="hidden" name="lt" value="${loginTicket}" /> <input
						type="hidden" name="execution" value="${flowExecutionKey}" /> <input
						type="hidden" name="_eventId" value="submit" /> <input
						type="hidden" name="tenantId" value="SLP" /><input
						type="hidden" name="sessionId" value="<%=request.getSession().getId()%>"/>
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
