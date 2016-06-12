<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<!doctype html>
<html>
<head>
<%@ include file="/inc/inc.jsp" %>
<meta charset="UTF-8">
<title>修改邮箱－邮箱验证－验证邮箱</title>
<script src="${_base }/theme/slp/scripts/jquery-1.11.1.min.js" type="text/javascript"></script>
<script src="${_base }/theme/slp/scripts/frame.js" type="text/javascript"></script>
<link href="${_base }/theme/slp/styles/modular.css" rel="stylesheet" type="text/css">
<link href="${_base }/theme/slp/styles/global.css" rel="stylesheet" type="text/css">
<link href="${_base }/theme/slp/styles/frame.css" rel="stylesheet" type="text/css">
<link href="${_base }/theme/slp/styles/font-awesome.css" rel="stylesheet" type="text/css">
</head>

<body class="logo-body">
	<!--login－头部-->
	<div class="login-head">
		<div class="logo">
			<ul>
				<li><a href="#"><img
						src="${_base}/theme/slp/images/login-logo.png"></a></li>
				<li>修改密码</li>
			</ul>
		</div>

		<div class="login-btn">
			<ul>
				<li>已有账户，现在</li>
				<li><input type="button" value="登录" class="slp-btn wih-btn"
					onclick="location.href='${_base}/login';"></li>
			</ul>
		</div>
	</div>
	<!--login－头部结束-->
      <div class="account-bj">
       <!--步骤-->
					<div class="steps steps-four">
						<ul>
							<li class="yellow-border" id="SmsVerificationBorder"></li>
							<li class="yellow-yuan" id="SmsVerificationYuan">1</li>
							<li class="yellow-word" id="SmsVerificationWord">填写帐户名称</li>
						</ul>
						<ul>
							<li class="ash-border" id="VerificationBorder"></li>
							<li class="ash-yuan" id="VerificationYuan">2</li>
							<li class="yellow-word" id="VerificationWord">验证身份</li>
						</ul>
						<ul>
							<li class="ash-border" id="PasswordVerificationBorder"></li>
							<li class="ash-yuan" id="PasswordVerificationYuan">3</li>
							<li class="yellow-word" id="PasswordVerificationWord">设置新密码</li>
						</ul>
						<ul>
							<li class="ash-border" id="FinishPasswordBorder"></li>
							<li class="ash-yuan" id="FinishPasswordYuan">
							<i class="icon-ok" id="FinishPasswordWord"></i></li>
							<li>注册成功</li>
						</ul>
						</div>
					<!--步骤结束-->
             <div class="verify-mailbox">
             <div style="margin-top:82px;text-align: center;">
             	<ul>
             		<li><img src="${_base }/theme/slp/images/icon-mail.png"></li>
             		<li class="word">邮箱绑定邮件已发送至您的邮箱：ying****un@163.com</li>
             		<li><a href="#">请在邮件中点击验证链接完成邮箱绑定<span>（验证链接24小时内有效)</span></a></li>
             		<li class="vermail-btn"><input type="button" class="slp-btn regsiter-btn" value="查看验证邮件"></li>	
             	</ul>
             	
             	</div>
      </div>

  </div>  
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



