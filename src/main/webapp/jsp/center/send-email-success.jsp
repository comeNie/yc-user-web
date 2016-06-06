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

<body>
 <!--顶部菜单-->
 <div class="top-menu">
     <div class="top-menu-main">
     <ul class="left">
         <li>所在地</li>
         <li class="city"><a href="#" >北京<img src="${_base }/theme/slp/images/open-a.png"></a>
         <!--选择所在地城市-->
                 <div class="city-hover" style=" display:none;">
                      <ul class="title">
                          <li class="hot">热门省份</li>
                          <li><A href="#">北京</A></li>
                          <li><A href="#">上海</A></li>
                          <li><A href="#">广东</A></li>
                          <li><A href="#">浙江</A></li> 
                          <li><A href="#">江苏</A></li>                             
                      </ul>
                       <ul class="city-list">
                          <li><A href="#">北京</A></li>
                          <li><A href="#">上海</A></li>
                          <li><A href="#">天津</A></li>
                          <li><A href="#">重庆</A></li>
                          <li><A href="#">河北</A></li> 
                          <li><A href="#">山西</A></li>
                          <li><A href="#">河南</A></li>
                          <li><A href="#">辽宁</A></li>
                          <li><A href="#">吉林</A></li>
                          <li><A href="#">黑龙江</A></li>
                          <li><A href="#">内蒙古</A></li> 
                          <li><A href="#">江苏</A></li>
                          <li><A href="#">山东</A></li>
                          <li><A href="#">安徽</A></li>
                          <li><A href="#">浙江</A></li>
                          <li><A href="#">福建</A></li>
                          <li><A href="#">湖北</A></li>
                          <li><A href="#">广东</A></li>
                          <li><A href="#">海南</A></li> 
                          <li><A href="#">四川</A></li>
                          <li><A href="#">贵州</A></li>  
                          <li><A href="#">云南</A></li>
                          <li><A href="#">北京</A></li>
                          <li><A href="#">西藏</A></li>
                          <li><A href="#">甘肃</A></li>
                          <li><A href="#">青海</A></li>
                          <li><A href="#">宁夏</A></li> 
                          <li><A href="#">新疆</A></li>
                          <li><A href="#">台湾</A></li>
                          <li><A href="#">香港</A></li>
                          <li><A href="#">澳门</A></li>                           
                      </ul>
                  </div>
                  
         </li> 
       <!--选择所在地城市结束-->
         
         
     </ul>
     <ul class="right">
         <li><A href="#">免费注册</A></li>
         <li><A href="#">登录</A>|</li>
         <li><A href="#"><i class="icon-shopping-cart"></i>购物车</A>|</li>
         <li><A href="#">我的订单</A>|</li>
         <li class="use"><A href="#">账户中心<img src="${_base }/theme/slp/images/open-a.png"></A>|
             <!--账户展开-->
             <div class="use-hover" style=" display:none;">
                 <ul>
                     <li><A href="#">我的订单</A></li>
                     <li><A href="#">账户余额</A></li>
                     <li><A href="#">充值卡券</A></li>
                     <li><A href="#">收藏夹</A></li>
                     <li><A href="#">通讯录</A></li>
                     <li><A href="#">安全设置</A></li>
                 </ul>
             </div>
             <!--账户展开结束-->
         </li>
         <li><A href="#">企业采购</A>|</li>
         <li><A href="#">代理商</A>|</li>
         <li><A href="#">供货商</A>|</li>
         <li><A href="#">API</A>|</li>
         <li class="kefu"><A href="#">客户服务<img src="${_base }/theme/slp/images/open-a.png"></A>
               <!--账户展开-->
             <div class="kefu-hover" style=" display:none;">
                 <ul>
                     <li><A href="#">帮助中心</A></li>
                     <li><A href="#">联系我们</A></li>
                     <li><A href="#">意见反馈</A></li>
                 </ul>
             </div>
             <!--账户展开结束-->
         </li>
     </ul>
     </div>
 
 </div>
<!--顶部菜单结束-->

