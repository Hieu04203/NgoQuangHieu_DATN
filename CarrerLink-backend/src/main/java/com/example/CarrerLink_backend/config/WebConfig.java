package com.example.CarrerLink_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // ánh xạ URL /images/student-profile-pics/** tới folder vật lý
        registry.addResourceHandler("/images/student-profile-pics/**")
                .addResourceLocations("file:///D:/Test/NgoQuangHieu_DATN/Picture/");
    }
}


