package com.ai.opt.sso.principal;

import org.jasig.cas.authentication.RememberMeUsernamePasswordCredential;

/**
 * BssCredentials
 *
 * Date: 2016年3月16日 <br>
 * Copyright (c) 2016 asiainfo.com <br>
 * 
 * @author gucl
 */
public class BssCredentials extends RememberMeUsernamePasswordCredential {
    private static final long serialVersionUID = -8147635836938729264L;

    /**
     * 租户Id
     */
    private String tenantId;

    /**
     * 用户类型
     */
    private String userType;

    /**
     * 用户登陆用户名
     */
    private String userLoginName;

    /**
     * 用户邮箱
     */
    private String userEmail;

    /**
     * 用户手机号
     */
    private String userMp;

    /**
     * 验证码
     */
    private String captchaCode;

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getCaptchaCode() {
        return captchaCode;
    }

    public void setCaptchaCode(String captchaCode) {
        this.captchaCode = captchaCode;
    }

    public String getUserLoginName() {
        return userLoginName;
    }

    public void setUserLoginName(String userLoginName) {
        this.userLoginName = userLoginName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserMp() {
        return userMp;
    }

    public void setUserMp(String userMp) {
        this.userMp = userMp;
    }

}
