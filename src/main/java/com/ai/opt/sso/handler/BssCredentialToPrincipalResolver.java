package com.ai.opt.sso.handler;

import java.util.HashMap;
import java.util.Map;

import org.jasig.cas.authentication.Credential;
import org.jasig.cas.authentication.principal.Principal;
import org.jasig.cas.authentication.principal.PrincipalResolver;
import org.jasig.cas.authentication.principal.SimplePrincipal;

import com.ai.opt.sso.principal.BssCredentials;

public class BssCredentialToPrincipalResolver implements PrincipalResolver {

	public BssCredentialToPrincipalResolver() {}

	@Override
	public final Principal resolve(Credential credential) {
		BssCredentials bssCredentials = (BssCredentials) credential;

		String principalId = bssCredentials.getUsername();
		
		Map<String, Object> attributes = new HashMap<String, Object>();
		attributes.put("tenantId", bssCredentials.getTenantId());
		attributes.put("userId", bssCredentials.getUserId());
		attributes.put("username", bssCredentials.getUsername());
        attributes.put("userType", bssCredentials.getUserType());
        attributes.put("userNickname",bssCredentials.getUserNickname());
        attributes.put("userMp",bssCredentials.getUserMp());
        
		return new SimplePrincipal(principalId , attributes);
	}

	@Override
	public boolean supports(Credential paramCredential) {
		return paramCredential!=null&&BssCredentials.class.isAssignableFrom(paramCredential.getClass());
	}

}
