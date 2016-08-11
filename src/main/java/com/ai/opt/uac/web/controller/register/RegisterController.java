package com.ai.opt.uac.web.controller.register;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.ai.opt.base.exception.BusinessException;
import com.ai.opt.base.vo.BaseResponse;
import com.ai.opt.base.vo.ResponseHeader;
import com.ai.opt.sdk.components.ccs.CCSClientFactory;
import com.ai.opt.sdk.components.mcs.MCSClientFactory;
import com.ai.opt.sdk.dubbo.util.DubboConsumerFactory;
import com.ai.opt.sdk.util.CollectionUtil;
import com.ai.opt.sdk.util.RandomUtil;
import com.ai.opt.sdk.util.StringUtil;
import com.ai.opt.sdk.util.UUIDUtil;
import com.ai.opt.sdk.web.model.ResponseData;
import com.ai.opt.sso.client.filter.SSOClientUtil;
import com.ai.opt.uac.web.constants.Constants;
import com.ai.opt.uac.web.constants.Constants.Register;
import com.ai.opt.uac.web.constants.Constants.ResultCode;
import com.ai.opt.uac.web.constants.Constants.SMSUtil;
import com.ai.opt.uac.web.constants.VerifyConstants.EmailVerifyConstants;
import com.ai.opt.uac.web.constants.VerifyConstants.PhoneVerifyConstants;
import com.ai.opt.uac.web.constants.VerifyConstants.ResultCodeConstants;
import com.ai.opt.uac.web.model.email.SendEmailRequest;
import com.ai.opt.uac.web.model.login.LoginUser;
import com.ai.opt.uac.web.model.register.GetSMDataReq;
import com.ai.opt.uac.web.model.register.UpdateEmailReq;
import com.ai.opt.uac.web.util.CacheUtil;
import com.ai.opt.uac.web.util.IPUtil;
import com.ai.opt.uac.web.util.VerifyUtil;
import com.ai.paas.ipaas.ccs.IConfigClient;
import com.ai.paas.ipaas.mcs.interfaces.ICacheClient;
import com.ai.runner.center.mmp.api.manager.interfaces.SMSServices;
import com.ai.runner.center.mmp.api.manager.param.SMData;
import com.ai.runner.center.mmp.api.manager.param.SMDataInfoNotify;
import com.ai.slp.common.api.servicenum.interfaces.IServiceNumSV;
import com.ai.slp.common.api.servicenum.param.ServiceNum;
import com.ai.slp.user.api.register.interfaces.IRegisterSV;
import com.ai.slp.user.api.register.param.RegisterParamsRequest;
import com.ai.slp.user.api.register.param.RegisterResponse;
import com.ai.slp.user.api.register.param.UcContactInfoParams;
import com.ai.slp.user.api.register.param.UcUserParams;
import com.ai.slp.user.api.ucUserSecurity.interfaces.IUcUserSecurityManageSV;
import com.ai.slp.user.api.ucUserSecurity.param.UcUserEmailRequest;
import com.ai.slp.user.api.ucuser.intefaces.IUcUserSV;
import com.ai.slp.user.api.ucuser.param.SearchUserRequest;
import com.ai.slp.user.api.ucuser.param.SearchUserResponse;
import com.alibaba.fastjson.JSON;

import net.sf.json.JSONObject;

@RequestMapping("/reg")
@Controller
public class RegisterController {
	private static final Logger LOG = LoggerFactory.getLogger(RegisterController.class);

	@RequestMapping("/toRegister")
	public ModelAndView register(String userType,HttpServletRequest request) {
	    /**
	     * 10 个人注册  11 企业用户  12代理商注册 13分销商注册
	     */
	    if("10".equals(userType)){
	        return new ModelAndView("jsp/register/register");
	    }else if("11".equals(userType)){
	        return new ModelAndView("jsp/register/companyRegister");
	    }else if("12".equals(userType)){
	        return new ModelAndView("jsp/register/agentRegister");
	    }else{
	        return new ModelAndView("jsp/register/supplierRegister");
	    }
	}

	@RequestMapping("/protocol")
	public ModelAndView registerProtocol(HttpServletRequest request) {

		return new ModelAndView("jsp/register/register-protocol");
	}

	@RequestMapping("/toRegisterEmail")
	public ModelAndView registerEmail(@RequestParam(value = "accountIdKey", required = false) String accountIdKey, HttpServletRequest request,HttpServletResponse response) {
		request.setAttribute("accountIdKey", accountIdKey);
		return new ModelAndView("jsp/register/register-email");
	}

