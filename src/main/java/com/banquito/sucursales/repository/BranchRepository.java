package com.banquito.sucursales.repository;

import com.banquito.sucursales.model.Branch;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BranchRepository extends MongoRepository<Branch, String> {
}
