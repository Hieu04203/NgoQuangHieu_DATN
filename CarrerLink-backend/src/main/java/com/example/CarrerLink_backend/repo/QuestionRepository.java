// QuestionRepository.java
package com.example.CarrerLink_backend.repo;

import com.example.CarrerLink_backend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@EnableJpaRepositories
public interface QuestionRepository extends JpaRepository<Question, Long> {
    Optional<Question> findById(Long questionId);
}