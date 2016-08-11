<%@page import="java.util.Date"%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!--login－头部-->
<div class="login-head">
		<div class="logo">
			<ul>
				<li><a href="${mall_index_url }"><img
						src="${_base}/theme/slp/images/hnlogo.png"></a></li>
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