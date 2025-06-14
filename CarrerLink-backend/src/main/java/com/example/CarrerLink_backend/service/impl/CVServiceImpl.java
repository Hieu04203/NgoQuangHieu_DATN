package com.example.CarrerLink_backend.service.impl;

import com.example.CarrerLink_backend.dto.*;
import com.example.CarrerLink_backend.dto.request.CVUpdateRequestDTO;
import com.example.CarrerLink_backend.dto.response.CVgetResponseDTO;
import com.example.CarrerLink_backend.entity.*;
import com.example.CarrerLink_backend.exception.InvalidInputException;
import com.example.CarrerLink_backend.exception.ResourceNotFoundException;
import com.example.CarrerLink_backend.repo.*;
import com.example.CarrerLink_backend.service.CVService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CVServiceImpl implements CVService {

    private final CVRepo cvRepo;
    private final  ModelMapper modelMapper;
    private final StudentRepo studentRepo;
    private final CountBroadcastService broadcastService;
    private static final String ACTION_1 = " does not exist.";
    private final TechnologyRepo technologyRepo;
    private final ProjectsRepository projectsRepo;
    private final ExperienceRepository experienceRepo;
    private final EducationRepository educationRepo;
    private final CertificationRepository certificationRepo;

    @Override
    @Transactional
    public String updateCV(int studentId, CVUpdateRequestDTO cvUpdateRequestDTO) {
        if (studentId == 0) {
            throw new InvalidInputException("Student ID is required for an update.");
        }
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));
        CV existingCV = student.getCv();
        if (existingCV == null) {
            throw new ResourceNotFoundException("CV not found for student ID: " + studentId);
        }

        // Update basic information
        existingCV.setName(cvUpdateRequestDTO.getName());
        existingCV.setTitle(cvUpdateRequestDTO.getTitle());
        existingCV.setMobile(cvUpdateRequestDTO.getMobile());
        existingCV.setAddress(cvUpdateRequestDTO.getAddress());
        existingCV.setEmail(cvUpdateRequestDTO.getEmail());
        existingCV.setGithubLink(cvUpdateRequestDTO.getGithubLink());
        existingCV.setLinkedinLink(cvUpdateRequestDTO.getLinkedinLink());
        existingCV.setSummary(cvUpdateRequestDTO.getSummary());
        existingCV.setExperience(cvUpdateRequestDTO.getExperience());
        existingCV.setAdditionalInfo(cvUpdateRequestDTO.getAdditionalInfo());
        existingCV.setBio(cvUpdateRequestDTO.getBio());
        existingCV.setReferee(cvUpdateRequestDTO.getReferee());
        existingCV.setRefereeEmail(cvUpdateRequestDTO.getRefereeEmail());

        // Xóa tất cả dữ liệu cũ
        technologyRepo.deleteAllByCvId(existingCV.getId());
        projectsRepo.deleteAllByCvId(existingCV.getId());
        experienceRepo.deleteAllByCvId(existingCV.getId());
        educationRepo.deleteAllByCvId(existingCV.getId());
        certificationRepo.deleteAllByCvId(existingCV.getId());

        // Process Technical Skills
        if (cvUpdateRequestDTO.getSkills() != null && !cvUpdateRequestDTO.getSkills().isEmpty()) {
            List<TechnicalSkills> technicalSkills = new ArrayList<>();
            for (TechnicalSkillDTO techDto : cvUpdateRequestDTO.getSkills()) {
                TechnicalSkills tech = new TechnicalSkills();
                tech.setTechSkill(techDto.getTechSkill());
                tech.setCategory(techDto.getCategory());
                tech.setCv(existingCV);
                technicalSkills.add(tech);
            }
            existingCV.setSkills(technicalSkills);
        } else {
            existingCV.setSkills(new ArrayList<>());
        }

        // Process Projects
        if (cvUpdateRequestDTO.getProjects() != null && !cvUpdateRequestDTO.getProjects().isEmpty()) {
            List<Projects> projects = new ArrayList<>();
            for (ProjectsDTO projectDTO : cvUpdateRequestDTO.getProjects()) {
                Projects project = new Projects();
                project.setProjectName(projectDTO.getProjectName());
                project.setProjectDescription(projectDTO.getProjectDescription());
                project.setGithubLink(projectDTO.getGithubLink());
                project.setCv(existingCV);
                projects.add(project);
            }
            existingCV.setProjects(projects);
        } else {
            existingCV.setProjects(new ArrayList<>());
        }

        // Process Experiences
        if (cvUpdateRequestDTO.getExperiences() != null && !cvUpdateRequestDTO.getExperiences().isEmpty()) {
            List<Experience> experiences = new ArrayList<>();
            for (ExperienceDTO expDTO : cvUpdateRequestDTO.getExperiences()) {
                Experience experience = new Experience();
                experience.setJobTitle(expDTO.getJobTitle());
                experience.setCompanyName(expDTO.getCompanyName());
                experience.setStartDate(expDTO.getStartDate());
                experience.setEndDate(expDTO.getEndDate());
                experience.setDescription(expDTO.getDescription());
                experience.setCv(existingCV);
                experiences.add(experience);
            }
            existingCV.setExperiences(experiences);
        } else {
            existingCV.setExperiences(new ArrayList<>());
        }

        // Process Educations
        if (cvUpdateRequestDTO.getEducations() != null && !cvUpdateRequestDTO.getEducations().isEmpty()) {
            List<Education> educations = new ArrayList<>();
            for (EducationDTO eduDTO : cvUpdateRequestDTO.getEducations()) {
                Education education = new Education();
                education.setDegree(eduDTO.getDegree());
                education.setInstitution(eduDTO.getInstitution());
                education.setLocation(eduDTO.getLocation());
                education.setStartDate(eduDTO.getStartDate());
                education.setEndDate(eduDTO.getEndDate());
                education.setGpa(eduDTO.getGpa());
                education.setDescription(eduDTO.getDescription());
                education.setCv(existingCV);
                educations.add(education);
            }
            existingCV.setEducations(educations);
        } else {
            existingCV.setEducations(new ArrayList<>());
        }

        // Process Certifications
        if (cvUpdateRequestDTO.getCertifications() != null && !cvUpdateRequestDTO.getCertifications().isEmpty()) {
            List<Certification> certifications = new ArrayList<>();
            for (CertificationDTO certDTO : cvUpdateRequestDTO.getCertifications()) {
                Certification certification = new Certification();
                certification.setName(certDTO.getName());
                certification.setOrganization(certDTO.getOrganization());
                certification.setIssueDate(certDTO.getIssueDate());
                certification.setCertificationLink(certDTO.getCertificationLink());
                certification.setCv(existingCV);
                certifications.add(certification);
            }
            existingCV.setCertifications(certifications);
        } else {
            existingCV.setCertifications(new ArrayList<>());
        }

        cvRepo.save(existingCV);
        return "CV updated successfully";
    }