<!--导航区域-->
<div class="fsast-bj">
 <div class="fsast-head">
        <div class="fsast-logo">
            <ul>
                <li><a href="#"><img src="${_base }/theme/slp/images/login-logo.png"></a></li>
                <li>账户中心</li>
            </ul>
        </div>
        <div class="fsast-bav">
            <ul>
                <li><a href="#">首页</a></li>
                <li><a href="#">我的订单</a></li>
                <li class="shez"><a href="#">账户设置<i class="icon-angle-down"></i></a>
                <div class="setgs" style=" display:none;">
                    <ul>
                        <li><a href="#">安全设置</a></li>
                        <li><a href="#">登录密码</a></li>
                        <li><a href="#">支付密码</a></li>
                        <li><a href="#">手机绑定</a></li>
                        <li><a href="#">邮箱绑定</a></li>
                    </ul>
                </div>
                </li>
                <li><a href="#">消息</a><p class="icon">4</p></li>                          
            </ul>
        </div>
        <div class="fsast-search">
             <ul>
                  <li><input type="text" class="fsast-xlarge"></li>
                  <li><A href="#"><i class="icon-search"></i></A></li>
             </ul>  
        </div>
    </div>
 </div>
<!--导航区域结束-->
     
     <!--订单详情-->
<div class="fsast-charge">
    <div class="big-wrapper"><!--内侧居中框架-->
  <div class="my-order-cnt">
       <div class="payment-title">
           <p><a href="#">账户中心</a>&gt;</p>
          <p><a href="#">帐户设置</a>&gt;</p>
          <p>绑定邮箱</a></p>
      </div>
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
             	<ul>
             		<li><img src="${_base }/theme/slp/images/icon-mail.png"></li>
             		<li class="word">邮箱绑定邮件已发送至您的邮箱：ying****un@163.com</li>
             		<li><a href="#">请在邮件中点击验证链接完成邮箱绑定<span>（验证链接24小时内有效)</span></a></li>
             		<li class="vermail-btn"><input type="button" class="slp-btn regsiter-btn" value="查看验证邮件"></li>	
             	</ul>
             	
             	
             </div>
      </div>

  </div>  
    </div>
     </div>
   <!--底部-->
    <div class="footer-wrapper">
    <!--底部－help-->
      <div class="footer">
        <div class="footer-main">
          <div class="footer-title">
              <ul>
                  <li>
                      <p><img src="${_base }/theme/slp/images/foot-a.png"></p>
                      <p>话费流量全面支持</p>
                  </li>
                  <li>
                      <p><img src="${_base }/theme/slp/images/foot-b.png"></p>
                      <p>价格更低优惠更多</p>
                  </li>
                  <li>
                      <p><img src="${_base }/theme/slp/images/foot-c.png"></p>
                      <p>即时到账安全便捷</p>
                  </li>
                  <li>
                      <p><img src="${_base }/theme/slp/images/foot-d.png"></p>
                      <p>企业充值轻松无忧</p>
                  </li>
              </ul>
          </div>
          
          <div class="footer-title-list">
          <ul>
          <li class="word">商品分类</li>
          <li><a href="#">话费快充</a></li>
          <li><a href="#">流量快充</a></li>
          <li><a href="#">话费卡</a></li>
          <li><a href="#">流量卡</a></li>
          </ul>
          <ul>
          <li class="word">帮助中心</li>
          <li><a href="#">话费充值</a></li>
          <li><a href="#">账户使用</a></li>
          <li><a href="#">支付购买</a></li>
          <li><a href="#">订单相关</a></li>
          </ul>
          <ul>
          <li class="word">商家合作</li>
          <li><a href="#">企业采购</a></li>
          <li><a href="#">代理商申请</a></li>
          <li><a href="#">供货商合作</a></li>
          <li><a href="#">招商平台</a></li>
          </ul>
          <ul class="bor-none">
          <li class="word">网站导航</li>
          <li><a href="#">网站地图</a></li>
          <li><a href="#">亚信官网</a></li>
          <li><a href="#">亚信国际</a></li>
          <li><a href="#">亚信数据</a></li>
          </ul>
          </div>
        </div>
      </div>
   <!--底部－about-->
      <div class="footer-alink">
      <ul>
      <li>
      <a href="#">关于我们</a>
      <a href="#">联系我们</a>
      <a href="#">企业采购</a>
      <a href="#">代理商申请</a>
      <a href="#">供货合作</a>
      <a href="#">API文档</a>
      <a href="#">亚信官网</a>
      <a href="#">网站地图</a>
      </li>
      <li>京ICP备11005544号-15                京公网安备110108007119号</li>
      <li>©2016-2018 亚信旗下话费充值平台，版权所有  All Rights Reserved</li>
      </ul>
                                                                                                   
      </div>
    
    
    </div>
   <!--底部 结束-->

</body>
</html>



