package com.example.CarrerLink_backend.controller;


import com.example.CarrerLink_backend.dto.CourseRecommendationDTO;
import com.example.CarrerLink_backend.dto.JobDetailsDTO;
import com.example.CarrerLink_backend.dto.JobRecommendationDTO;
import com.example.CarrerLink_backend.dto.ProjectIdeaDTO;
import com.example.CarrerLink_backend.dto.request.ApplyJobRequestDTO;
import com.example.CarrerLink_backend.dto.request.StudentSaveRequestDTO;
import com.example.CarrerLink_backend.dto.request.StudentUpdateRequestDTO;
import com.example.CarrerLink_backend.dto.response.ApplyJobResponseDTO;
import com.example.CarrerLink_backend.dto.response.StudentgetResponseDTO;
import com.example.CarrerLink_backend.entity.Student;
import com.example.CarrerLink_backend.entity.UserEntity;
import com.example.CarrerLink_backend.repo.StudentRepo;
import com.example.CarrerLink_backend.service.CourseRecommendationService;
import com.example.CarrerLink_backend.service.JobService;
import com.example.CarrerLink_backend.service.ProjectRecommendationService;
import com.example.CarrerLink_backend.service.StudentService;
import com.example.CarrerLink_backend.service.impl.CountBroadcastService;
import com.example.CarrerLink_backend.service.impl.CourseRecommendationServiceImpl;
import com.example.CarrerLink_backend.service.impl.JobRecommendationServiceImpl;
import com.example.CarrerLink_backend.utill.StandardResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/students")
@AllArgsConstructor
public class StudentController {
    private final StudentService studentService;
    private final CourseRecommendationService courseRecommendationService;
    private final ProjectRecommendationService projectService;
    private final StudentRepo studentRepo;
    private final CourseRecommendationServiceImpl courseRecommendationServiceImpl;
    private final JobRecommendationServiceImpl recommendationService;
    private final ProjectRecommendationService projectRecommendationService;
    private final CountBroadcastService countBroadcastService;
    private final JobService jobService;
    @Operation(summary = "Lưu ứng viên")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Ứng viên đã tạo thành công"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping
    public ResponseEntity<StandardResponse> saveStudent(@RequestBody StudentSaveRequestDTO studentSaveRequestDTO, UserEntity user){

        String message = studentService.saveStudent(studentSaveRequestDTO,user);
        countBroadcastService.broadcastChartUpdates();
        return ResponseEntity.status(201)
                .body(new StandardResponse(true, "Company saved successfully", message));

    }

    @PutMapping(consumes = {"multipart/form-data"})
    @Operation(summary = "Cập nhật ứng viên")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Ứng viên đã cập nhật thành công"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<StandardResponse> updateStudent(
            @RequestPart("student") String studentJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) throws IOException {

        // Convert studentJson (String) to StudentUpdateRequestDTO
        ObjectMapper objectMapper = new ObjectMapper();
        StudentUpdateRequestDTO studentUpdateRequestDTO;
        try {
            studentUpdateRequestDTO = objectMapper.readValue(studentJson, StudentUpdateRequestDTO.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().body(new StandardResponse(false, "Invalid JSON format", null));
        }

        String message = studentService.updateStudent(studentUpdateRequestDTO, imageFile);
        countBroadcastService.broadcastChartUpdates();
        return ResponseEntity.ok(new StandardResponse(true, "Ứng viên đã cập nhật thành công", message));
    }

    @Operation(summary = "Xóa ứng viên")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Ứng viên đã được xóa thành công"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> deleteStudent(@PathVariable int id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(new StandardResponse(true, "Ứng viên đã được xóa thành công", null));
    }

    @Operation(summary = "Apply for a job")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Job applied successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/apply-job")
    public ResponseEntity<StandardResponse> applyJob(@RequestBody ApplyJobRequestDTO applyJobRequestDTO){
        String message = studentService.applyJob(applyJobRequestDTO);
        return ResponseEntity.ok(new StandardResponse(true, "Việc làm đã được ứng tuyển thành công", message));
    }


    @Operation(summary = "Get all jobs applied by a student")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đã lấy thành công tất cả các công việc"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/get-job-by-student")

    public ResponseEntity<StandardResponse> getJobByStudent(@RequestParam int studentId){
        List<ApplyJobResponseDTO> students = studentService.getJobByStudent(studentId);
        return ResponseEntity.ok(new StandardResponse(true, "Đã tải công việc thành công", students));
    }


    @Operation(summary = "Lấy ứng viên theo id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đã lấy được tất cả các ứng viên thành công"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("{studentId}")

    public ResponseEntity<StandardResponse> getStudentById(@PathVariable int studentId){
        StudentgetResponseDTO students = studentService.getStudentById(studentId);
        return ResponseEntity.ok(new StandardResponse(true, "Đã tìm được ứng viên thành công", students));
    }


    @Operation(summary = "Nhận các đề xuất phù hợp với kỹ năng của ứng viên")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Courses found"),
            @ApiResponse(responseCode = "404", description = "Student not found or no course recommendations available"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/recommend-courses")
    public ResponseEntity<StandardResponse> getCourseRecommendations(@RequestParam int studentId) {
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ứng viên"));

        List<CourseRecommendationDTO> recommendations =
                courseRecommendationService.getRecommendedCoursesWithScores(student);

        if (recommendations.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new StandardResponse(false, "Không tìm thấy khuyến nghị nào cho ứng viên", recommendations));
        }

        return ResponseEntity.ok(
                new StandardResponse(true, "Khuyến nghị được tìm thấy", recommendations)
        );
    }




    @Operation(summary = "Get student by username")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully fetched all applicants"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/userId/{userId}")
    public ResponseEntity<StandardResponse> getStudentByUserID(@PathVariable int userId){
        StudentgetResponseDTO students = studentService.getStudentByUserId(userId);
        return ResponseEntity.ok(new StandardResponse(true, "Applicants fetched successfully", students));
    }



    @GetMapping("/recommend-projects/{studentId}")
    public ResponseEntity<List<ProjectIdeaDTO>> getProjectRecommendations(@PathVariable int studentId) {
        return ResponseEntity.ok(projectRecommendationService.getProjectRecommendations(studentId));
    }

    @GetMapping("/jobrecommendations/{studentId}")
    public ResponseEntity<StandardResponse> getRecommendations(@PathVariable int studentId) {
        Student student = studentRepo.findByUser_Id(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        List<JobRecommendationDTO> results =  recommendationService.getRecommendedJobsWithScores(student);
        return ResponseEntity.ok(new StandardResponse(true,"Recommended Jobs fetched successfully",results));
    }

    @GetMapping("/getall")
    public ResponseEntity<StandardResponse> getAllStudents(){
        List<StudentgetResponseDTO> students = studentService.getAllStudents();
        return ResponseEntity.ok(new StandardResponse(true, "Students fetched successfully", students));

    }

    @PutMapping("approve/{studentId}")
    public ResponseEntity<StandardResponse> approveStudent(@PathVariable int studentId) {
        String message = studentService.approveStudent(studentId);
        return ResponseEntity.ok(new StandardResponse(true, "Student approved successfully", message));

    }


}