	@RequestMapping("/toRegisterSuccess")
	public ModelAndView registerSuccess(@RequestParam(value = "loginName", required = false) String loginName,@RequestParam(value = "userType", required = false) String userType, HttpServletRequest request) {
		String key=request.getParameter("key");
	    String loginNameStr = request.getParameter("loginName");
	    
	    //将注册的用户信息，转存到cache里，用于自动登录
	    String uuid=UUIDUtil.genId32();
	    LoginUser loginUser = (LoginUser)CacheUtil.getValue(key, Constants.LoginConstant.CACHE_NAMESPACE, LoginUser.class);
	    CacheUtil.setValue(uuid, 1800, JSON.toJSONString(loginUser), Constants.LoginConstant.CACHE_NAMESPACE);
	    try {
            loginNameStr = new String(loginNameStr.getBytes("iso8859-1"),"utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
	    
	    //将注册的用户信息，转存到cache里，用于自动登录
	    request.setAttribute("k", uuid);
	    request.setAttribute("loginName", loginNameStr);
	    
	    Cookie[] cookies = request.getCookies();
	    if(!CollectionUtil.isEmpty(cookies)){
	        for(Cookie cookie:cookies){
	            if("CASTGC".equalsIgnoreCase(cookie.getName()) || "CASPRIVACY".equalsIgnoreCase(cookie.getName())){
	            	LOG.error("清除单点登录信息【"+cookie.getName()+"】:"+JSON.toJSONString(cookie));
	                cookie.setMaxAge(0);
	            }
	            
	        }
	    }
	    
		 /**
         * 10 个人注册  11 企业用户  12代理商注册 13分销商注册
         */
        if("10".equals(userType)){
            return new ModelAndView("jsp/register/register-success");
        }else if("11".equals(userType)){
            return new ModelAndView("jsp/register/company-register-success");
        }else if("12".equals(userType)){
            return new ModelAndView("jsp/register/agent-register-success");
        }else{
            return new ModelAndView("jsp/register/supplier-register-success");
        }
	}

	/**
	 * 注册账号
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping("/register")
	@ResponseBody
	public ResponseData<String> addAccount(String request, HttpSession session, HttpServletRequest req) {
		ResponseData<String> responseData = null;
		JSONObject conditionObject = JSONObject.fromObject(request);
		Map <String,Class> mymap = new HashMap<String,Class>();
        mymap.put("ucUserParam", UcUserParams.class);
        mymap.put("ucContactInfoParams", UcContactInfoParams.class);
        RegisterParamsRequest userParams = (RegisterParamsRequest)conditionObject.toBean(conditionObject,RegisterParamsRequest.class,mymap);
        // MD5加密
		//String password = Md5Encoder.encodePassword(request.getUcUserParam().getUserLoginPwd());
		try {

			ICacheClient iCacheClient = MCSClientFactory.getCacheClient(Register.CACHE_NAMESPACE);
			ResponseHeader header = new ResponseHeader();
			header.setIsSuccess(true);
			/*// 校验图片是否失效
			if (StringUtil.isBlank(pictureCode)) {
				header.setResultCode(Register.REGISTER_PICTURE_OVERTIME_ERROR);
				header.setResultMessage("图形验证码已失效");
				responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "图形验证码已失效", null);
				responseData.setResponseHeader(header);
				return responseData;
			}
			// 校验验证码
			if (pictureCode.compareToIgnoreCase(request.getPictureVerifyCode()) != 0) {
				header.setResultCode(Register.REGISTER_PICTURE_ERROR);
				header.setResultMessage("图形验证码错误");
				responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "图形验证码错误", null);
				responseData.setResponseHeader(header);
				return responseData;
			}*/

