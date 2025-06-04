package com.example.CarrerLink_backend.service.impl;

import com.amazonaws.services.s3.AmazonS3;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.CarrerLink_backend.dto.*;
import com.example.CarrerLink_backend.dto.request.ApplyJobRequestDTO;
import com.example.CarrerLink_backend.dto.request.StudentSaveRequestDTO;
import com.example.CarrerLink_backend.dto.request.StudentUpdateRequestDTO;
import com.example.CarrerLink_backend.dto.response.ApplyJobResponseDTO;
import com.example.CarrerLink_backend.dto.response.JobgetResponseDTO;
import com.example.CarrerLink_backend.dto.response.StudentgetResponseDTO;
import com.example.CarrerLink_backend.entity.*;
import com.example.CarrerLink_backend.repo.*;
import com.example.CarrerLink_backend.repo.AcademicCourseRepo;
import com.example.CarrerLink_backend.repo.JobFieldRepo;
import com.example.CarrerLink_backend.repo.JobRepo;
import com.example.CarrerLink_backend.repo.StudentRepo;
import com.example.CarrerLink_backend.repo.TechnologyRepo;
import com.example.CarrerLink_backend.service.AdminService;
import com.example.CarrerLink_backend.service.SkillAnalysisService;
import com.example.CarrerLink_backend.service.StudentService;
import com.example.CarrerLink_backend.utill.CommonFileSaveBinaryDataDto;
import com.example.CarrerLink_backend.utill.FileExtractor;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.SQLException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    @Value("${aws.s3.bucket-name}")
    private String bucketName;
    private final ModelMapper modelMapper;
    private final StudentRepo studentRepo;
    private final TechnologyRepo technologyRepo;
    private final JobRepo jobRepo;
    private final JobFieldRepo jobFieldRepo;
    private final StudentJobsRepo studentJobsRepo;
    private final SkillAnalysisService skillAnalysisService;
    private final AmazonS3 amazonS3;
    private static final String ACTION_1 = " not found. ";
    private final AcademicCourseRepo academicCourseRepo;
    private final CVRepo cvRepo;
    private final FileExtractor fileExtractor;

    private final FileServiceImpl fileService;
    private final ProfileImageRepo profileImageRepo;
    private final JobRecommendationServiceImpl jobRecommendationService;

    private SimpMessagingTemplate messagingTemplate;
    private final Cloudinary cloudinary;

    public String saveStudent(StudentSaveRequestDTO studentSaveRequestDTO, UserEntity user, MultipartFile imageFile)
            throws IOException {
        Student student = modelMapper.map(studentSaveRequestDTO, Student.class);
        student.setUser(user);

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = uploadImageToCloudinary(imageFile);
            student.setProfilePicUrl(imageUrl);
        }

        CV cv = new CV();
        cv.setStudent(student);
        student.setCv(cv);

        saveJobFields(studentSaveRequestDTO, student);
        saveTechnologies(studentSaveRequestDTO, student);
        saveAcedemicResults(studentSaveRequestDTO, student);

        Student savedStudent = studentRepo.save(student);

        skillAnalysisService.saveSkillsFromAcedemicResults(savedStudent);

        return "Student saved successfully with ID: " + savedStudent.getStudentId();
    }

    public void saveJobFields(StudentSaveRequestDTO dto, Student student) {
        if (dto.getJobFields() != null) {
            List<JobField> newJobFields = new ArrayList<>();
            for (JobFieldDTO jobFieldDto : dto.getJobFields()) {
                JobField jobField = jobFieldRepo.findByJobField(jobFieldDto.getJobField())
                        .orElseThrow(() -> new RuntimeException("JobField not found: " + jobFieldDto.getJobField()));
                newJobFields.add(jobField);
            }
            student.setJobsFields(newJobFields); // Replace the entire list
        }
    }

    public void saveTechnologies(StudentSaveRequestDTO dto, Student student) {
        if (dto.getTechnologies() != null) {
            List<Technology> newTechnologies = new ArrayList<>();
            for (TechnologyDTO techDto : dto.getTechnologies()) {
                Technology tech = technologyRepo.findByTechName(techDto.getTechName())
                        .orElseThrow(() -> new RuntimeException("Technology not found: " + techDto.getTechName()));
                newTechnologies.add(tech);
            }
            student.setTechnologies(newTechnologies); // Replace the entire list
        }
    }

    @Override
    public String updateStudent(StudentUpdateRequestDTO studentUpdateRequestDTO, MultipartFile imageFile)
            throws IOException {
        Student existingStudent = studentRepo.findById(studentUpdateRequestDTO.getStudentId())
                .orElseThrow(() -> new RuntimeException(
                        "Student with ID " + studentUpdateRequestDTO.getStudentId() + " not found"));

        // Cập nhật các trường
        existingStudent.setFirstName(studentUpdateRequestDTO.getFirstName());
        existingStudent.setLastName(studentUpdateRequestDTO.getLastName());
        existingStudent.setEmail(studentUpdateRequestDTO.getEmail());
        existingStudent.setAddress(studentUpdateRequestDTO.getAddress());

        updateJobFields(studentUpdateRequestDTO, existingStudent);
        updateTechnologies(studentUpdateRequestDTO, existingStudent);

        // Upload ảnh nếu có
        if (imageFile != null && !imageFile.isEmpty()) {
            String profilePicUrl = uploadImageToCloudinary(imageFile);
            existingStudent.setProfilePicUrl(profilePicUrl);
        }

        studentRepo.save(existingStudent);

        return existingStudent.getProfilePicUrl();
    }

    private String uploadImageToCloudinary(MultipartFile file) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("folder", "students"));
        return uploadResult.get("secure_url").toString();
    }

    public String uploadImageAndGetUrl(MultipartFile file) {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get("uploads/images/");
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/images/" + fileName; // URL mà frontend có thể gọi
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public String saveImgFile(int userId, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is empty or null");
        }

        // Thư mục lưu file vật lý
        String uploadDir = "D:/Test/NgoQuangHieu_DATN/Picture";
        File uploadPath = new File(uploadDir);
        if (!uploadPath.exists()) {
            uploadPath.mkdirs();
        }

        // Tạo tên file mới tránh trùng
        String newFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        // File đích lưu trên đĩa
        File destination = new File(uploadPath, newFileName);

        // Lưu file vật lý
        file.transferTo(destination);

        // URL để frontend gọi ảnh (mapping static resource)
        String relativeUrl = "/images/student-profile-pics/" + newFileName;

        // Cập nhật hoặc tạo mới ProfileImage
        Student student = studentRepo.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Student not found for user ID: " + userId));

        ProfileImage profileImage = profileImageRepo.findByUserId(userId)
                .orElse(new ProfileImage());

        if (profileImage.getId() == null) {
            profileImage.setId(UUID.randomUUID().toString());
        }
        profileImage.setUrl(relativeUrl);
        profileImage.setFileName(file.getOriginalFilename());
        profileImage.setUser(student.getUser());

        profileImageRepo.save(profileImage);

        return relativeUrl;
    }

    @Override
    @Transactional
    public void deleteStudent(int id) {
        if (!studentRepo.existsById(id)) {
            throw new RuntimeException("student with ID " + id + ACTION_1);
        }
        studentRepo.deleteById(id);
    }

    public void saveAcedemicResults(StudentSaveRequestDTO studentSaveRequestDTO, Student student) {
        if (studentSaveRequestDTO.getAcedemicResults() != null) {
            for (AcedemicResults acedemicResults : student.getAcedemicResults()) {
                acedemicResults.setStudents(student);

            }
        }
    }

    public void updateTechnologies(StudentUpdateRequestDTO dto, Student student) {
        if (dto.getTechnologies() != null) {
            List<Technology> newTechnologies = new ArrayList<>();
            for (TechnologyDTO techDto : dto.getTechnologies()) {
                Technology tech = technologyRepo.findByTechName(techDto.getTechName())
                        .orElseThrow(() -> new RuntimeException("Technology not found: " + techDto.getTechName()));
                newTechnologies.add(tech);
            }
            student.setTechnologies(newTechnologies); // Replace the entire list
        }
    }

    public void updateJobFields(StudentUpdateRequestDTO dto, Student student) {
        if (dto.getJobsFields() != null) {
            List<JobField> newJobFields = new ArrayList<>();
            for (JobFieldDTO jobFieldDto : dto.getJobsFields()) {
                JobField jobField = jobFieldRepo.findByJobField(jobFieldDto.getJobField())
                        .orElseThrow(() -> new RuntimeException("JobField not found: " + jobFieldDto.getJobField()));
                newJobFields.add(jobField);
            }
            student.setJobsFields(newJobFields); // Replace the entire list
        }
    }

    @Override
    public String applyJob(ApplyJobRequestDTO applyJobRequestDTO) {
        int studentId = applyJobRequestDTO.getStudentId();
        int jobId = applyJobRequestDTO.getJobId();

        System.out.println("Applying job - Request: studentId=" + studentId + ", jobId=" + jobId);

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with studentId: " + studentId));

        System.out.println("Found student with studentId: " + student.getStudentId());

        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with jobId: " + jobId));

        System.out.println("Found job: " + job.getJobTitle());

        // Check if student already applied
        if (studentJobsRepo.existsByStudentAndJob(student, job)) {
            System.out.println("Student " + student.getStudentId() + " already applied for " + job.getJobTitle());
            return "Student " + student.getStudentId() + " already applied for " + job.getJobTitle();
        }

        StudentJobs studentJobs = new StudentJobs();
        studentJobs.setStudent(student);
        studentJobs.setJob(job);
        studentJobs.setStatus(false); // Set initial status as not approved
        StudentJobs savedStudentJobs = studentJobsRepo.save(studentJobs);

        System.out.println("Successfully saved application: studentId=" + savedStudentJobs.getStudent().getStudentId()
                + ", jobId=" + savedStudentJobs.getJob().getJobId());

        return "Student with ID: " + studentId + " applied for job with ID: " + jobId;
    }

    @Override
    public List<ApplyJobResponseDTO> getJobByStudent(int studentId) {
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<StudentJobs> studentJobs = studentJobsRepo.findByStudent(student);
        List<ApplyJobResponseDTO> applyJobResponseDTOS = new ArrayList<>();
        for (StudentJobs studentJobs1 : studentJobs) {
            ApplyJobResponseDTO applyJobResponseDTO = new ApplyJobResponseDTO();
            applyJobResponseDTO.setJobId(studentJobs1.getJob().getJobId());
            applyJobResponseDTO.setJobTitle(studentJobs1.getJob().getJobTitle());
            applyJobResponseDTOS.add(applyJobResponseDTO);
        }

        return applyJobResponseDTOS;

    }

    @Override
    public StudentgetResponseDTO getStudentById(int stId) {
        Student student = studentRepo.findById(stId).orElseThrow(() -> new RuntimeException("Student not found"));
        return modelMapper.map(student, StudentgetResponseDTO.class);
    }

    @Override
    public StudentgetResponseDTO getStudentByUserName(String userName) {
        Student student = studentRepo.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return modelMapper.map(student, StudentgetResponseDTO.class);
    }

    @Override
    public StudentgetResponseDTO getStudentByUserId(int userId) {
        // Fetch student by user ID
        Student student = studentRepo.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Map the student entity to the response DTO
        StudentgetResponseDTO responseDTO = modelMapper.map(student, StudentgetResponseDTO.class);

        // Set the profile image URL directly from student entity
        responseDTO.setProfileImageUrl(student.getProfilePicUrl());

        return responseDTO;
    }

    @Override
    public String approveStudent(int studentId) {

        Student student = studentRepo.findById(studentId).orElseThrow(
                () -> new RuntimeException("Student not found with ID: " + studentId));
        student.setApproved(true);
        studentRepo.save(student);
        return "Student with ID: " + studentId + " approved successfully";
    }

    @Override
    public List<StudentgetResponseDTO> getAllStudents() {
        return studentRepo.findAll().stream()
                .map(student -> modelMapper.map(student, StudentgetResponseDTO.class))
                .toList();
    }

    public Optional<String> getUrlByUserId(int userId) {
        return profileImageRepo.findUrlByUserId(userId);
    }

    public List<TechnologyDTO> getTechnologiesByStudentId(int studentId) {
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Technology> technologies = student.getTechnologies();
        List<TechnologyDTO> technologyDTOS = new ArrayList<>();
        for (Technology technology : technologies) {
            TechnologyDTO technologyDTO = modelMapper.map(technology, TechnologyDTO.class);
            technologyDTOS.add(technologyDTO);
        }

        return technologyDTOS;
    }

}
