package com.example.CarrerLink_backend.repo;

import com.example.CarrerLink_backend.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Integer> {
    @Modifying
    @Query("DELETE FROM Certification c WHERE c.cv.id = :cvId")
    void deleteAllByCvId(@Param("cvId") Integer cvId);
}