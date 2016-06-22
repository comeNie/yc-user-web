package com.ai.opt.uac.web.controller.center;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.ai.opt.base.vo.BaseResponse;
import com.ai.opt.base.vo.ResponseHeader;
import com.ai.opt.sdk.components.ccs.CCSClientFactory;
import com.ai.opt.sdk.components.mcs.MCSClientFactory;
import com.ai.opt.sdk.dubbo.util.DubboConsumerFactory;
import com.ai.opt.sdk.util.Md5Encoder;
import com.ai.opt.sdk.util.StringUtil;
import com.ai.opt.sdk.util.UUIDUtil;
import com.ai.opt.sdk.web.model.ResponseData;
import com.ai.opt.sso.client.filter.SLPClientUser;
import com.ai.opt.sso.client.filter.SSOClientConstants;
import com.ai.opt.sso.client.filter.SSOClientUser;
import com.ai.opt.sso.util.RegexUtils;
import com.ai.opt.uac.web.constants.Constants;
import com.ai.opt.uac.web.constants.Constants.ResultCode;
import com.ai.opt.uac.web.constants.Constants.UpdatePassword;
import com.ai.opt.uac.web.constants.VerifyConstants;
import com.ai.opt.uac.web.constants.VerifyConstants.EmailVerifyConstants;
import com.ai.opt.uac.web.constants.VerifyConstants.ResultCodeConstants;
import com.ai.opt.uac.web.model.email.SendEmailRequest;
import com.ai.opt.uac.web.model.retakepassword.SafetyConfirmData;
import com.ai.opt.uac.web.util.CacheUtil;
import com.ai.opt.uac.web.util.IPUtil;
import com.ai.opt.uac.web.util.VerifyUtil;
import com.ai.paas.ipaas.ccs.IConfigClient;
import com.ai.paas.ipaas.mcs.impl.CacheClient;
import com.ai.paas.ipaas.mcs.interfaces.ICacheClient;
import com.ai.slp.user.api.ucUserSecurity.interfaces.IUcUserSecurityManageSV;
import com.ai.slp.user.api.ucUserSecurity.param.UcUserPasswordRequest;
import com.ai.slp.user.api.ucuser.intefaces.IUcUserSV;
import com.ai.slp.user.api.ucuser.param.QueryBaseInfoRequest;
import com.ai.slp.user.api.ucuser.param.SearchUserResponse;
import com.esotericsoftware.minlog.Log;

@RequestMapping("/center/password")
@Controller
public class UpdatePasswordController {

	private static final Logger LOGGER = LoggerFactory.getLogger(UpdatePasswordController.class);

	//跳转账户页面
	@RequestMapping("/toValidatePage")
	public ModelAndView toValidatePage(HttpServletRequest request) {
	    return new ModelAndView("jsp/center/update-password1");
	}
	
	//跳转验证页面
	@RequestMapping("/toIdentity")
	public ModelAndView toIdentity(HttpServletRequest request, HttpServletResponse response){
	    ModelAndView model = new ModelAndView("jsp/center/update-password2");
	    String cacheKey = request.getParameter("cacheKey");
	    SLPClientUser user = (SLPClientUser) CacheUtil.getValue(cacheKey, UpdatePassword.CACHE_NAMESPACE, SLPClientUser.class);
	    model.addObject("email", user.getUserEmail()!=null&&"10".equals(user.getEmailValidateFlag())?user.getUserEmail():"未绑定邮箱");
	    model.addObject("phone", user.getUserMp()!=null?user.getUserMp():"未绑定验证手机");
	    model.addObject("userName",user.getUserLoginName());
	    //重新生成uuid
	    String uuid = UUIDUtil.genId32();
	    CacheUtil.setValue(uuid, 300, user, UpdatePassword.CACHE_NAMESPACE);
	    CacheUtil.deletCache(cacheKey, UpdatePassword.CACHE_NAMESPACE);
	    model.addObject("cacheKey",uuid);
	    return model;
	}
    //跳转修改密码页面
    @RequestMapping("/toPasswordPage")
    public ModelAndView toPasswordPage(HttpServletRequest request, HttpServletResponse response){
        ModelAndView model = new ModelAndView("jsp/center/update-password3");
        ICacheClient cacheClient = MCSClientFactory.getCacheClient(UpdatePassword.CACHE_NAMESPACE);
        
        String cacheKey = request.getParameter("cacheKey");
        String cacheCache = cacheClient.get("cacheKey");
        if(cacheCache!=""&&cacheCache.equals(cacheKey)){
        SLPClientUser user = (SLPClientUser) CacheUtil.getValue(cacheKey, UpdatePassword.CACHE_NAMESPACE, SLPClientUser.class);
        model.addObject("userId",user.getUserId());
        CacheUtil.deletCache(cacheKey, UpdatePassword.CACHE_NAMESPACE);
       }
        return model;
    }
    //跳转发送成功页面
    @RequestMapping("/sendEmailSuccess")
    public ModelAndView sendEmailSuccess(HttpServletRequest request, HttpServletResponse response){
        
        return new ModelAndView("jsp/center/send-email-success");
    }
    
