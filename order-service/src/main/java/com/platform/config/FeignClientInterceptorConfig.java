package com.platform.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class FeignClientInterceptorConfig implements RequestInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(FeignClientInterceptorConfig.class);

    @Override
    public void apply(RequestTemplate template) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String authorization = request.getHeader("Authorization");
            if (authorization != null && !authorization.isEmpty()) {
                logger.debug("[FeignClientInterceptor] Forwarding Authorization header: {}", authorization);
                template.header("Authorization", authorization);
            } else {
                logger.debug("[FeignClientInterceptor] No Authorization header found to forward.");
            }
        } else {
            logger.debug("[FeignClientInterceptor] No ServletRequestAttributes found.");
        }
    }
} 