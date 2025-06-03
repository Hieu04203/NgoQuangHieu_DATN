package com.example.CarrerLink_backend.service.impl;

import com.example.CarrerLink_backend.dto.JobDetailsDTO;
import com.example.CarrerLink_backend.dto.TechnologyDTO;
import com.example.CarrerLink_backend.dto.response.ApplicantDetailsgetResponseDTO;
import com.example.CarrerLink_backend.dto.response.JobgetResponseDTO;
import com.example.CarrerLink_backend.dto.response.StudentgetResponseDTO;
import com.example.CarrerLink_backend.entity.*;
import com.example.CarrerLink_backend.exception.ResourceNotFoundException;
import com.example.CarrerLink_backend.repo.CompanyRepository;
import com.example.CarrerLink_backend.repo.JobRepo;
import com.example.CarrerLink_backend.repo.StudentJobsRepo;
import com.example.CarrerLink_backend.repo.TechnologyRepo;
import com.example.CarrerLink_backend.service.JobService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepo jobRepo;
    private final ModelMapper modelMapper;
    private final TechnologyRepo technologyRepo;
    private final StudentJobsRepo studentJobsRepo;
    @Autowired
    private CompanyRepository companyRepository;

    @Override
    public String saveJob(JobgetResponseDTO jobgetResponseDTO, Long companyId) {
        Job job = modelMapper.map(jobgetResponseDTO, Job.class);
        Optional<Company> company = companyRepository.findById(companyId);
        if (company.isPresent()) {
            job.setCompany(company.get()); // Setting the company to the Job entity
        } else {
            return "Company not found";
        }
        List<Technology> techs = new ArrayList<>();
        for (TechnologyDTO techdtos : jobgetResponseDTO.getTechnologies()) {
            Technology technology = technologyRepo.findByTechName(techdtos.getTechName())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Technology with name " + techdtos.getTechName() + "Not found"));
            techs.add(technology);
        }
        job.setTechnologies(techs);

        jobRepo.save(job);
        return job.getJobTitle() + "saved";

    }

    @Override
    public List<JobgetResponseDTO> getJobs(String jobType, String company) {
        List<Job> jobs;

        if ((jobType == null || jobType.isEmpty()) && (company == null || company.isEmpty())) {
            // Fetch all jobs if both parameters are null or empty
            jobs = jobRepo.findAll();
        } else if (jobType == null || jobType.isEmpty()) {
            // Fetch jobs filtered by company only
            jobs = jobRepo.findByCompanyName(company);
        } else if (company == null || company.isEmpty()) {
            // Fetch jobs filtered by jobType only
            jobs = jobRepo.findByJobType(jobType);
        } else {
            // Fetch jobs filtered by both jobType and company
            jobs = jobRepo.findByJobTypeAndCompanyNameEquals(jobType, company);
        }

        return jobs.stream()
                .map(job -> {
                    JobgetResponseDTO dto = modelMapper.map(job, JobgetResponseDTO.class);

                    // Explicitly set company name and picture URL using setter
                    dto.setCompanyName(job.getCompany().getName());
                    dto.setCompanyId(job.getCompany().getId());
                    dto.setCompanyPicUrl(job.getCompany().getCompanyPicUrl());

                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<JobgetResponseDTO> getJobs() {
        List<Job> jobs = jobRepo.findAll();
        return jobs.stream()
                .map(job -> {
                    JobgetResponseDTO dto = modelMapper.map(job, JobgetResponseDTO.class);
                    dto.setCompanyName(job.getCompany().getName());
                    dto.setCompanyId(job.getCompany().getId());
                    dto.setCompanyPicUrl(job.getCompany().getCompanyPicUrl());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public String updateJob(JobgetResponseDTO jobgetResponseDTO) {
        if (jobRepo.existsById(jobgetResponseDTO.getJobId())) {

            Job existingJob = jobRepo.findByJobId(jobgetResponseDTO.getJobId())
                    .orElseThrow(() -> new RuntimeException("Job not found"));

            existingJob.setJobTitle(jobgetResponseDTO.getJobTitle());
            existingJob.setJobType(jobgetResponseDTO.getJobType());
            existingJob.setDescription(jobgetResponseDTO.getDescription());
            existingJob.setRequirements(jobgetResponseDTO.getRequirements());
            existingJob.setRate(jobgetResponseDTO.getRate());
            existingJob.setLocation(jobgetResponseDTO.getLocation());
            existingJob.setStatus(jobgetResponseDTO.getStatus());
            List<Technology> newTechs = new ArrayList<>();
            for (TechnologyDTO techDTO : jobgetResponseDTO.getTechnologies()) {
                Technology tech = technologyRepo.findByTechName(techDTO.getTechName())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Technology with name " + techDTO.getTechName() + "Not found"));
                newTechs.add(tech);
            }
            existingJob.setTechnologies(newTechs);
            jobRepo.save(existingJob);
            return existingJob.getJobTitle() + "updated";
        } else {
            throw new RuntimeException("Job not found");
        }

    }

    @Transactional
    @Override
    public String deleteJob(int jobId) {
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        job.getTechnologies().clear(); // Xoá liên kết với Technology
        jobRepo.save(job); // Cập nhật DB

        jobRepo.delete(job); // Sau đó mới xoá job

        return "Job deleted";
    }

    @Override
    public List<JobgetResponseDTO> getAllJobByCompany(int companyId) {
        Long company = (long) companyId;
        if (companyRepository.existsById(company)) {
            Company company1 = companyRepository.findById(company)
                    .orElseThrow(() -> new RuntimeException("Company not found"));
            List<Job> jobs = jobRepo.findByCompany(company1);
            return modelMapper.map(jobs, new TypeToken<List<JobgetResponseDTO>>() {
            }.getType());
        } else {
            throw new ResourceNotFoundException("Company is not found");
        }

    }

    public String closeJob(int jobId) {
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(JobStatus.CLOSED);
        jobRepo.save(job);
        return "Job closed";
    }

    @Override
    public List<ApplicantDetailsgetResponseDTO> getAllApplicants(@RequestParam int jobId) {
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        List<StudentJobs> studentJobs = studentJobsRepo.findByJob(job);
        List<ApplicantDetailsgetResponseDTO> applicantgetResponseDTOS = new ArrayList<>();
        for (StudentJobs studentJobs1 : studentJobs) {
            ApplicantDetailsgetResponseDTO applicantDetailsgetResponseDTO = new ApplicantDetailsgetResponseDTO();
            Student student = studentJobs1.getStudent();
            applicantDetailsgetResponseDTO.setFirstName(student.getFirstName());
            applicantDetailsgetResponseDTO.setLastName(student.getLastName());
            applicantDetailsgetResponseDTO.setStudentId(student.getStudentId());
            applicantDetailsgetResponseDTO.setStatus(studentJobs1.getStatus());
            applicantDetailsgetResponseDTO.setUniversity(student.getUniversity());
            applicantDetailsgetResponseDTO.setInterviewDate(studentJobs1.getInterviewDate());

            // Try to get profile image URL from both possible sources
            if (student.getProfilePicUrl() != null) {
                applicantDetailsgetResponseDTO.setProfileImageUrl(student.getProfilePicUrl());
            } else if (student.getUser() != null && student.getUser().getProfileImage() != null) {
                applicantDetailsgetResponseDTO.setProfileImageUrl(student.getUser().getProfileImage().getUrl());
            }

            applicantgetResponseDTOS.add(applicantDetailsgetResponseDTO);
        }

        return applicantgetResponseDTOS;

    }

    @Override
    public JobgetResponseDTO getJobDetails(int jobId) {
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        JobgetResponseDTO responseDTO = new JobgetResponseDTO();
        responseDTO.setJobId(job.getJobId());
        responseDTO.setJobTitle(job.getJobTitle());
        responseDTO.setJobType(job.getJobType());
        responseDTO.setDescription(job.getDescription());
        responseDTO.setRequirements(job.getRequirements());
        responseDTO.setStatus(job.getStatus());
        responseDTO.setRate(job.getRate());
        responseDTO.setLocation(job.getLocation());
        responseDTO.setCompanyName(job.getCompany().getName());
        responseDTO.setCompanyId(job.getCompany().getId());
        responseDTO.setCompanyPicUrl(job.getCompany().getCompanyPicUrl());

        // Convert technologies (assuming job.getTechnologies() returns a list of
        // Technology entities)
        List<TechnologyDTO> techDTOs = job.getTechnologies().stream()
                .map(tech -> new TechnologyDTO(tech.getTechId(), tech.getTechName()))
                .collect(Collectors.toList());
        responseDTO.setTechnologies(techDTOs);

        return responseDTO;
    }

}
