package com.example.CarrerLink_backend.repo;

import com.example.CarrerLink_backend.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, Integer> {
    @Modifying
    @Query("DELETE FROM Experience e WHERE e.cv.id = :cvId")
    void deleteAllByCvId(@Param("cvId") Integer cvId);
}