//    @Override
//    public CVgetResponseDTO getCV(int studentId) {
//        Student student = studentRepo.findById(studentId)
//                .orElseThrow(() -> new ResourceNotFoundException("CV for student with ID " + studentId + " not found."));
//
//        CV cv = student.getCv();
//        return modelMapper.map(cv, CVgetResponseDTO.class);
//
//    }

    @Override
    public CVgetResponseDTO getCV(int studentId) {
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("CV for student with ID " + studentId + " not found."));

        CV cv = student.getCv();
        if (cv == null) {
            throw new ResourceNotFoundException("No CV found for student ID: " + studentId);
        }

        CVgetResponseDTO responseDTO = new CVgetResponseDTO();
        responseDTO.setName(cv.getName());
        responseDTO.setTitle(cv.getTitle());
        responseDTO.setMobile(cv.getMobile());
        responseDTO.setAddress(cv.getAddress());
        responseDTO.setEmail(cv.getEmail());
        responseDTO.setGithubLink(cv.getGithubLink());
        responseDTO.setLinkedinLink(cv.getLinkedinLink());

        responseDTO.setSummary(cv.getSummary());
        responseDTO.setExperience(cv.getExperience());
        responseDTO.setAdditionalInfo(cv.getAdditionalInfo());

        responseDTO.setBio(cv.getBio());
        responseDTO.setReferee(cv.getReferee());
        responseDTO.setRefereeEmail(cv.getRefereeEmail());

        // Skills
        List<TechnicalSkillDTO> skillDTOs = cv.getSkills().stream().map(skill -> {
            TechnicalSkillDTO dto = new TechnicalSkillDTO();
            dto.setTechSkill(skill.getTechSkill());
            dto.setCategory(skill.getCategory());
            return dto;
        }).collect(Collectors.toList());
        responseDTO.setSkills(skillDTOs);

        // Projects
        List<ProjectsDTO> projectDTOs = cv.getProjects().stream().map(project -> {
            ProjectsDTO dto = new ProjectsDTO();
            dto.setProjectName(project.getProjectName());
            dto.setProjectDescription(project.getProjectDescription());
            dto.setGithubLink(project.getGithubLink());
            return dto;
        }).collect(Collectors.toList());
        responseDTO.setProjects(projectDTOs);

        // Experiences
        List<ExperienceDTO> experienceDTOs = cv.getExperiences().stream().map(exp -> {
            ExperienceDTO dto = new ExperienceDTO();
            dto.setJobTitle(exp.getJobTitle());
            dto.setCompanyName(exp.getCompanyName());
            dto.setStartDate(exp.getStartDate());
            dto.setEndDate(exp.getEndDate());
            dto.setDescription(exp.getDescription());
            return dto;
        }).collect(Collectors.toList());
        responseDTO.setExperiences(experienceDTOs);

        // Educations
        List<EducationDTO> educationDTOs = cv.getEducations().stream().map(edu -> {
            EducationDTO dto = new EducationDTO();
            dto.setDegree(edu.getDegree());
            dto.setInstitution(edu.getInstitution());
            dto.setLocation(edu.getLocation());
            dto.setStartDate(edu.getStartDate());
            dto.setEndDate(edu.getEndDate());
            dto.setGpa(edu.getGpa());
            dto.setDescription(edu.getDescription());
            return dto;
        }).collect(Collectors.toList());
        responseDTO.setEducations(educationDTOs);

        // Certifications
        List<CertificationDTO> certDTOs = cv.getCertifications().stream().map(cert -> {
            CertificationDTO dto = new CertificationDTO();
            dto.setName(cert.getName());
            dto.setOrganization(cert.getOrganization());
            dto.setIssueDate(cert.getIssueDate());
            dto.setCertificationLink(cert.getCertificationLink());
            return dto;
        }).collect(Collectors.toList());
        responseDTO.setCertifications(certDTOs);

        return responseDTO;
    }


    public void updateSkillSet(CV cv,int studentId){

    }

    private void clearCollections(CV cv) {
        cv.getSkills().clear();
        cv.getProjects().clear();
        cv.getExperiences().clear();
        cv.getEducations().clear();
        cv.getCertifications().clear();
    }
}
