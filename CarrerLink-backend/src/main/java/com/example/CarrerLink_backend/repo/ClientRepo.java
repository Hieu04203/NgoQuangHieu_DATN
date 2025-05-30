package com.example.CarrerLink_backend.repo;

import com.example.CarrerLink_backend.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@EnableJpaRepositories
public interface ClientRepo extends JpaRepository<Client,Integer> {


    Optional<Client> findByClientName(String name);
}
