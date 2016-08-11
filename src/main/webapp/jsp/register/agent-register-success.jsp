<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<%@ include file="/inc/inc.jsp"%>
<!--Support IE Text -->
<meta http-equiv="X-UA-Compatible" content="IE=Edge" /> 
<title>注册-成功</title>
 <script type="text/javascript">
 //var autoInterval;//定时器
(function () {
	seajs.use('app/register/agent-register-success', function (RegisterSucessPager) {
		var pager = new RegisterSucessPager();
		pager.render();
	});
})(); 
</script>
</head>

<body class="logo-body">
<%@ include file="/jsp/register/register-login.jsp"%>
   <!--login－头部-->
   <div class="login-head">
        <div class="logo">
            <ul>
                <li><a href="${mall_index_url}"><img src="${_base}/theme/slp/images/hnlogo.png"/></a></li>
                <li>代理商注册</li>
            </ul>
        </div>
        
       
    </div>
  <!--login－头部结束-->
  <div class="g-regsiter">
      <!--白色框架-->
        <div class="regsiter-center">
            <!--主体内容-->
                 <!--注册成功-->
                 <div class="regeiter-success">
                 <p><img src="${_base}/theme/slp/images/succ.png"/></p>
                 <p class="word">恭喜，您的账户 <%=request.getAttribute("loginName") %> 已经注册成功！</p>
                 <p><span id="time">10</span>秒后，跳转至您的商城首页。<A id="gotoMall" href="javascript:void(0);">立即前往>></A></p>
                 <input type="hidden" id="k" value="${k }" />
                 </div>
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