    //检查账户是否存在
	@RequestMapping("/validateUserName")
	@ResponseBody
	public ResponseData<String> validateUsername(HttpServletRequest request, HttpServletResponse response){
        ResponseData<String> responseData = new ResponseData<String>("success", "success", null);
        ResponseHeader responseHeader = new ResponseHeader(true,"success","查询成功");
        String sessionId = request.getSession().getId();
        SLPClientUser user = new SLPClientUser();
        ICacheClient cacheClient = MCSClientFactory.getCacheClient(UpdatePassword.CACHE_NAMESPACE);
        // 检查图片验证码
        String pictureVerifyCodeCache = cacheClient.get(UpdatePassword.CACHE_KEY_VERIFY_PICTURE + sessionId).toLowerCase();
        String captcha = request.getParameter("captcha").toLowerCase();
        String userType = request.getParameter("userType");
        String userName = request.getParameter("userName");
        String tenantId = request.getParameter("tenantId");
        Log.info("++++++++++++++++++++++++"+pictureVerifyCodeCache+"++++++++++++++++++++++++++++");
        QueryBaseInfoRequest queryBaseInfoRequest = new QueryBaseInfoRequest();
        SearchUserResponse searchUserResponse = new SearchUserResponse();
        queryBaseInfoRequest.setTenantId(tenantId);
        queryBaseInfoRequest.setUserType(userType);
        //判断登录类型
        if (RegexUtils.checkIsPhone(userName)) {
            queryBaseInfoRequest.setUserMp(userName);
        } else if (RegexUtils.checkIsEmail(userName)) {
            queryBaseInfoRequest.setUserEmail(userName);
        } else {
            queryBaseInfoRequest.setUserLoginName(userName);
        }
        if(!pictureVerifyCodeCache.equals(captcha)){
            responseHeader.setIsSuccess(true);
            responseHeader.setResultCode(VerifyConstants.ResultCodeConstants.REGISTER_PICTURE_ERROR);
            responseData = new ResponseData<String>(VerifyConstants.ResultCodeConstants.REGISTER_PICTURE_ERROR, "验证码错误", null);
        }else{
            //调dubbo服务
            IUcUserSV ucUserSV = DubboConsumerFactory.getService("iUcUserSV");
            try {
                searchUserResponse = ucUserSV.queryByBaseInfo(queryBaseInfoRequest);
                responseHeader.setIsSuccess(true);
                responseData = new ResponseData<String>(VerifyConstants.ResultCodeConstants.SUCCESS_CODE, "校验成功", null);
            } catch (Exception e) {
                //查询错误
                responseHeader.setIsSuccess(false);
                responseData = new ResponseData<String>(VerifyConstants.ResultCodeConstants.ERROR_CODE, "系统错误", null);
            }
            if(searchUserResponse.getUserId()==null){
                responseHeader.setIsSuccess(false);
                responseHeader.setResultCode(VerifyConstants.ResultCodeConstants.USERNAME_ERROR);
                responseData = new ResponseData<String>(VerifyConstants.ResultCodeConstants.USERNAME_ERROR, "该账户不存在", null);
            }else{
                String cacheKey = UUIDUtil.genId32();
                BeanUtils.copyProperties(searchUserResponse, user);
                CacheUtil.setValue(cacheKey, 300, user, UpdatePassword.CACHE_NAMESPACE);
                responseData.setData(cacheKey);
            }
        }
        responseData.setResponseHeader(responseHeader);
        return responseData;
	}
	//获取图片验证码
	@RequestMapping("/getImageVerifyCode")
	@ResponseBody
	public void getImageVerifyCode(HttpServletRequest request, HttpServletResponse response) {
		String cacheKey = UpdatePassword.CACHE_KEY_VERIFY_PICTURE + request.getSession().getId();
		BufferedImage image = VerifyUtil.getImageVerifyCode(UpdatePassword.CACHE_NAMESPACE, cacheKey, 100, 38);
		try {
			ImageIO.write(image, "PNG", response.getOutputStream());
		} catch (IOException e) {
			LOGGER.error("生成图片验证码错误：" + e);
			e.printStackTrace();
		}
	}

