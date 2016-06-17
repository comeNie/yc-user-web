<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<html>
<head>
<%@ include file="/inc/inc.jsp"%>
<!--Support IE Text -->
<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
<title>修改密码</title>
<script type="text/javascript"
	src="${_base}/theme/baas/js/jquery.toggle-password.js"></script>
<script type="text/javascript" src="${_base}/theme/slp/scripts/md5.js"></script>

<script type="text/javascript">
	var userId = "${userId}";
	(function() {
		seajs.use('app/center/password/update-password3', function(
			UpdatePasswordPager) {
			var pager = new UpdatePasswordPager();
			pager.render();
		});
	})();

</script>
</head>

<body class="logo-body">
	<!--login－头部-->
	<%@ include file="/inc/head-retakepwd.jsp" %>
	<!--login－头部结束-->
	<div class="g-regsiter">
		<!--白色框架-->
		<div class="regsiter-center">
			<!--主体内容-->
			<div class="center-main">
				<div class="center-table-list">
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
							<li>修改成功</li>
						</ul>
						</div>
					<!--步骤结束-->

					<div class="list-int" id="password-date1">
						<ul>
							<li class="word">用户类型:</li>
							<li><select class="select-medium" id="userType">
									<option value="10">个人用户</option>
									<option value="11">企业用户</option>
									<option value="12">代理商</option>
									<option value="13">供货商</option>
							</select>
						</ul>
						<ul>
							<li class="word">账户名称:</li>
							<li><input type="text" class="int-medium" id="userName" placeholder="用户名/手机/已验证邮箱"></li>
							<li class="lable" id="userNameErrMsg" style="display: none;"><img
								src="${_base}/theme/slp/images/icon-a.png"><span
								class="red" id="userNameErrMsgShow">此用户不存在，请确认用户类型和帐户名称</span></li>
						</ul>
						<ul>
							<li class="word">验证码:</li>
							<li><input type="text" class="int-small" id="pictureVitenfy" placeholder="请输入验证码"></li>
							<li class="yazm"><img id="yazm" src="${_base}/center/password/getImageVerifyCode"></li>
							<li class="yazm"><a href="#" onclick="fleshCaptcha();">换一张</a></li>
							<li class="lable" id="captchaErrMsg" style="display: none;"><img
								src="${_base}/theme/slp/images/icon-a.png"><span id=captchaErrMsgShow
								class="red">验证码错误</span></li>
						</ul>
						<ul>
							<li class="checx-word"><input type="button"
								class="slp-btn regsiter-btn" id="next1" value="下一步"></li>
						</ul>
					</div>
					
					
				<div class="center-main" id="password-date2" style="display: none;">
					<div class="list-int">
						<ul>
							<li class="word">身份验证方式:</li>
							<li class="checkbox-box"><span><input name="radio"
									class="int-chec radioa" type="radio" checked="">注册手机号</span><span><input
									name="radio" class="int-chec radiob" type="radio">已验证邮箱</span></li>
						</ul>
						<div class="phone">
							<ul>
								<li class="word">手机:</li>
								<li><input type="text" class="int-medium" id="phone"
									placeholder="请输入您的有效手机号"></li>
								<li class="lable" style="display: none;" id="phoneErrMsg"><img
									src="${_base}/theme/slp/images/icon-a.png"><span
									class="red" id="phoneErrMsgShow">请输入正确有效的手机号</span></li>
							</ul>
							<ul>
								<li class="word">短信验证码:</li>
								<li><input type="text" class="int-small" id="phoneVerifyCode" placeholder="请输入短信验证码"></li>
								<li class="re-btn"><input type="button" class="int-btn"
									value="获取短信验证码" id="PHONE_IDENTIFY"></li>
								<li class="lable" style="display: none;" id="phoneVerifyCodeErrMsg"><img
									src="${_base}/theme/slp/images/icon-a.png"><span
									class="red" id="phoneVerifyCodeErrMsgShow">验证码错误</span></li>
							</ul>
							<ul>
								<li class="checx-word"><input type="button"
									class="slp-btn regsiter-btn" id="next2" value="下一步"></li>
							</ul>
						</div>
						<div class="mail" style="display: none;">
							<ul>
								<li class="word">已验证邮箱:</li>
								<li><input type="text" class="int-medium"
									placeholder="请输入已验证邮箱" id="email">
								</li>
								<li class="lable" style="display: none;" id="emailErrMsg"><img
									src="${_base}/theme/slp/images/icon-a.png"><span
									class="red" id="emailErrMsgShow">邮箱不能为空</span></li>
							</ul>
							<ul>
								<li class="checx-word"><input type="button" id="SENDEMAIL"
									class="slp-btn regsiter-btn" value="发送验证邮件"></li>
							</ul>
						</div>
					</div>
					</div>
					
				<div class="center-main" id="password-date3" style="display: none;">
					<div class="list-int">
					<ul>
					<li class="word">新密码:</li>
					<li><input type="password" class="int-medium"
						placeholder="请输入密码" id="newPassword"></li>
					<li class="lable" style="display: none;" id="passwordErrMsg"><img
					id="passwordImg" src="${_base}/theme/slp/images/icon-c.png"><span id="passwordErrMsgShow">6-20个字符，可用字母、数字及符号的组合</span></li>
					<!--  <label> <img src="${_base}/theme/slp/images/pass-a.png"> 
					<img src="${_base}/theme/slp/images/pass-b.png"></label> -->
						<!-- <img src="${_base}/theme/slp/images/pass-c.png">有被盗风险,建议使用字母、数字和符号两种及以上组合</label> -->
				</ul>
				<ul>
					<li class="word">确认新密码:</li>
					<li><input type="password" class="int-medium"
						placeholder="再次确认密码" id="newPasswordConfirm"></li>
					<li class="lable" style="display: none;" id="newPasswordErrMsg"><img
						id="confirmationPasswordImage" src="${_base}/theme/slp/images/icon-a.png"><span  id="newPasswordErrMsgShow" class="red">两次输入的密码不一致</span></li>
				</ul>
				<ul>
					<li class="checx-word">
					<input type="button" class="slp-btn regsiter-btn" id="BTN_PASSWORD" value="确认提交">
					</li>
				</ul>
			</div>
			</div>
			
			<div class="regeiter-success" id="password-date4" style="display: none;">
                 <p><img src="${_base}/theme/slp/images/succ.png"></p>
                 <p class="word">新密码已经设置成功!</p>
                 <p>请牢记您的密码哦!</p>
                 <p class="success-box"><a href="#">网站首页</a><a href="#">账户中心</a></p>
                 </div>
			<ul>
					<li class="checx-word">
					<input type="hidden" id="passwordEmptyFlag"/>
					<input type="hidden" id="newPasswordEmptyFlag"/>
		         	<input type="hidden" id="passwordErrFlag"/>
		         	<input type="hidden" id="passwordNotEqualFlag"/>
		         	<input type="hidden" id="tenantId" value="SLP"/>
		         	</li>
				</ul>
				<!--主体内容结束-->
			
			</div>
			</div>
			</div>
			<!--白色框架结束-->
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
