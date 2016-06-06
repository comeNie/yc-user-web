package com.ai.opt.sso.constants;

import java.io.Serializable;

public class UserLoginErrorCode implements Serializable{

    private static final long serialVersionUID = 1L;
    /**
     * 用户名不存在
     */
    public static final String USER_ERR_001 = "USER_ERR_001";
    /**
     * 邮箱未验证
     */
    public static final String USER_ERR_002 = "USER_ERR_002";
    /**
     * 手机号未绑定
     */
    public static final String USER_ERR_003 = "USER_ERR_003";
    /**
     * 请输入用户名/手机号/邮箱
     */
    public static final String USER_ERR_004 = "USER_ERR_004";
    /**
     * 验证码错误
     */
    public static final String USER_ERR_005 = "USER_ERR_005";
    
    /**
     * 密码错误
     */
    public static final String USER_ERR_006 = "USER_ERR_006";
    
    
}