	//更新密码
	@RequestMapping("/updatePassword")
    @ResponseBody
	public ResponseData<String> submit(HttpServletRequest request, HttpServletResponse response){
	    String tenantId = request.getParameter("tenantId");
	    String userId = request.getParameter("userId");
	    String newPassowrd=request.getParameter("userLoginPwd");
	    
	    UcUserPasswordRequest ucUserPasswordRequest = new UcUserPasswordRequest();
	    ucUserPasswordRequest.setTenantId(tenantId);
	    ucUserPasswordRequest.setAccountId(userId);
	    ucUserPasswordRequest.setAccountPassword(newPassowrd);
        
        //调用dubbo服务
        IUcUserSecurityManageSV ucUserSecurityManageSV = DubboConsumerFactory.getService("iUcUserSecurityManageSV");
        ResponseData<String> responseData = null;
        ResponseHeader responseHeader = null;
        try{
            ucUserSecurityManageSV.setPasswordData(ucUserPasswordRequest);
            Log.info("更新成功");
            responseData = new ResponseData<String>("success", "success", null);
            responseHeader = new ResponseHeader(true,"success",null);
        }catch(Exception e){
            responseData = new ResponseData<String>("fail", "fail", null);
            responseHeader = new ResponseHeader(false,"fail",null);
        }
        responseData.setResponseHeader(responseHeader);
	    return responseData;
	}
	
