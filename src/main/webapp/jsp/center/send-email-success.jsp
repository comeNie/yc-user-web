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
	<div class="my-order-cnt">
       <div class="payment-title">
          <p><a href="#">账户中心</a>&gt;</p>
          <p><a href="#">帐户设置</a>&gt;</p>
          <p>绑定邮箱</a></p>
      </div>
      <div class="account-bj">
    
       <!--步骤-->
          <div class="steps">
                     <ul>
                     <li class="yellow-border"></li>
                     <li class="yellow-yuan">1</li>
                     <li class="yellow-word">验证身份</li>
                     </ul>
                     <ul>
                     <li class="yellow-border"></li>
                     <li class="yellow-yuan">2</li>
                     <li class="yellow-word">验证邮箱</li>
                     </ul>
                      <ul>
                     <li class="ash-border"></li>
                     <li class="ash-yuan">3</li>
                     <li class="ash-word">完成修改</li>
                     </ul>
           </div>                                          
          <!--/步骤结束-->
             <div class="verify-mailbox">
             	<ul>
             		<li><img src="${_slpbase }/images/icon-mail.png"/></li>
             		<li class="word">邮箱绑定邮件已发送至您的邮箱：${email}</li>
             		<li><a href="#">请在邮件中点击验证链接完成邮箱绑定<span>（验证链接30分钟内有效)</span></a></li>
             		<!-- <li class="vermail-btn"><input type="button" class="slp-btn regsiter-btn" value="查看验证邮件"/></li> -->	
             	</ul>
             </div>
      </div>

 
  </div>  
   <!--底部-->
    <%@ include file="/inc/foot.jsp" %>
   <!--底部 结束-->
 
</body>
</html>



