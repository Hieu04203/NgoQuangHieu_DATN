package com.example.CarrerLink_backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.CarrerLink_backend.config.CompanyRegisteredEvent;

import com.amazonaws.services.s3.AmazonS3;

import com.example.CarrerLink_backend.dto.*;
import com.example.CarrerLink_backend.dto.request.CompanySaveRequestDTO;
import com.example.CarrerLink_backend.dto.request.CompanyUpdateRequestDTO;
import com.example.CarrerLink_backend.dto.response.ApplicantDetailsgetResponseDTO;
import com.example.CarrerLink_backend.dto.response.CompanygetResponseDTO;
import com.example.CarrerLink_backend.dto.response.JobApproveResponseDTO;
import com.example.CarrerLink_backend.entity.*;
import com.example.CarrerLink_backend.exception.DuplicateResourceException;
import com.example.CarrerLink_backend.exception.InvalidInputException;
import com.example.CarrerLink_backend.exception.OperationFailedException;
import com.example.CarrerLink_backend.exception.ResourceNotFoundException;
import com.example.CarrerLink_backend.repo.*;
import com.example.CarrerLink_backend.service.CompanyService;
import com.example.CarrerLink_backend.utill.CommonFileSaveBinaryDataDto;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import java.io.IOException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    @Value("${aws.s3.bucket-name}")
    private String bucketName;
    private final CompanyRepository companyRepository;
    private final ModelMapper modelMapper;
    private final TechnologyRepo technologyRepo;
    private final CompanyImageRepository companyImageRepository;
    private final ClientRepo clientRepo;
    private static final String ACTION_1 = " does not exist.";
    private final StudentJobsRepo studentJobsRepo;
    private final JobRepo jobRepo;
    private final StudentRepo studentRepo;
    private final AmazonS3 amazonS3;
    private final FileServiceImpl fileService;
    private final EmailService emailService;
    private final Cloudinary cloudinary;
    private final CVRepo cvRepo;
    private final CountBroadcastService broadcastService;
    private final ProjectsRepository projectsRepo;
    private final ExperienceRepository experienceRepo;
    private final EducationRepository educationRepo;
    private final CertificationRepository certificationRepo;

    // private ApplicationEventPublisher eventPublisher;
    // private SimpMessagingTemplate messagingTemplate;
    // private NotificationRepository notificationRepository;
    @Override
    public List<CompanygetResponseDTO> getCompanies(String location, String category) {
        List<Company> companies;

        if (location != null && category != null) {
            companies = companyRepository.findByLocationAndCategory(location, category);
        } else if (location != null) {
            companies = companyRepository.findByLocation(location);
        } else if (category != null) {
            companies = companyRepository.findByCategory(category);
        } else {
            companies = companyRepository.findAll();
        }
        if (companies.isEmpty()) {
            throw new RuntimeException("No companies found for the given filters.");
        }
        return modelMapper.map(companies, new TypeToken<List<CompanygetResponseDTO>>() {
        }.getType());
    }

    @Override
    public List<CompanygetResponseDTO> getAllCompanies() {
        List<Company> companies = companyRepository.findAll();
        if (companies.isEmpty()) {
            throw new ResourceNotFoundException("No companies found.");
        }
        return modelMapper.map(companies, new TypeToken<List<CompanygetResponseDTO>>() {
        }.getType());
    }

    @Override
    public List<CompanygetResponseDTO> searchCompanyByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new InvalidInputException("Company name cannot be null or empty.");
        }
        List<Company> companies = companyRepository.findByNameContainingIgnoreCase(name);
        if (companies.isEmpty()) {
            throw new ResourceNotFoundException("No companies found with the name: " + name);
        }
        return modelMapper.map(companies, new TypeToken<List<CompanygetResponseDTO>>() {
        }.getType());
    }

    public String saveCompany(CompanySaveRequestDTO dto, UserEntity user) {
        Company company = new Company();

        company.setName(dto.getName());
        company.setDescription(dto.getDescription());
        company.setCategory(dto.getCategory());
        company.setMobile(dto.getMobile());
        company.setLocation(dto.getLocation());
        company.setCoverImage(dto.getCoverImage());
        company.setEmail(dto.getEmail());
        company.setRequirements(dto.getRequirements());
        company.setWebsite(dto.getWebsite());
        company.setSize(dto.getSize());
        company.setCompanyPicUrl(dto.getCompanyPicUrl());
        company.setCoverPicUrl(dto.getCoverPicUrl());

        company.setUser(user);

        companyRepository.save(company);

        return company.getId().toString();
    }

    @Transactional
    public String updateCompany(CompanyUpdateRequestDTO dto, MultipartFile companyImage, MultipartFile coverImage)
            throws IOException {
        if (dto.getId() == null) {
            throw new InvalidInputException("Company ID is required for an update.");
        }

        Company company = companyRepository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found for ID: " + dto.getId()));

        // Cập nhật thông tin cơ bản
        company.setName(dto.getName());
        company.setLocation(dto.getLocation());
        company.setCategory(dto.getCategory());
        company.setSlogan(dto.getSlogan());
        company.setDescription(dto.getDescription());
        company.setSize(dto.getSize());
        company.setMobile(dto.getMobile());
        company.setWebsite(dto.getWebsite());
        company.setRequirements(dto.getRequirements());

        // Xử lý upload ảnh companyImage
        if (companyImage != null && !companyImage.isEmpty()) {
            String companyImageUrl = uploadImageToCloudinary(companyImage,
                    "companies/" + company.getId() + "/company_image");
            company.setCompanyPicUrl(companyImageUrl);
        }

        // Xử lý upload ảnh coverImage
        if (coverImage != null && !coverImage.isEmpty()) {
            String coverImageUrl = uploadImageToCloudinary(coverImage, "companies/" + company.getId() + "/cover_image");
            company.setCoverPicUrl(coverImageUrl);
        }

        companyRepository.save(company);

        return "Company updated successfully with ID: " + company.getId();
    }

    private String uploadImageToCloudinary(MultipartFile file, String folderPath) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("folder", folderPath));
        return uploadResult.get("secure_url").toString();
    }

    public String saveCompanyImageFile(long companyId, MultipartFile file, String imageType) {
        if (file == null || file.isEmpty()) {
            System.out.println("No file provided for company " + companyId + " (" + imageType + ")");
            return null;
        }

        try {
            Company company = companyRepository.findById(companyId)
                    .orElseThrow(() -> new RuntimeException("Company not found for ID: " + companyId));

            CompanyImage existingImage = companyImageRepository.findByCompanyIdAndType(companyId, imageType)
                    .orElse(null);

            // Delete old
            if (existingImage != null && existingImage.getUrl() != null) {
                String oldKey = existingImage.getUrl()
                        .substring(existingImage.getUrl().lastIndexOf("/") + 1);
                amazonS3.deleteObject(bucketName, imageType + "/" + oldKey);
            }

            // Upload new
            CommonFileSaveBinaryDataDto resource = fileService.createResource(file, imageType + "/", bucketName);

            if (existingImage == null) {
                existingImage = new CompanyImage();
                existingImage.setId(UUID.randomUUID().toString());
            }

            existingImage.setUrl(resource.getUrl());
            existingImage.setFileName(file.getOriginalFilename());
            existingImage.setType(imageType);
            existingImage.setCompany(company);

            companyImageRepository.save(existingImage);

            return existingImage.getUrl();

        } catch (Exception e) {
            System.out.println("Failed to save " + imageType + " for company " + companyId + ": " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public void updateProducts(CompanyUpdateRequestDTO companyUpdateRequestDTO, Company company) {
        if (companyUpdateRequestDTO.getProducts() != null) {
            for (Products product : company.getProducts()) {
                product.setCompany(company);
            }
        }
    }

    private void updateClients(CompanyUpdateRequestDTO companyUpdateRequestDTO, Company company) {
        if (companyUpdateRequestDTO.getClients() != null) {
            List<Client> clients = new ArrayList<>();
            for (ClientDTO mappedClient : companyUpdateRequestDTO.getClients()) {
                Client client = clientRepo.findByClientName(mappedClient.getClientName())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Client with name " + mappedClient.getClientName() + ACTION_1));
                clients.add(client);
            }
            company.setClients(clients);
        }
    }

    private void updateTechnologies(CompanyUpdateRequestDTO companyUpdateRequestDTO, Company company) {
        if (companyUpdateRequestDTO.getTechnologies() != null) {
            List<Technology> technologies = new ArrayList<>();
            for (TechnologyDTO mappedTechnology : companyUpdateRequestDTO.getTechnologies()) {
                Technology technology = technologyRepo.findByTechName(mappedTechnology.getTechName())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Technology with name " + mappedTechnology.getTechName() + ACTION_1));
                technologies.add(technology);
            }
            company.setTechnologies(technologies);
        }
    }

    @Override
    public void deleteCompany(Long id) {
        if (id == null) {
            throw new InvalidInputException("Company ID cannot be null.");
        }
        if (!companyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Company with ID " + id + " not found.");
        }
        try {
            companyRepository.deleteById(id);
        } catch (Exception e) {
            throw new OperationFailedException("Failed to delete company with ID " + id + ": " + e.getMessage());
        }
    }

    @Override
    public CompanygetResponseDTO getCompanyByName(String username) {
        Company company = companyRepository.findByName(username)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        return modelMapper.map(company, CompanygetResponseDTO.class);
    }

    @Override
    public CompanygetResponseDTO getCompanyByUserId(int userId) {
        Company company = companyRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        return modelMapper.map(company, CompanygetResponseDTO.class);
    }

    @Override
    public String approveJob(int studentId, int jobId, JobApproveResponseDTO jobApproveResponseDTO) {
        if (jobRepo.existsById(jobId)) {

            Job job = jobRepo.findByJobId(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
            Student student = studentRepo.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            StudentJobs studentJobs = studentJobsRepo.findByStudentAndJob(student, job);
            studentJobs.setInterviewDate(jobApproveResponseDTO.getInterviewDate());
            studentJobs.setStatus(jobApproveResponseDTO.getStatus());
            studentJobsRepo.save(studentJobs);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMMM dd, yyyy 'at' hh:mm a");
            String formattedDateTime = studentJobs.getInterviewDate().format(formatter) + " UTC";
            String emailBody = String.format(
                    "Dear %s,\n\nYour application for '%s' has been approved.\nInterview Date & Time: %s\n\nBest regards,\n%s Team",
                    student.getFirstName(),
                    job.getJobTitle(),
                    formattedDateTime,
                    job.getCompany().getName());

            try {
                emailService.sendEmail(student.getEmail(), "Interview Scheduled - " + job.getJobTitle(), emailBody);
            } catch (Exception e) {
                // Log the error and proceed

            }

            // Notification notification = Notification.builder()
            // .message("Your job application for " + job.getJobTitle() + " has been
            // approved!")
            // .userId((long) studentId)
            // .isRead(false)
            // .createdAt(LocalDateTime.now())
            // .student(student)
            // .build();
            // notificationService.sendNotification(String.valueOf(studentId),
            // notification);

            return "approved successfully ";
        } else {
            throw new ResourceNotFoundException("Job not found");
        }

    }

    public List<ApplicantDetailsgetResponseDTO> getApprovedApplicants(int companyId) {

        List<Job> jobs = jobRepo.findByCompany_Id(Long.valueOf(companyId));
        // List<StudentJobs> studentJobs =
        // studentJobsRepo.findByStatusTrueAndJob_JobId()
        List<StudentJobs> studentJobs = new ArrayList<>();
        for (Job job : jobs) {
            List<StudentJobs> studentJobs1 = studentJobsRepo.findByStatusTrueAndJob_JobId(job.getJobId());
            studentJobs.addAll(studentJobs1);
        }
        List<ApplicantDetailsgetResponseDTO> applicantDetailsgetResponseDTOList = new ArrayList<>();
        for (StudentJobs studentJobs2 : studentJobs) {
            ApplicantDetailsgetResponseDTO applicantDetailsgetResponseDTO = new ApplicantDetailsgetResponseDTO();
            applicantDetailsgetResponseDTO.setFirstName(studentJobs2.getStudent().getFirstName());
            applicantDetailsgetResponseDTO.setLastName(studentJobs2.getStudent().getLastName());
            applicantDetailsgetResponseDTO.setUniversity(studentJobs2.getStudent().getUniversity());
            applicantDetailsgetResponseDTO.setStatus(studentJobs2.getStatus());
            applicantDetailsgetResponseDTO.setInterviewDate(studentJobs2.getInterviewDate());
            applicantDetailsgetResponseDTO.setJobFieldName(studentJobs2.getJob().getJobTitle());

            // Try to get profile image URL from both possible sources
            Student student = studentJobs2.getStudent();
            if (student.getProfilePicUrl() != null) {
                applicantDetailsgetResponseDTO.setProfileImageUrl(student.getProfilePicUrl());
            } else if (student.getUser() != null && student.getUser().getProfileImage() != null) {
                applicantDetailsgetResponseDTO.setProfileImageUrl(student.getUser().getProfileImage().getUrl());
            }

            applicantDetailsgetResponseDTOList.add(applicantDetailsgetResponseDTO);
        }
        return applicantDetailsgetResponseDTOList;

    }

    public Company findByUser(UserEntity user) {
        return companyRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Company not found for user"));
    }

    @Override
    public String rejectJob(int studentId, int jobId) {
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        StudentJobs studentJobs = studentJobsRepo.findByStudentAndJob(student, job);
        if (studentJobs == null) {
            throw new RuntimeException("Application not found");
        }

        // Kiểm tra nếu đơn đã được chấp nhận và lên lịch phỏng vấn
        if (studentJobs.getStatus() != null && studentJobs.getStatus() && studentJobs.getInterviewDate() != null) {
            throw new RuntimeException("Không thể từ chối đơn ứng tuyển đã được chấp nhận và lên lịch phỏng vấn");
        }

        // Send rejection email to the candidate
        String emailBody = String.format(
                "Xin chào %s,\n\nChúng tôi rất tiếc phải thông báo rằng hồ sơ ứng tuyển của bạn cho vị trí '%s' tại %s đã không được chấp thuận.\n\nChúng tôi đánh giá cao sự quan tâm của bạn đến công ty và chúc bạn thành công trong con đường sự nghiệp.\n\nTrân trọng,\nĐội ngũ %s",
                student.getFirstName(),
                job.getJobTitle(),
                job.getCompany().getName(),
                job.getCompany().getName());

        try {
            emailService.sendEmail(student.getEmail(), "Thông báo kết quả ứng tuyển - " + job.getJobTitle(), emailBody);
        } catch (Exception e) {
            // Log the error but continue with the rejection process
            System.err.println("Failed to send rejection email: " + e.getMessage());
        }

        // Delete the application record
        studentJobsRepo.delete(studentJobs);

        return "Application rejected successfully";
    }

}
