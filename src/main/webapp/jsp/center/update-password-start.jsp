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
	(function() {
		seajs.use('app/register/register', function(RegisterPager) {
			var pager = new RegisterPager();
			pager.render();
		});
	})();

	$(function() {
		$('#password').togglePassword({
			el : '#togglePassword'
		});
	});
	//判断输入密码的类型  
	function CharMode(iN) {
		if (iN >= 48 && iN <= 57) //数字  
			return 1;
		if (iN >= 65 && iN <= 90) //大写  
			return 2;
		if (iN >= 97 && iN <= 122) //小写  
			return 4;
		else
			return 8;
	}
	//bitTotal函数  
	//计算密码模式  
	function bitTotal(num) {
		modes = 0;
		for (i = 0; i < 4; i++) {
			if (num & 1)
				modes++;
			num >>>= 1;
		}
		return modes;
	}
	//返回强度级别  
	function checkStrong(sPW) {
		if (sPW.length <= 8)
			return 0; //密码太短  
		Modes = 0;
		for (i = 0; i < sPW.length; i++) {
			//密码模式  
			Modes |= CharMode(sPW.charCodeAt(i));
		}
		return bitTotal(Modes);
	}

	//显示颜色  
	function pwStrength(pwd) {
		O_color = "#eeeeee";
		L_color = "#FF0000";
		M_color = "#FF9900";
		H_color = "#33CC00";
		if (pwd == null || pwd == '') {
			Lcolor = Mcolor = Hcolor = O_color;
		} else {
			S_level = checkStrong(pwd);
			switch (S_level) {
			case 0:
				Lcolor = Mcolor = Hcolor = O_color;
			case 1:
				Lcolor = L_color;
				Mcolor = Hcolor = O_color;
				break;
			case 2:
				Lcolor = Mcolor = M_color;
				Hcolor = O_color;
				break;
			default:
				Lcolor = Mcolor = Hcolor = H_color;
			}
		}
		document.getElementById("strength_L").style.background = Lcolor;
		document.getElementById("strength_M").style.background = Mcolor;
		document.getElementById("strength_H").style.background = Hcolor;
		return;
	}
</script>
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
							<li class="ash-border"></li>
							<li class="ash-yuan">2</li>
							<li>验证身份</li>
						</ul>
						<ul>
							<li class="ash-border"></li>
							<li class="ash-yuan">3</li>
							<li>设置新密码</li>
						</ul>
						<ul>
							<li class="ash-border"></li>
							<li class="ash-yuan"><i class="icon-ok"></i></li>
							<li>注册成功</li>
						</ul>
					</div>
					<!--步骤结束-->

					<div class="list-int">
						<ul>
							<li class="word">用户类型:</li>
							<li><select class="select-medium">
									<option value="10">个人用户</option>
									<option value="11">企业用户</option>
									<option value="12">代理商</option>
									<option value="13">供货商</option>
							</select>
						</ul>
						<ul>
							<li class="word">账户名称:</li>
							<li><input type="text" class="int-medium"
								placeholder="用户名/手机/已验证邮箱"></li>
							<li class="lable" style="display: none;"><img src="${_base}/theme/slp/images/icon-a.png"><span
								class="red">此用户不存在，请确认用户类型和帐户名称</span></li>
						</ul>
						<ul>
							<li class="word">验证码:</li>
							<li><input type="text" class="int-small"></li>
							<li class="yazm"><img src="${_base}/reg/getImageVerifyCode"></li>
							<li class="yazm"><a href="#">换一张</a></li>
							<li class="lable" style="display: none;"><img src="${_base}/theme/slp/images/icon-a.png"><span
								class="red">验证码错误</span></li>
						</ul>
						<ul>
							<li class="checx-word"><input type="button"
								class="slp-btn regsiter-btn" value="下一步"></li>
						</ul>
					</div>

				</div>
			</div>

		<div class="center-main" style="display: none;">
			<div class="center-table-list">
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
							<li><input type="text" class="int-medium"
								placeholder="请输入您的有效手机号"></li>
							<li class="lable"><img src="${_base}/theme/slp/images/icon-a.png"><span
								class="red">请输入正确有效的手机号</span></li>
						</ul>
						<ul>
							<li class="word">短信验证码:</li>
							<li><input type="text" class="int-small"></li>
							<li class="re-btn"><input type="button" class="int-btn"
								value="获取短信验证码"></li>
							<li class="lable"><img src="${_base}/theme/slp/images/icon-a.png"><span
								class="red">验证码错误</span></li>
						</ul>
						<ul>
							<li class="checx-word"><input type="button"
								class="slp-btn regsiter-btn" value="下一步"></li>
						</ul>
					</div>
					<div class="mail" style="display: none;">
						<ul>
							<li class="word">已验证邮箱:</li>
							<li><input type="text" class="int-medium"
								placeholder="sunyw@163.com"></li>
						</ul>
						<ul>
							<li class="checx-word"><input type="button"
								class="slp-btn regsiter-btn" value="发送验证邮件"></li>
						</ul>
					</div>
				</div>
			</div>
		</div>


		<div class="list-int" style="display: none;">
			<ul>
				<li class="word">新密码:</li>
				<li><input type="password" class="int-medium"
					placeholder="请输入密码"></li>
				<li class="lable"><img src="${_base}/theme/slp/images/icon-c.png"><span>6-20个字符，可用字母、数字及符号的组合</span></li>
				<label><img src="${_base}/theme/slp/images/pass-a.png"><img
					src="${_base}/theme/slp/images/pass-b.png"><img src="${_base}/theme/slp/images/pass-c.png">有被盗风险,建议使用字母、数字和符号两种及以上组合</label>
			</ul>
			<ul>
				<li class="word">确认新密码:</li>
				<li><input type="password" class="int-medium"
					placeholder="再次确认密码"></li>
				<li class="lable"><img src="${_base}/theme/slp/images/icon-a.png"><span>两次输入的密码不一致</span></li>
			</ul>
			<ul>
				<li class="checx-word"><input type="button"
					class="slp-btn regsiter-btn" value="确认提交"></li>
			</ul>

			<!--主体内容结束-->
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
