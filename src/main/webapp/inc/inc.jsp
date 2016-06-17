<%@page import="com.ai.opt.sdk.components.ccs.CCSClientFactory"%>
<%@page import="com.ai.opt.uac.web.constants.Constants"%>
<%@page import="com.ai.opt.sdk.components.mcs.MCSClientFactory"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%
    String _base = request.getContextPath();
    request.setAttribute("_base", _base);
    response.setHeader("Cache-Control", "no-cache");
    response.setDateHeader("Expires", 0);
    response.setHeader("Pragma", "No-cache");
    
    String _baasBase=_base+"/theme/baas";
    request.setAttribute("_baasBase", _baasBase);
%>
<%
String mall_index_url = CCSClientFactory.getDefaultConfigClient().get(Constants.URLConstant.INDEX_URL_KEY);
request.setAttribute("mall_index_url",mall_index_url );
%>
<script>
    var _base = "${_base}";
    var _mall_index_url="${mall_index_url}";
</script> 
<script src="${_base}/resources/spm_modules/jquery/1.9.1/jquery.js"></script>
<script src="${_base}/resources/spm_modules/bootstrap/dist/js/bootstrap.js"></script>
<script src="${_base}/resources/spm_modules/seajs/2.3.0/dist/sea.js"></script>
<script src="${_base}/resources/spm_modules/seajs/seajs-css.js"></script>
<script src="${_base}/resources/spm_modules/app/core/config.js"></script>

<!-- UED style begin -->
 <link href="${_base}/theme/slp/styles/font-awesome.css" rel="stylesheet" type="text/css">
 <link href="${_base}/theme/slp/styles/global.css" rel="stylesheet" type="text/css">
 <link href="${_base}/theme/slp/styles/login-regsiter.css" rel="stylesheet" type="text/css"> 
 <script type="text/javascript" src="${_base}/theme/slp/scripts/jquery-1.11.1.min.js" ></script>
 <%-- <script type="text/javascript" src="${_base}/theme/slp/scripts/bootstrap.js" ></script>
  <script type="text/javascript" src="${_base}/theme/slp/scripts/jquery.fullPage.min.js" ></script>
  --%>
 <script type="text/javascript" src="${_base}/theme/slp/scripts/frame.js" ></script>
 <script type="text/javascript" src="${_base}/theme/slp/scripts/comp.js" ></script>
<!-- UED style end -->

