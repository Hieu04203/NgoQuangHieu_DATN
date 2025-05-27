package com.example.CarrerLink_backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class JobDetailsDTO {
    private Long id;
    private String title;
    private String description;
    private String company;
    private String location;
    private String salaryRange;
    private LocalDate deadline;

    // Getters & Setters
}