			// 校验短信验证码是否失效
			String phoneAddIdenti = iCacheClient.get(Register.REGISTER_PHONE_KEY + session.getId());
			if (StringUtil.isBlank(phoneAddIdenti)) {
                header.setResultCode(Register.REGISTER_SSM_OVERTIME_ERROR);
                header.setResultMessage("验证码已失效");
                responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "验证码已失效", null);
                responseData.setResponseHeader(header);
                return responseData;
            }
			String s[] = phoneAddIdenti.split(";");
			String phone = s[0];
			String vitify = s[1];
			
			if (!userParams.getUcUserParam().getUserMp().equals(phone)) {
				header.setResultCode(Register.REGISTER_SSM_DUMPHONE_ERROR);
				header.setResultMessage("手机与发送短信手机不一致");
				responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "手机与发送短信手机不一致", null);
				responseData.setResponseHeader(header);
				return responseData;
			}
			if (StringUtil.isBlank(vitify)) {
				header.setResultCode(Register.REGISTER_SSM_OVERTIME_ERROR);
				header.setResultMessage("验证码已失效");
				responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "验证码已失效", null);
				responseData.setResponseHeader(header);
				return responseData;
			}
			// 校验短信验证码
			if (!userParams.getUcUserParam().getPhoneVerifyCode().equals(vitify)) {
				header.setResultCode(Register.REGISTER_SSM_ERROR);
				header.setResultMessage("短信验证码错误");
				responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "短信验证码错误", null);
				responseData.setResponseHeader(header);
				return responseData;
			}
			IRegisterSV iRegisterSV = DubboConsumerFactory.getService("iRegisterSV");
			IServiceNumSV serviceNumSV = DubboConsumerFactory.getService("iServiceNumSV");
			ServiceNum serviceNum = serviceNumSV.getServiceNumByPhone(userParams.getUcUserParam().getUserMp());
			userParams.getUcUserParam().setProvinceCode(serviceNum.getProvinceCode());
			userParams.getUcUserParam().setCityCode(serviceNum.getCityCode());
			RegisterResponse response = iRegisterSV.insertUcUser(userParams);
			//PhoneRegisterResponse response = iRegisterSV.registerByPhone(request);
			String code =response.getResponseCode();
			String userId = response.getUserId();
			String message = "1";
			if (Register.PHONE_NOTONE_ERROR.equals(code)) {
				header.setResultCode(Register.PHONE_NOTONE_ERROR);
				header.setResultMessage("手机已经注册");
				responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "手机已经注册", userId);
				responseData.setResponseHeader(header);
				return responseData;
			} else if (ResultCode.SUCCESS_CODE.equals(code)) {
				header.setResultCode(Register.REGISTER_SUCCESS_ID);
				header.setResultMessage("注册成功");
				String accountIdKey = UUIDUtil.genId32();
				String loginName = userParams.getUcUserParam().getUserLoginName();
				// 将账号id存到缓存中 TODO 需确认该key是否已经使用？ 
				iCacheClient.setex(accountIdKey, Register.CACHE_REGISTER_ACCOUNT_ID_TIME, userId);
				//将登录信息放到cache里面
				LoginUser autoLoginUser=new LoginUser();
				autoLoginUser.setUserId(userId);
				autoLoginUser.setUserType(userParams.getUcUserParam().getUserType());
				autoLoginUser.setUserName(loginName);
				autoLoginUser.setPassword(userParams.getUcUserParam().getUserLoginPwd());
				String uuid=UUIDUtil.genId32();
				CacheUtil.setValue(uuid, 1800, JSON.toJSONString(autoLoginUser), Constants.LoginConstant.CACHE_NAMESPACE);
				
				responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "注册成功", uuid);
				responseData.setResponseHeader(header);
			} else {
				responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_FAILURE, message, null);
			}
		} catch (Exception e) {
			LOG.error("注册失败！", e);
			responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_FAILURE, "注册失败", null);
		}
		return responseData;
	}

	
	@RequestMapping("/checkPhoneVerifyCode")
    @ResponseBody
    public ResponseData<String> checkPhoneVerifyCode(UcUserParams userParams, HttpSession session, HttpServletRequest req) {
	    ResponseData<String> responseData = null;

        try{
            ICacheClient iCacheClient = MCSClientFactory.getCacheClient(Register.CACHE_NAMESPACE);
            ResponseHeader header = new ResponseHeader();
            header.setIsSuccess(true);
            // 校验短信验证码是否失效
            String phoneAddIdenti = iCacheClient.get(Register.REGISTER_PHONE_KEY + session.getId());
            if(StringUtil.isBlank(phoneAddIdenti)){
                header.setResultCode(Register.REGISTER_SSM_OVERTIME_ERROR);
                header.setResultMessage("验证码已失效");
                responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "验证码已失效", null);
                responseData.setResponseHeader(header);
                return responseData;
            }
            String s[] = phoneAddIdenti.split(";");
            String phone = s[0];
            String vitify = s[1];
            if (!userParams.getUserMp().equals(phone)) {
                header.setResultCode(Register.REGISTER_SSM_DUMPHONE_ERROR);
                header.setResultMessage("手机与发送短信手机不一致");
                responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "手机与发送短信手机不一致", null);
                responseData.setResponseHeader(header);
                return responseData;
            }
            if (StringUtil.isBlank(vitify)) {
                header.setResultCode(Register.REGISTER_SSM_OVERTIME_ERROR);
                header.setResultMessage("验证码已失效");
                responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "验证码已失效", null);
                responseData.setResponseHeader(header);
                return responseData;
            }
            // 校验短信验证码
            if (!userParams.getPhoneVerifyCode().equals(vitify)) {
                header.setResultCode(Register.REGISTER_SSM_ERROR);
                header.setResultMessage("短信验证码错误");
                responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "短信验证码错误", null);
                responseData.setResponseHeader(header);
                return responseData;
            }else{
                header.setResultCode(Register.REGISTER_SSM_SUCCESS);
                header.setResultMessage("短信验证码验证成功");
                responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "短信验证码错误", null);
                responseData.setResponseHeader(header);
                return responseData;
            }
        }catch(Exception e){
            LOG.error("手机验证校验失败！", e);
            responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_FAILURE, "手机验证校验失败！", null);
        }
       
	    return responseData;
	}
	
	
	@RequestMapping("/checkPhone")
	@ResponseBody
	public ResponseData<String> checkPhone(UcUserParams userParams, HttpSession session, HttpServletRequest req) {
		ResponseData<String> responseData = null;
		ResponseHeader header = new ResponseHeader();
		header.setIsSuccess(true);
		try {
		    IRegisterSV iRegisterSV = DubboConsumerFactory.getService("iRegisterSV");
		    BaseResponse searchResponse = iRegisterSV.searchUserInfo(userParams);
			if (searchResponse != null) {
				if (searchResponse.getResponseHeader()!=null&&searchResponse.getResponseHeader().getResultCode().equals(Register.USERNAME_NOTONE_ERROR)) {
					header.setResultCode(Register.PHONE_NOTONE_ERROR);
					header.setResultMessage("手机已经注册");
					responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "手机已经注册", null);
					responseData.setResponseHeader(header);
				} else {
					header.setResultCode(Register.REGISTER_SUCCESS_ID);
					header.setResultMessage("成功");
					String accountIdKey = UUIDUtil.genId32();
					responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "手机校验成功", accountIdKey);
					responseData.setResponseHeader(header);
				}
			}
		} catch (Exception e) {
			LOG.error("手机校验失败！", e);
			responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_FAILURE, "手机校验失败", null);
		}
		return responseData;
	}

	
	@RequestMapping("/checkUserName")
    @ResponseBody
    public ResponseData<String> checkUserName(UcUserParams userParams, HttpSession session, HttpServletRequest req) {
        ResponseData<String> responseData = null;
        ResponseHeader header = new ResponseHeader();
        header.setIsSuccess(true);
        try {
            IRegisterSV iRegisterSV = DubboConsumerFactory.getService("iRegisterSV");
            BaseResponse searchResponse = iRegisterSV.searchUserInfo(userParams);
            if (searchResponse != null) {
                if (searchResponse.getResponseHeader()!=null&&searchResponse.getResponseHeader().getResultCode().equals(Register.USERNAME_NOTONE_ERROR)) {
                    header.setResultCode(Register.USERNAME_NOTONE_ERROR);
                    header.setResultMessage("用户名已经注册");
                    responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "用户名已经注册", null);
                    responseData.setResponseHeader(header);
                } else {
                    header.setResultCode(Register.REGISTER_SUCCESS_ID);
                    header.setResultMessage("成功");
                    String accountIdKey = UUIDUtil.genId32();
                    responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "用户名校验成功", accountIdKey);
                    responseData.setResponseHeader(header);
                }
            }
        } catch (Exception e) {
            LOG.error("用户名校验失败！", e);
            responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_FAILURE, "用户名校验失败", null);
        }
        return responseData;
    }
	
	@RequestMapping("/checkEmail")
	@ResponseBody
	public ResponseData<String> checkEmail(SearchUserRequest request, HttpSession session) {
		ResponseData<String> responseData = null;
		ResponseHeader header = new ResponseHeader();
		header.setIsSuccess(true);
		try {
		    IUcUserSV iAccountManageSV = DubboConsumerFactory.getService("iUcUserSV");
            SearchUserRequest accountReq = new SearchUserRequest();
            accountReq.setUserEmail(request.getUserEmail());
            SearchUserResponse accountQueryResponse = iAccountManageSV.queryByEmail(accountReq);
			if (accountQueryResponse != null) {
				if (accountQueryResponse.getResponseHeader().getResultCode().equals(ResultCodeConstants.SUCCESS_CODE)) {
					header.setResultCode(Register.EMAIL_NOTONE_ERROR);
					header.setResultMessage("邮箱已经注册");
					responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "邮箱已经注册", null);
					responseData.setResponseHeader(header);
					return responseData;
				} else {
					header.setResultCode(Register.BAND_EMAIL_SUCCESS_ID);
					header.setResultMessage("邮箱校验成功");
					responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "邮箱校验成功", null);
					responseData.setResponseHeader(header);
				}
			}

		} catch (Exception e) {
			LOG.error("邮箱校验失败！", e);
			responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_FAILURE, "邮箱校验失败", null);
		}
		return responseData;
	}

	/**
	 * 绑定email
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping("/bindEmail")
	@ResponseBody
	public ResponseData<String> bindEmail(UpdateEmailReq request, HttpSession session) {
		ResponseData<String> responseData = null;

		try {
			// 校验验证码是否正确
			String inputIdentify = request.getIdentifyCode();
			// 获取缓存中的验证码
			ICacheClient iCacheClient = MCSClientFactory.getCacheClient(Register.CACHE_NAMESPACE);
			String emailAddidentify = iCacheClient.get(Constants.Register.REGISTER_EMAIL_KEY + session.getId());
			ResponseHeader header = new ResponseHeader();
            header.setIsSuccess(false);
			if(StringUtil.isBlank(emailAddidentify)){
			 // 跳转到注册页面
                header.setResultCode(Register.UUID_INVIAL_ERROR);
                header.setResultMessage("uuid失效");
                responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "uuid失效", null);
                responseData.setResponseHeader(header);
                return responseData;
			}else{
			    String emialIden[] = emailAddidentify.split(";");
	            String email = emialIden[0];
	            String identify = emialIden[1];
	            
	            if (!request.getEmail().equals(email)) {
	                header.setResultCode(Register.REGISTER_EMAIL_NOTSAME_ERROR);
	                header.setResultMessage("发送邮箱与验证邮箱不一致");
	                responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "发送邮箱与验证邮箱不一致", null);
	                responseData.setResponseHeader(header);
	                return responseData;
	            }
	            // 校验邮箱验证码是否失效
	            if (StringUtil.isBlank(identify)) {
	                header.setResultCode(Register.REGISTER_EMAIL_OVERTIME_ERROR);
	                header.setResultMessage("邮箱验证码失效");
	                responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "邮箱验证码失效", null);
	                responseData.setResponseHeader(header);
	                return responseData;
	            }
	            // 校验邮箱验证码是否正确
	            if (!inputIdentify.equals(identify)) {
	                header.setResultCode(Register.REGISTER_EMAIL_ERROR);
	                header.setResultMessage("邮箱验证码错误");
	                responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "验证码不正确", null);
	                responseData.setResponseHeader(header);
	                return responseData;
	            }
			}
			
			IUcUserSecurityManageSV iUcUserSecurityManageSV = DubboConsumerFactory.getService("iUcUserSecurityManageSV");
			UcUserEmailRequest req = new UcUserEmailRequest();
			// 从缓存获取账号ID
			String id = iCacheClient.get(request.getAccountIdKey());

			if (StringUtil.isBlank(id)) {
				// 跳转到注册页面
				header.setResultCode(Register.UUID_INVIAL_ERROR);
				header.setResultMessage("uuid失效");
				responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "uuid失效", null);
				responseData.setResponseHeader(header);
				return responseData;
			} else {
				long accountId = Long.parseLong(id);
				req.setAccountId(accountId);
				req.setEmail(request.getEmail());
				req.setUpdateAccountId(accountId);
				BaseResponse baseInfo = iUcUserSecurityManageSV.setEmailData(req);
				String resultCode = baseInfo.getResponseHeader().getResultCode();
				String resultMessage = baseInfo.getResponseHeader().getResultMessage();
				if (Register.EMAIL_NOTONE_ERROR.equals(resultCode)) {
					header.setResultCode(Register.EMAIL_NOTONE_ERROR);
					header.setResultMessage("邮箱已经注册");
					responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "邮箱已经注册", null);
					responseData.setResponseHeader(header);
					return responseData;
				} else if (ResultCode.SUCCESS_CODE.equals(resultCode)) {
					header.setResultCode(Register.BAND_EMAIL_SUCCESS_ID);
					header.setResultMessage("绑定邮箱成功");
					responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "绑定邮箱成功", null);
					responseData.setResponseHeader(header);
				} else {
					responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_FAILURE, resultMessage, null);
				}
			}

		} catch (Exception e) {
			LOG.error("绑定邮箱失败！", e);
			responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_FAILURE, "绑定邮箱失败", null);
		}

		return responseData;
	}

	/**
	 * 发送email
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping("/toSendEmail")
	@ResponseBody
	public ResponseData<String> sendEmail(SearchUserRequest userRequest, HttpServletRequest request) {
		ResponseData<String> responseData = null;
		try {
			ICacheClient iCacheClient = MCSClientFactory.getCacheClient(Register.CACHE_NAMESPACE);
			IConfigClient defaultConfigClient = CCSClientFactory.getDefaultConfigClient();
			IUcUserSV iUserSV = DubboConsumerFactory.getService("iUcUserSV");
			SearchUserRequest req = new SearchUserRequest();
			String email = userRequest.getUserEmail();
			// 获取账号key
			String accountid = iCacheClient.get(userRequest.getUserId());
			if (StringUtil.isBlank(accountid)) {
				// 跳转到注册页面
				ResponseHeader header = new ResponseHeader();
				header.setIsSuccess(false);
				header.setResultCode(Register.UUID_INVIAL_ERROR);
				header.setResultMessage("uuid失效");
				responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "uuid失效", null);
				responseData.setResponseHeader(header);
				return responseData;
			} else {
				// 检查ip发送次数
				ResponseData<String> checkIpSendEmail = VerifyUtil.checkIPSendEmailCount(Register.CACHE_NAMESPACE, IPUtil.getIp(request)
						+ Register.CACHE_KEY_IP_SEND_EMAIL_NUM);
				if (!checkIpSendEmail.getResponseHeader().isSuccess()) {
					return checkIpSendEmail;
				}
				// 获取短信发送次数
				String emailtimes = "1";
				String emailskey = Register.SEND_EMAIL_TIMES_KEY + userRequest.getUserEmail() + request.getSession().getId();
				String times = iCacheClient.get(emailskey);
				if (StringUtil.isBlank(times)) {
					req.setUserId(accountid);
					SearchUserResponse response = iUserSV.queryBaseInfo(req);
					String nickName = Constants.Register.REGISTER_EMAIL_NICK + response.getUserNickname();
					String identifyCode = RandomUtil.randomNum(EmailVerifyConstants.VERIFY_SIZE);
					String[] tomails = new String[] { email };
					// 超时时间
					String overTimeStr = defaultConfigClient.get(EmailVerifyConstants.VERIFY_OVERTIME_KEY);
					String overTime = ObjectUtils.toString(Integer.valueOf(overTimeStr) / 60);
					String[] data = new String[] { nickName, identifyCode, overTime };
					SendEmailRequest emailRequest = new SendEmailRequest();
					emailRequest.setSubject(EmailVerifyConstants.EMAIL_SUBJECT);
					emailRequest.setTemplateRUL(Register.TEMPLATE_EMAIL_URL);
					emailRequest.setTomails(tomails);
					emailRequest.setData(data);
					VerifyUtil.sendEmail(emailRequest);
					// 存邮箱和验证码到缓存
					String emailAddIdentify = userRequest.getUserEmail() + ";" + identifyCode;
					String key = Register.REGISTER_EMAIL_KEY + request.getSession().getId();
					iCacheClient.setex(key, Integer.valueOf(overTimeStr), emailAddIdentify);
					// 存发送次数到缓存
					String maxTimeStr = defaultConfigClient.get(EmailVerifyConstants.SEND_VERIFY_MAX_TIME_KEY);
					iCacheClient.setex(emailskey, Integer.valueOf(maxTimeStr), emailtimes);

					ResponseHeader header = new ResponseHeader();
					header.setIsSuccess(true);
					header.setResultCode(ResultCode.SUCCESS_CODE);
					header.setResultMessage("验证码获取成功");
					responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "验证码获取成功", key);
					responseData.setResponseHeader(header);
				} else {
					ResponseHeader header = new ResponseHeader();
					header.setIsSuccess(false);
					header.setResultCode(Register.CACHE_EM_TIMES_ERROR_CODE);
					header.setResultMessage("超过1分钟后，可重复发送");
					responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "超过1分钟后，可重复发送", null);
					responseData.setResponseHeader(header);
					return responseData;
				}
			}
		} catch (Exception e) {
			LOG.error("验证码获取失败！", e);
			responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_FAILURE, "验证码获取失败", null);
		}
		return responseData;
	}

	/**
	 * 获取验证码
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping("/getImageVerifyCode")
	public void getImageVerifyCode(HttpServletRequest request, HttpServletResponse response) {
		String cacheKey = Register.CACHE_KEY_VERIFY_PICTURE + request.getSession().getId();
		BufferedImage image = VerifyUtil.getImageVerifyCode(Register.CACHE_NAMESPACE, cacheKey, 100, 38);
		try {
			ImageIO.write(image, "PNG", response.getOutputStream());
		} catch (IOException e) {
			LOG.error("生成图片验证码错误：" + e);
			e.printStackTrace();
		}
	}

	/**
	 * 发送短信
	 * 
	 * @param request
	 * @return
	 * @throws Exception
	 * @throws CallerException
	 */
	@RequestMapping("/toSendPhone")
	@ResponseBody
	public ResponseData<String> sendPhone(GetSMDataReq sMDataReq, HttpServletRequest request) throws BusinessException, Exception {
		ResponseData<String> responseData = null;
		try {
			// 检查ip发送次数
			ResponseData<String> checkIpSendPhone = VerifyUtil.checkIPSendPhoneCount(Register.CACHE_NAMESPACE, IPUtil.getIp(request)
					+ Register.CACHE_KEY_IP_SEND_PHONE_NUM);
			if (!checkIpSendPhone.getResponseHeader().isSuccess()) {
				return checkIpSendPhone;
			}
			// 获取短信发送次数
			String smstimes = "1";
			// int iptimes = 1;
			String smskey = SMSUtil.CACHE_KEY_SMS_REGISTER + sMDataReq.getPhone() + request.getSession().getId();
			// String ipkey =
			// SMSUtil.CACHE_KEY_SMS_IP_REGISTER+IPUtil.getIp(request);
			// 获取ip发送次数
			// String maxTimes =
			// ConfigCenterFactory.getConfigCenterClient().get(PhoneVerifyConstants.SEND_VERIFY_IP_MAX_NO_KEY);
			ICacheClient cacheClient = MCSClientFactory.getCacheClient(Register.CACHE_NAMESPACE);
			IConfigClient defaultConfigClient = CCSClientFactory.getDefaultConfigClient();
			String times = cacheClient.get(smskey);
			// String realIpTimes = cacheClient.get(ipkey);
			if (StringUtil.isBlank(times)) {
				SMDataInfoNotify smData = new SMDataInfoNotify();
				smData.setTenantId(request.getSession().getId());
				smData.setSystemId(Constants.SYSTEM_ID);
				smData.setMsgSeq(VerifyUtil.createPhoneMsgSeq());
				List<SMData> dataList = new ArrayList<SMData>();
				SMData data = new SMData();
				data.setPhone(sMDataReq.getPhone());
				data.setServiceType(PhoneVerifyConstants.SERVICE_TYPE);
				data.setTemplateId(PhoneVerifyConstants.TEMPLATE_REGISTER_ID);
				String identifyCode = RandomUtil.randomNum(PhoneVerifyConstants.VERIFY_SIZE);
				String codeContent = "${VERIFY}:" + identifyCode;
				String overTimeStr = defaultConfigClient.get(PhoneVerifyConstants.VERIFY_OVERTIME_KEY);
				String timeContent = "^${VALIDMINS}:" + Integer.valueOf(overTimeStr) / 60;
				data.setGsmContent(codeContent + timeContent);
				dataList.add(data);
				smData.setDataList(dataList);
				SMSServices sMSServices = DubboConsumerFactory.getService("sMSServices");
				sMSServices.dataInput(smData);
				// 存手机和验证码到缓存
				String phoneAddIdentufy = sMDataReq.getPhone() + ";" + identifyCode;
				String key = Register.REGISTER_PHONE_KEY + request.getSession().getId();
				ICacheClient iCacheClient = MCSClientFactory.getCacheClient(Register.CACHE_NAMESPACE);
				iCacheClient.setex(key, Integer.valueOf(overTimeStr), phoneAddIdentufy);
				// 存发送次数到缓存
				String maxTimeStr = defaultConfigClient.get(PhoneVerifyConstants.SEND_VERIFY_MAX_TIME_KEY);
				iCacheClient.setex(smskey, Integer.valueOf(maxTimeStr), smstimes);
				// 存ip发送次数到缓存
				// if(!StringUtil.isBlank(realIpTimes)){
				// iptimes = Integer.parseInt(realIpTimes)+1;
				// }
				// iCacheClient.setex(ipkey, Integer.parseInt(maxTimes),
				// String.valueOf(iptimes));
				ResponseHeader header = new ResponseHeader();
				header.setIsSuccess(true);
				header.setResultCode(SMSUtil.CACHE_SMS_SUCCESS_CODE);
				responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "验证码获取成功", null);
				responseData.setResponseHeader(header);
			} else {
				ResponseHeader header = new ResponseHeader();
				header.setIsSuccess(false);
				header.setResultCode(SMSUtil.CACHE_SMS_ERROR_CODE);
				header.setResultMessage("超过1分钟后，可重复发送");
				responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "超过1分钟后，可重复发送", null);
				responseData.setResponseHeader(header);
				return responseData;
			}
			// if(!StringUtil.isBlank(realIpTimes)){
			// int realTimes = Integer.parseInt(realIpTimes);
			// int max = Integer.parseInt(maxTimes);
			// if(realTimes>max){
			// ResponseHeader header = new ResponseHeader();
			// header.setIsSuccess(false);
			// header.setResultCode(SMSUtil.CACHE_SMS_IP_ERROR_CODE);
			// header.setResultMessage("ip地址超出发送次数");
			// responseData = new
			// ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS,
			// "ip地址超出发送次数", null);
			// responseData.setResponseHeader(header);
			// return responseData;
			// }
			// }else{
			// ResponseHeader header = new ResponseHeader();
			// header.setIsSuccess(true);
			// header.setResultCode(SMSUtil.CACHE_SMS_SUCCESS_CODE);
			// responseData = new
			// ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "验证码获取成功",
			// null);
			// responseData.setResponseHeader(header);
			// }
		} catch (Exception e) {
			LOG.error("验证码获取失败！", e);
			responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_FAILURE, "验证码获取失败", null);
		}
		return responseData;
	}

	@RequestMapping("/login")
	@ResponseBody
	public ResponseData<String> autoLogin(@RequestParam(value = "accountIdKey", required = false) String accountIdKey, HttpServletRequest request, HttpServletResponse response) {
		ICacheClient iCacheClient = MCSClientFactory.getCacheClient(Register.CACHE_NAMESPACE);
		IConfigClient defaultConfigClient = CCSClientFactory.getDefaultConfigClient();
		ResponseData<String> responseData = null;
		try{
		 // 获取accountkey
	        String accountId = iCacheClient.get(accountIdKey);
	        String service_url = "";
	        String newuuid ="";
	        if (StringUtil.isBlank(accountId)) {
	            // 跳转到登录页面
	            service_url = SSOClientUtil.getCasServerLoginUrlRuntime(request);
	        } else {
	           /* IAccountManageSV iAccountManageSV = DubboConsumerFactory.getService("iAccountManageSV");
	            LoginRequest accountRequest = new LoginRequest();
	            accountRequest.setAccountId(Long.valueOf(accountId));
	            AccountQueryResponse account = iAccountManageSV.queryBaseInfo(accountRequest);
	            ILoginSV iloginSV = DubboConsumerFactory.getService("iLoginSV");
	            UserLoginResponse logaccout = iloginSV.queryAccountByUserName(account.getPhone());
	            // String uuid = request.getParameter(Constants.UUID.KEY_NAME);
	            // 删除缓存
	            CacheUtil.deletCache(accountIdKey, Register.CACHE_NAMESPACE);
	            String phone = account.getPhone();
	            String accountPassword = logaccout.getAccountPassword();
	            LoginUser loginUser = new LoginUser(phone, accountPassword);
	            newuuid = UUIDUtil.genId32();
	            CacheUtil.setValue(newuuid, Constants.UUID.OVERTIME, loginUser, Constants.LoginConstant.CACHE_NAMESPACE);
	            // localhost:8080/uac/registerLogin?k=UUID&service=URL
	            // 从配置中心读取跳转地址
	            service_url = defaultConfigClient.get(Constants.URLConstant.INDEX_URL_KEY);*/
	        }
	        String url = "/registerLogin?" + Constants.UUID.KEY_NAME + "=" + newuuid + "&service=" + service_url;
	         responseData = new ResponseData<String>(ResponseData.AJAX_STATUS_SUCCESS, "成功，跳转", url);
	        ResponseHeader responseHeader = new ResponseHeader(true, Constants.RetakePassword.SUCCESS_CODE, null);
	        responseData.setResponseHeader(responseHeader);
	       
		}catch(Exception e){
		    LOG.error("跳转登录错误：" + e);
		}
		 return responseData;
	}
}
