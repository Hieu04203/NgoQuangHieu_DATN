package com.example.CarrerLink_backend.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.example.CarrerLink_backend.entity.Job;
import com.example.CarrerLink_backend.dto.response.JobgetResponseDTO;

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        // Add explicit mapping for Job to JobgetResponseDTO
        modelMapper.addMappings(new PropertyMap<Job, JobgetResponseDTO>() {
            @Override
            protected void configure() {
                // Map companyPicUrl from Company's companyPicUrl (not coverPicUrl)
                map().setCompanyPicUrl(source.getCompany().getCompanyPicUrl());
            }
        });

        return modelMapper;
    }
}
