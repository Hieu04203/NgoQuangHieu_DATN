package com.example.CarrerLink_backend.controller;

import com.example.CarrerLink_backend.dto.request.CompanySaveRequestDTO;
import com.example.CarrerLink_backend.dto.request.CompanyUpdateRequestDTO;
import com.example.CarrerLink_backend.dto.response.ApplicantDetailsgetResponseDTO;
import com.example.CarrerLink_backend.dto.response.CompanygetResponseDTO;

import com.example.CarrerLink_backend.dto.response.JobApproveResponseDTO;
import com.example.CarrerLink_backend.dto.response.JobgetResponseDTO;
import com.example.CarrerLink_backend.entity.UserEntity;
import com.example.CarrerLink_backend.service.CompanyService;
import com.example.CarrerLink_backend.service.impl.EmailService;
import com.example.CarrerLink_backend.utill.StandardResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import java.io.IOException;

import java.util.List;

@RestController
@RequestMapping("api/companies")
@AllArgsConstructor
public class CompanyController {

        private final CompanyService companyService;

        @Operation(summary = "Get companies with filters", description = "Fetch companies with filters location and category.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully fetched all companies"),
                        @ApiResponse(responseCode = "400", description = "Invalid path parameters"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        @GetMapping({ "/filter" })
        public ResponseEntity<StandardResponse> getCompanies(
                        @RequestParam(required = false) String location,
                        @RequestParam(required = false) String category) {
                List<CompanygetResponseDTO> companies = companyService.getCompanies(location, category);
                return ResponseEntity.ok(new StandardResponse(true, "Companies fetched successfully", companies));
        }

        @Operation(summary = "Get all companies", description = "Fetch all companies without any filters.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully fetched all companies"),
                        @ApiResponse(responseCode = "400", description = "Invalid path parameters"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        @GetMapping()
        public ResponseEntity<StandardResponse> getAllCompanies() {
                List<CompanygetResponseDTO> companies = companyService.getAllCompanies();
                return ResponseEntity.ok(new StandardResponse(true, "Companies fetched successfully", companies));
        }

        // Search a company by name
        @Operation(summary = "Search a company by name")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully fetched company"),
                        @ApiResponse(responseCode = "404", description = "Company not found"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        @GetMapping("/search")
        public ResponseEntity<StandardResponse> searchCompanyByName(@RequestParam String name) {
                List<CompanygetResponseDTO> companies = companyService.searchCompanyByName(name);
                return ResponseEntity.ok(new StandardResponse(true, "Company fetched successfully", companies));
        }

        // Save a new company
        @Operation(summary = "Save a company")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "201", description = "Company created successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        @PostMapping
        public ResponseEntity<StandardResponse> saveCompany(@RequestBody CompanySaveRequestDTO companySaveRequestDTO,
                        UserEntity user) {
                String savedCompany = companyService.saveCompany(companySaveRequestDTO, user);
                return ResponseEntity.status(201)
                                .body(new StandardResponse(true, "Company saved successfully", savedCompany));
        }

        @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @Operation(summary = "Cập nhật công ty")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Công ty đã cập nhật thành công"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public ResponseEntity<StandardResponse> updateCompany(
                        @RequestPart("company") String companyJson,
                        @RequestPart(value = "companyImage", required = false) MultipartFile companyImage,
                        @RequestPart(value = "coverImage", required = false) MultipartFile coverImage)
                        throws IOException {

                ObjectMapper objectMapper = new ObjectMapper();
                CompanyUpdateRequestDTO companyUpdateRequestDTO;
                try {
                        companyUpdateRequestDTO = objectMapper.readValue(companyJson, CompanyUpdateRequestDTO.class);
                } catch (JsonProcessingException e) {
                        return ResponseEntity.badRequest()
                                        .body(new StandardResponse(false, "Invalid JSON format", null));
                }

                String message = companyService.updateCompany(companyUpdateRequestDTO, companyImage, coverImage);
                return ResponseEntity.ok(new StandardResponse(true, "Công ty đã cập nhật thành công", message));
        }

        // Delete a company
        @Operation(summary = "Delete a company")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Company deleted successfully"),
                        @ApiResponse(responseCode = "404", description = "Company not found"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        @DeleteMapping("/{id}")
        public ResponseEntity<StandardResponse> deleteCompany(@PathVariable Long id) {
                companyService.deleteCompany(id);
                return ResponseEntity.ok(new StandardResponse(true, "Company deleted successfully", null));
        }

        @Operation(summary = "Get company by username")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully fetched all applicants"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        @GetMapping("/username/{username}")
        public ResponseEntity<StandardResponse> getCompanyByName(@PathVariable String username) {
                CompanygetResponseDTO company = companyService.getCompanyByName(username);
                return ResponseEntity.ok(new StandardResponse(true, "Applicants fetched successfully", company));
        }

        @Operation(summary = "Get company by userid")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully fetched all applicants"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        @GetMapping("/userId/{userId}")
        public ResponseEntity<StandardResponse> getCompanyById(@PathVariable int userId) {
                CompanygetResponseDTO company = companyService.getCompanyByUserId(userId);
                return ResponseEntity.ok(new StandardResponse(true, "Applicants fetched successfully", company));
        }

        @Operation(summary = "Aprove a job for student")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully fetched all applicants"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        @PutMapping("/approve-job")
        public ResponseEntity<StandardResponse> approveJob(
                        @RequestParam int studentId,
                        @RequestParam int jobId,
                        @RequestBody JobApproveResponseDTO jobApproveResponseDTO) {
                if (jobApproveResponseDTO.getInterviewDate().isBefore(OffsetDateTime.now(ZoneOffset.UTC))) {
                        throw new IllegalArgumentException("Interview date must be in the future");
                }
                String message = companyService.approveJob(studentId, jobId, jobApproveResponseDTO);
                return ResponseEntity.ok(new StandardResponse(true, "Job approved successfully", message));
        }

        @Operation(summary = "get all the approved applicants")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully fetched all applicants"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        @GetMapping("/all-the-approved-applicants/{companyId}")
        public ResponseEntity<StandardResponse> getAllTheApprovedApplicants(@PathVariable int companyId) {
                List<ApplicantDetailsgetResponseDTO> applicantDetailsgetResponseDTOList = companyService
                                .getApprovedApplicants(companyId);
                return ResponseEntity.ok(new StandardResponse(true, "Job approved successfully",
                                applicantDetailsgetResponseDTOList));

        }

        @Operation(summary = "Reject a job application")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully rejected the application"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        @PutMapping("/reject-job")
        public ResponseEntity<StandardResponse> rejectJob(
                        @RequestParam int studentId,
                        @RequestParam int jobId) {
                String message = companyService.rejectJob(studentId, jobId);
                return ResponseEntity.ok(new StandardResponse(true, "Job application rejected successfully", message));
        }

}
