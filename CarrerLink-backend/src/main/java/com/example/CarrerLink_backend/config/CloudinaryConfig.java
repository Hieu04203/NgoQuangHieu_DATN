package com.example.CarrerLink_backend.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dxqh3xpza");
        config.put("api_key", "159365789567286");
        config.put("api_secret", "jVbDdyDleglBDRE2UIvjKebvWSM");
        return new Cloudinary(config);
    }
}

