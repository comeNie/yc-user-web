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
	$("#captchaCode").bind("blur", function() {
		resetErrMsg();
	});
});

function resetErrMsg() {
	$("div.login-note").html("");
	$("div.login-note").css("padding", "0px");
}

function encryptCaptcha(event) {
	if (event.keyCode == 13) {// IE Chrome 回车键
		dologin();
	} else {
		if (event.which == 13) {// Firefox 回车键
			dologin();
		}
	}
}// end of encryPwd

function dologin() {
	var count=0;
	if(count>=3){
		$("div.login-note").html("是不是忘记密码了,请点击找回密码");
		$("div.login-note").css("padding", "3px 10px");
	}
	if (validate()) {
		var inputPassword = document.getElementById("password").value;
		var onceCode = "AIOPT_SALT_KEY";
		var passwordMd5 = hex_md5(onceCode + hex_md5(inputPassword));
		document.getElementById("password").value = passwordMd5;
		document.getElementById("username").value = $.trim(document
				.getElementById("username").value);
		document.getElementById("captchaCode").value = $.trim(document
				.getElementById("captchaCode").value);
		// 提交表单
		document.getElementById('fm1').submit();
		return true;
	} else {
		return false;
		count++;
	}

}// end of dologin

function validate() {
	var username = document.getElementById("username").value.trim();
	var password = document.getElementById("password").value.trim();
	var captchaCode = document.getElementById("captchaCode").value.trim();
	try {
		if (isNull(username)) {
			$("div.login-note").html("请输入用户名");
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
}// end of validate
// 根据用户类型跳转不同的注册页面
function jumpTo() {
	var userType = $("#userType").val();
	window.location.href = _base+"/reg/toRegister?userType=" + userType;
}

function jumpToFind(){
	window.location.href = _base+"/center/password/toValidatePage";
}
// 刷新验证码
function reloadImage(url) {
	document.getElementById('pictureVitenfy').src = url+"?id=" + Math.random();
}