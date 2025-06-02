package com.example.CarrerLink_backend.service;

import com.example.CarrerLink_backend.dto.request.ApplyJobRequestDTO;
import com.example.CarrerLink_backend.dto.request.StudentSaveRequestDTO;
import com.example.CarrerLink_backend.dto.request.StudentUpdateRequestDTO;
import com.example.CarrerLink_backend.dto.response.ApplyJobResponseDTO;
import com.example.CarrerLink_backend.dto.response.StudentgetResponseDTO;
import com.example.CarrerLink_backend.entity.UserEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface StudentService {
    String saveStudent(StudentSaveRequestDTO studentSaveRequestDTO, UserEntity user, MultipartFile imageFile) throws IOException;



    String updateStudent(StudentUpdateRequestDTO studentUpdateRequestDTO, MultipartFile imageFile) throws IOException;



    void deleteStudent(int id);

    String applyJob(ApplyJobRequestDTO applyJobRequestDTO);



    List<ApplyJobResponseDTO> getJobByStudent(int studentId);



    StudentgetResponseDTO getStudentById(int stId);

    StudentgetResponseDTO getStudentByUserName(String userName);

    StudentgetResponseDTO getStudentByUserId(int userId);



    String approveStudent(int studentId);

    List<StudentgetResponseDTO> getAllStudents();
}
