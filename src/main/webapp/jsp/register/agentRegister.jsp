<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<html>
<head>
<%@ include file="/inc/inc.jsp"%>
<!--Support IE Text -->
<meta http-equiv="X-UA-Compatible" content="IE=Edge" /> 
<title>注册</title>
<script type="text/javascript" src="${_base}/theme/baas/js/jquery.toggle-password.js" ></script> 
<script type="text/javascript" src="${_base}/theme/slp/scripts/md5.js" ></script> 

<script type="text/javascript">
 (function () {
	seajs.use('app/register/register', function (RegisterPager) {
		var pager = new RegisterPager();
		pager.render();
	});
})(); 

 $(function(){
	$('#password').togglePassword({
		el: '#togglePassword'
	});
}); 
//判断输入密码的类型  
function CharMode(iN){  
if (iN>=48 && iN <=57) //数字  
return 1;  
if (iN>=65 && iN <=90) //大写  
return 2;  
if (iN>=97 && iN <=122) //小写  
return 4;  
else  
return 8;   
}  
//bitTotal函数  
//计算密码模式  
function bitTotal(num){  
modes=0;  
for (i=0;i<4;i++){  
if (num & 1) modes++;  
num>>>=1;  
}  
return modes;  
}  
//返回强度级别  
function checkStrong(sPW){  
if (sPW.length<=8)  
return 0; //密码太短  
Modes=0;  
for (i=0;i<sPW.length;i++){  
//密码模式  
Modes|=CharMode(sPW.charCodeAt(i));  
}  
return bitTotal(Modes);  
}  
 
//显示颜色  
function pwStrength(pwd){  
O_color="#eeeeee";  
L_color="#FF0000";  
M_color="#FF9900";  
H_color="#33CC00";  
if (pwd==null||pwd==''){  
Lcolor=Mcolor=Hcolor=O_color;  
}  
else{  
S_level=checkStrong(pwd);  
switch(S_level) {  
case 0:  
Lcolor=Mcolor=Hcolor=O_color;  
case 1:  
Lcolor=L_color;  
Mcolor=Hcolor=O_color;  
break;  
case 2:  
Lcolor=Mcolor=M_color;  
Hcolor=O_color;  
break;  
default:  
Lcolor=Mcolor=Hcolor=H_color;  
}  
}  
document.getElementById("strength_L").style.background=Lcolor;  
document.getElementById("strength_M").style.background=Mcolor;  
document.getElementById("strength_H").style.background=Hcolor;  
return;  
}  
</script>
</head>