	/**
	 * 发送验证码
	 * 
	 * @return
	 */
	@RequestMapping("/sendVerify")
	@ResponseBody
	public ResponseData<String> sendVerify(HttpServletRequest request) {
		ResponseData<String> responseData = null;
		IConfigClient configClient = CCSClientFactory.getDefaultConfigClient();
		try{
		    //判断和绑定邮箱是否一致
		    /*if (user != null) {
	            if (UpdatePassword.CHECK_TYPE_PHONE.equals(confirmType)) {
	                // 检查ip发送次数
	                ResponseData<String> checkIpSendPhone = VerifyUtil.checkIPSendPhoneCount(UpdatePassword.CACHE_NAMESPACE, IPUtil.getIp(request)+UpdatePassword.CACHE_KEY_IP_SEND_PHONE_NUM);
	                if(!checkIpSendPhone.getResponseHeader().isSuccess()){
	                    return checkIpSendPhone;
	                }
	                // 发送手机验证码
	                String isSuccess = sendPhoneVerifyCode(sessionId, user);
	                if ("0000".equals(isSuccess)) {
	                    responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "短信验证码发送成功", null);
	                    ResponseHeader header = new ResponseHeader();
	                    header.setIsSuccess(true);
	                    header.setResultCode(ResultCodeConstants.SUCCESS_CODE);
	                    responseData.setResponseHeader(header);
	                    return responseData;
	                } else if ("0002".equals(isSuccess)) {
	                    String maxTimeStr = configClient.get(PhoneVerifyConstants.SEND_VERIFY_MAX_TIME_KEY);
	                    String errorMsg = Integer.valueOf(maxTimeStr)/60+"分钟内不可重复发送";
	                    responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, errorMsg, null);
	                    ResponseHeader header = new ResponseHeader();
	                    header.setIsSuccess(false);
	                    header.setResultCode(ResultCodeConstants.REGISTER_VERIFY_ERROR);
	                    header.setResultMessage(errorMsg);
	                    responseData.setResponseHeader(header);
	                    return responseData;
	                } else {
	                    responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_FAILURE, "短信验证码发送失败", null);
	                    ResponseHeader header = new ResponseHeader();
	                    header.setIsSuccess(false);
	                    header.setResultCode(ResultCodeConstants.ERROR_CODE);
	                    responseData.setResponseHeader(header);
	                    return responseData;
	                }
	            } else */
	                // 检查ip发送次数
	                ResponseData<String> checkIpSendEmail = VerifyUtil.checkIPSendEmailCount(UpdatePassword.CACHE_NAMESPACE, IPUtil.getIp(request)+UpdatePassword.CACHE_KEY_IP_SEND_EMAIL_NUM);
	                if(!checkIpSendEmail.getResponseHeader().isSuccess()){
	                    return checkIpSendEmail;
	                }
	                // 发送邮件验证码
	                String isSuccess = sendEmailVerifyURL(request);
	                if ("0000".equals(isSuccess)) {
	                    responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "邮箱验证码发送成功", null);
	                    ResponseHeader header = new ResponseHeader();
	                    header.setIsSuccess(true);
	                    header.setResultCode(ResultCodeConstants.SUCCESS_CODE);
	                    responseData.setResponseHeader(header);
	                    return responseData;
	                } 
	                if ("0002".equals(isSuccess)) {
	                    String maxTimeStr = configClient.get(EmailVerifyConstants.SEND_VERIFY_MAX_TIME_KEY);
	                    String errorMsg = Integer.valueOf(maxTimeStr)/60+"分钟内不可重复发送";
	                    responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, errorMsg, null);
	                    ResponseHeader header = new ResponseHeader();
	                    header.setIsSuccess(false);
	                    header.setResultCode(ResultCodeConstants.REGISTER_VERIFY_ERROR);
	                    header.setResultMessage(errorMsg);
	                    responseData.setResponseHeader(header);
	                    return responseData;
	                } 
		}catch(Exception e){
		    LOGGER.error("发送验证码错误：" + e);
		}
		return null;
	}

	/**
	 * 发送手机验证码
	 * 
	 * @param userClient
	 */
	/*private String sendPhoneVerifyCode(String sessionId, SLPClientUser user) {
		SMDataInfoNotify smDataInfoNotify = new SMDataInfoNotify();
		String phoneVerifyCode = RandomUtil.randomNum(PhoneVerifyConstants.VERIFY_SIZE);
		// 查询是否发送过短信
		String smstimes = "1";
		String smskey = UpdatePassword.CACHE_KEY_SEND_PHONE_NUM + user.getUserMp();
		ICacheClient cacheClient = MCSClientFactory.getCacheClient(UpdatePassword.CACHE_NAMESPACE);
		IConfigClient defaultConfigClient = CCSClientFactory.getDefaultConfigClient();
		String times = cacheClient.get(smskey);
		try{
		    if (StringUtil.isBlank(times)) {
	            // 将验证码放入缓存
	            String cacheKey = UpdatePassword.CACHE_KEY_VERIFY_PHONE + sessionId;
	            String overTimeStr = defaultConfigClient.get(PhoneVerifyConstants.VERIFY_OVERTIME_KEY);
	            cacheClient.setex(cacheKey, Integer.valueOf(overTimeStr), phoneVerifyCode);
	            // 将发送次数放入缓存
	            String maxTimeStr = defaultConfigClient.get(PhoneVerifyConstants.SEND_VERIFY_MAX_TIME_KEY);
	            cacheClient.setex(smskey, Integer.valueOf(maxTimeStr), smstimes);
	            // 设置短息信息
	            List<SMData> dataList = new LinkedList<SMData>();
	            SMData smData = new SMData();
	            smData.setGsmContent("${VERIFY}:" + phoneVerifyCode + "^${VALIDMINS}:" + Integer.valueOf(overTimeStr) / 60);
	            smData.setPhone(user.getUserMp());
	            smData.setTemplateId(PhoneVerifyConstants.TEMPLATE_RETAKE_PASSWORD_ID);
	            smData.setServiceType(PhoneVerifyConstants.SERVICE_TYPE);
	            dataList.add(smData);
	            smDataInfoNotify.setDataList(dataList);
	            smDataInfoNotify.setMsgSeq(VerifyUtil.createPhoneMsgSeq());
	            smDataInfoNotify.setTenantId(user.getTenantId());
	            smDataInfoNotify.setSystemId(Constants.SYSTEM_ID);
	            boolean flag = VerifyUtil.sendPhoneInfo(smDataInfoNotify);
	            if (flag) {
	                // 成功
	                return "0000";
	            } else {
	                // 失败
	                return "0001";
	            }
	        } else {
	            // 重复发送
	            return "0002";
	        }
		}catch(Exception e){
		    LOGGER.error("发送验证码错误：" + e);
		}
		return null;
	}*/

	/**
     * 发送验证邮件
     * 
     */
    private String sendEmailVerifyURL(HttpServletRequest request) {
        // 查询是否发送过邮件
        String smstimes = "1";
        String smskey = UpdatePassword.CACHE_KEY_SEND_EMAIL_NUM;
        ICacheClient cacheClient = MCSClientFactory.getCacheClient(UpdatePassword.CACHE_NAMESPACE);
        IConfigClient defaultConfigClient = CCSClientFactory.getDefaultConfigClient();
        String times = cacheClient.get(smskey);
        try{
            if (StringUtil.isBlank(times)) {
                // 邮箱验证
                String email = request.getParameter("email");
                String userName = request.getParameter("userName");
                SendEmailRequest emailRequest = new SendEmailRequest();
                emailRequest.setTomails(new String[] { email });
                emailRequest.setTemplateRUL(UpdatePassword.TEMPLATE_EMAIL_URL);
                emailRequest.setSubject(UpdatePassword.EMAIL_SUBJECT);
                // 获取url
                String cacheKey = request.getParameter("cacheKey");
                String path = request.getContextPath();  
                String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";  
                String url = basePath+"center/password/toPasswordPage?cacheKey="+cacheKey;
                String overTimeStr = defaultConfigClient.get(EmailVerifyConstants.VERIFY_OVERTIME_KEY);
                cacheClient.setex("cacheKey", Integer.valueOf(overTimeStr)/60*500, cacheKey);
                // 将发送次数放入缓存
                String maxTimeStr = defaultConfigClient.get(EmailVerifyConstants.SEND_VERIFY_MAX_TIME_KEY);
                cacheClient.setex(smskey, Integer.valueOf(maxTimeStr), smstimes);
                // 超时时间
                String overTime = ObjectUtils.toString(Integer.valueOf(overTimeStr) / 60);
                emailRequest.setData(new String[] { userName, url, overTime });
                boolean flag = VerifyUtil.sendEmail(emailRequest);
                if (flag) {
                    // 成功
                    return "0000";
                } else {
                    // 失败
                    return "0001";
                }
            } else {
                // 重复发送
                return "0002";
            } 
        }catch(Exception e){
            LOGGER.error("发送验证码错误：" + e);
        }
        return null;
    }
	
	/**
	 * 发送邮件验证码
	 * 
	 * @param accountInfo
	 */
	/*private String sendEmailVerifyCode(String sessionId, SLPClientUser user) {
		// 查询是否发送过邮件
		String smstimes = "1";
		String smskey = UpdatePassword.CACHE_KEY_SEND_EMAIL_NUM + user.getUserEmail();
		ICacheClient cacheClient = MCSClientFactory.getCacheClient(UpdatePassword.CACHE_NAMESPACE);
		IConfigClient defaultConfigClient = CCSClientFactory.getDefaultConfigClient();
		String times = cacheClient.get(smskey);
		try{
		    if (StringUtil.isBlank(times)) {
	            // 邮箱验证
	            String email = user.getUserEmail();
	            String nickName = user.getUserId();
	            SendEmailRequest emailRequest = new SendEmailRequest();
	            emailRequest.setTomails(new String[] { email });
	            emailRequest.setTemplateRUL(UpdatePassword.TEMPLATE_EMAIL_URL);
	            emailRequest.setSubject(UpdatePassword.EMAIL_SUBJECT);
	            // 验证码
	            String verifyCode = RandomUtil.randomNum(EmailVerifyConstants.VERIFY_SIZE);
	            // 将验证码放入缓存
	            String cacheKey = UpdatePassword.CACHE_KEY_VERIFY_EMAIL + sessionId;
	            String overTimeStr = defaultConfigClient.get(EmailVerifyConstants.VERIFY_OVERTIME_KEY);
	            cacheClient.setex(cacheKey, Integer.valueOf(overTimeStr), verifyCode);
	            // 将发送次数放入缓存
	            String maxTimeStr = defaultConfigClient.get(EmailVerifyConstants.SEND_VERIFY_MAX_TIME_KEY);
	            cacheClient.setex(smskey, Integer.valueOf(maxTimeStr), smstimes);
	            // 超时时间
	            String overTime = ObjectUtils.toString(Integer.valueOf(overTimeStr) / 60);
	            emailRequest.setData(new String[] { nickName, verifyCode, overTime });
	            boolean flag = VerifyUtil.sendEmail(emailRequest);
	            if (flag) {
	                // 成功
	                return "0000";
	            } else {
	                // 失败
	                return "0001";
	            }
	        } else {
	            // 重复发送
	            return "0002";
	        } 
		}catch(Exception e){
		    LOGGER.error("发送验证码错误：" + e);
		}
		return null;
	}
*/
	/**
	 * 身份认证
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping("/confirmInfo")
	@ResponseBody
	public ResponseData<String> confirmInfo(HttpServletRequest request, SafetyConfirmData safetyConfirmData) {
		ResponseData<String> responseData = null;
		String confirmType = safetyConfirmData.getConfirmType();
		ICacheClient cacheClient = MCSClientFactory.getCacheClient(UpdatePassword.CACHE_NAMESPACE);
		String sessionId = request.getSession().getId();
		// 检查图片验证码
		String pictureVerifyCodeCache = cacheClient.get(UpdatePassword.CACHE_KEY_VERIFY_PICTURE + sessionId);
		String pictureVerifyCode = safetyConfirmData.getPictureVerifyCode();
		ResponseData<String> pictureCheck = VerifyUtil.checkPictureVerifyCode(pictureVerifyCode, pictureVerifyCodeCache);
		String resultCode = pictureCheck.getResponseHeader().getResultCode();
		if (!VerifyConstants.ResultCodeConstants.SUCCESS_CODE.equals(resultCode)) {
			return pictureCheck;
		}
		// 检查短信或邮箱验证码
		if (UpdatePassword.CHECK_TYPE_PHONE.equals(confirmType)) {
			// 检查短信验证码
			String verifyCodeCache = cacheClient.get(UpdatePassword.CACHE_KEY_VERIFY_PHONE + sessionId);
			String verifyCode = safetyConfirmData.getVerifyCode();
			ResponseData<String> phoneCheck = VerifyUtil.checkPhoneVerifyCode(verifyCode, verifyCodeCache);
			String phoneResultCode = phoneCheck.getResponseHeader().getResultCode();
			if (!VerifyConstants.ResultCodeConstants.SUCCESS_CODE.equals(phoneResultCode)) {
				return phoneCheck;
			}
		} else if (UpdatePassword.CHECK_TYPE_EMAIL.equals(confirmType)) {
			// 检查邮箱验证码
			String verifyCodeCache = cacheClient.get(UpdatePassword.CACHE_KEY_VERIFY_EMAIL + sessionId);
			String verifyCode = safetyConfirmData.getVerifyCode();
			ResponseData<String> emailCheck = VerifyUtil.checkEmailVerifyCode(verifyCode, verifyCodeCache);
			String emailResultCode = emailCheck.getResponseHeader().getResultCode();
			if (!VerifyConstants.ResultCodeConstants.SUCCESS_CODE.equals(emailResultCode)) {
				return emailCheck;
			}
		}
		// 用户信息放入缓存
		String uuid = UUIDUtil.genId32();
		SSOClientUser userClient = (SSOClientUser) request.getSession().getAttribute(SSOClientConstants.USER_SESSION_KEY);
		CacheUtil.setValue(uuid, Constants.UUID.OVERTIME, userClient, Constants.UpdatePassword.CACHE_NAMESPACE);
		responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "正确", "/center/password/setPassword?" + Constants.UUID.KEY_NAME + "=" + uuid);
		ResponseHeader responseHeader = new ResponseHeader(true, VerifyConstants.ResultCodeConstants.SUCCESS_CODE, "正确");
		responseData.setResponseHeader(responseHeader);
		return responseData;
	}

	/**
	 * 修改邮箱页跳转
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping("/setPassword")
	public ModelAndView UpdatePasswordPage(HttpServletRequest request) {
		String uuid = request.getParameter(Constants.UUID.KEY_NAME);
		SSOClientUser userClient = (SSOClientUser) CacheUtil.getValue(uuid, Constants.UpdatePassword.CACHE_NAMESPACE, SSOClientUser.class);
		if (userClient == null) {
			return new ModelAndView("redirect:/center/password/confirminfo");
		}
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("uuid", uuid);
		return new ModelAndView("jsp/center/update-password-new", model);
	}

	/**
	 * 设置新邮箱
	 * 
	 * @param request
	 * @param newPassword
	 * @return
	 */
	@RequestMapping("/setNewPassword")
	@ResponseBody
	public ResponseData<String> setNewPassword(HttpServletRequest request, String password) {
		ResponseData<String> responseData = null;
		ResponseHeader responseHeader = null;
		String uuid = request.getParameter(Constants.UUID.KEY_NAME);
		SLPClientUser userClient = (SLPClientUser) CacheUtil.getValue(uuid, Constants.UpdatePassword.CACHE_NAMESPACE, SSOClientUser.class);
		if (userClient == null) {
			responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "身份认证失效", "/center/password/confirminfo");
			responseHeader = new ResponseHeader(false, VerifyConstants.ResultCodeConstants.USER_INFO_NULL, "认证身份失效");
		} else {
			//ILoginSV iLoginSV = DubboConsumerFactory.getService("iLoginSV");
			//UserLoginResponse userLoginResponse = iLoginSV.queryAccountByUserName(userClient.getPhone());
			//String accountPassword = userLoginResponse.getAccountPassword();
			String encodePassword = Md5Encoder.encodePassword(password);
			/*if(encodePassword.equals(accountPassword)){
				responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "新密码不能与旧密码相同，请重新输入", null);
				responseHeader = new ResponseHeader(false, VerifyConstants.ResultCodeConstants.PASSWORD_ERROR, "新密码不能与旧密码相同，请重新输入");
				responseData.setResponseHeader(responseHeader);
				return responseData;
			}*/
			// 更新密码
			IUcUserSecurityManageSV accountSecurityManageSV = DubboConsumerFactory.getService("iUcUserSecurityManageSV");
			UcUserPasswordRequest accountPasswordRequest = new UcUserPasswordRequest();
			accountPasswordRequest.setAccountId(userClient.getUserId());
			accountPasswordRequest.setAccountPassword(encodePassword);
			//accountPasswordRequest.setUpdateAccountId(userClient.getAccountId());
			BaseResponse resultData = accountSecurityManageSV.setPasswordData(accountPasswordRequest);
			if (ResultCode.SUCCESS_CODE.equals(resultData.getResponseHeader().getResultCode())) {
				String newuuid = UUIDUtil.genId32();
				CacheUtil.setValue(newuuid, Constants.UUID.OVERTIME, userClient, Constants.UpdatePassword.CACHE_NAMESPACE);
				responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "修改密码成功", "/center/password/success?" + Constants.UUID.KEY_NAME + "=" + newuuid);
				responseHeader = new ResponseHeader(false, VerifyConstants.ResultCodeConstants.SUCCESS_CODE, "修改密码成功");
				CacheUtil.deletCache(uuid, Constants.UpdatePassword.CACHE_NAMESPACE);
			} else {
				String resultMessage = resultData.getResponseHeader().getResultMessage();
				responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_FAILURE, resultMessage, null);
				responseHeader = new ResponseHeader(false, VerifyConstants.ResultCodeConstants.ERROR_CODE, "修改密码失败");
			}
		}
		responseData.setResponseHeader(responseHeader);
		return responseData;
	}

	@RequestMapping("/success")
	public ModelAndView successPage(HttpServletRequest request) {
		String uuid = request.getParameter(Constants.UUID.KEY_NAME);
		SSOClientUser userClient = (SSOClientUser) CacheUtil.getValue(uuid, Constants.UpdatePassword.CACHE_NAMESPACE, SSOClientUser.class);
		if (userClient == null) {
			return new ModelAndView("redirect:/center/password/confirminfo");
		}
		CacheUtil.deletCache(uuid, Constants.UpdatePassword.CACHE_NAMESPACE);
		return new ModelAndView("jsp/center/update-password-success");
	}
	
}