<body class="logo-body">
   <!--login－头部-->
   <div class="login-head">
        <div class="logo">
            <ul>
                <li><a href="${mall_index_url}"><img src="${_base}/theme/slp/images/hnlogo.png"></a></li>
                <li>代理商注册</li>
            </ul>
        </div>
        
        <div class="login-btn">
            <ul>
                <li>已有账户，现在</li>
                <li><input type="button" value="登录" class="slp-btn wih-btn" onclick="location.href='${_base}/login';"></li>
            </ul>
        </div>
    </div>
  <!--login－头部结束-->
  <div class="g-regsiter">
      <!--白色框架-->
        <div class="regsiter-center">
            <!--主体内容-->
                <div class="center-main">
                <div class="center-table-list-none">

                <div class="list-int">
                     <ul>
                        <li class="word"><span>*</span>用户名:</li>
                        <li><input type="text" class="int-medium" placeholder="设置用于登录的账户名" id="userName"></li>
                        <li class="lable" id="errorUserNameMsg" style="display: none"><img id="userNameImage" src="${_base}/theme/slp/images/icon-c.png"><span id="userNameErrorMsgShow">4-20个字符，可用汉字、字母、数字、“-”及“_”的组合</span></li>
                    </ul>
                     <ul>
                        <li class="word"><span>*</span>设置密码:</li>
                        <li><input type="password" class="int-medium" placeholder="设置您的登录密码" id="inputPassword"></li>
                        <li class="lable" id="errorPawMsg"><img id="passwordImage" src="${_base}/theme/slp/images/icon-c.png"><span id="showPawMsg">6-20个字符，可用字母、数字及符号的组合</span></li>
                        <%-- <label><img src="${_base}/theme/baas/images/pass-a.png"><img src="${_base}/theme/baas/images/pass-b.png"><img src="${_base}/theme/baas/images/pass-c.png">有被盗风险,建议使用字母、数字和符号两种及以上组合</label> --%>
                    </ul>
                    <ul>
                        <li class="word"><span>*</span>确认密码:</li>
                        <li><input type="password" class="int-medium" placeholder="再次确认密码" id="confirmationPassword"></li>
                        <li class="lable" id="errorPasswordMsg" style="display: none"><img id="confirmationPasswordImage" src="${_base}/theme/slp/images/icon-a.png"><span id="showPasswordMsg">两次输入的密码不一致</span></li>
                    </ul>
                   <ul>
                        <li class="word"><span>*</span>手机:</li>
                        <li><input type="text" class="int-medium" placeholder="请输入您的有效手机号" id="phone"></li>
                        <li class="lable" id="errorPhoneMsg" style="display: none;"><img id="phoneImage" src="${_base}/theme/slp/images/icon-d.png"><span id="phoneText">请输入正确有效的手机号</span></li>
                    </ul>
                    <ul>
                        <li class="word"><span>*</span>短信验证码:</li>
                        <li><input type="text" class="int-small" id="phoneVerifyCode"></li>
                        <li class="re-btn"><input type="button" id="PHONE_IDENTIFY" class="int-btn" value="获取短信验证码"></li>
                        <li class="lable" id="errorSmsMsg" style="display: none;"><img src="${_base}/theme/slp/images/icon-a.png"><span  id="showSmsMsg">验证码错误</span></li>
                    </ul>
                    <ul>
                        <li class="checx-word"><input type="checkbox" id="agreeChecbox" class="int-chec">我已阅读并同意<A href="#">《代理商用户注册协议》</A></li>
                        <li class="lable" style="display: none" id="agreeProtocol"><img src="${_base}/theme/slp/images/icon-a.png"><span  >您需要同意注册协议，才能进行注册</span></li>
                    </ul>
                      <ul>
                        <li class="checx-word">
                        	<input type="button" class="slp-btn regsiter-btn" id="BTN_REGISTER" value="立即注册">
                        	<input type="hidden" id="errorPhoneFlag"/>
				         	<input type="hidden" id="errorUserNameFlag"/>
				         	<input type="hidden" id="errorPassFlag"/>
				         	<input type="hidden" id="errorConfirmFlag"/>
				         	<input type="hidden" id="errorPassEqualsFlag"/>
				         	<input type="hidden" id="errorSMSFlag"/>
				         	<input type="hidden" id="userType" value="12"/>
                        </li>
                    </ul>
                
                </div>
                </div>
              
             
                </div>
           <!--主体内容结束-->
        </div>
       <!--白色框架结束-->
  </div>
  
  
  
  
  
  <!--login－底部-->
  <div class="login-footer">
   <div class="login-footer-main">
   <ul>
   <li><A href="#">关于我们</A><A href="#">联系我们</A><A href="#">商家入驻</A><A href="#">货源合作</A><A href="#">代理合作</A><A href="#">联盟营销</A><A href="#">其他链接</A><A href="#">其他链接</A><A href="#">其他链接</A></li>
   <li>京ICP备11005544号-15                京公网安备110108007119号</li>
   <li>©2016-2018 亚信旗下话费充值平台，版权所有  All Rights Reserved</li>
   </ul>
   </div>                                                                                                         
  </div>
</body>
</html>
<script src="../scripts/jquery-1.11.1.min.js" type="text/javascript"></script>
<script src="../scripts/frame.js" type="text/javascript"></script>