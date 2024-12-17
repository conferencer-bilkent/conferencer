package com.conferencer.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.conferencer.model.User;

public interface UserRepository extends JpaRepository<User, UUID> {

    @Query("SELECT u FROM User u "
            + "LEFT JOIN FETCH u.userToken ut "
            + "LEFT JOIN FETCH u.role r "
            + "LEFT JOIN FETCH r.authorities a "
            + " WHERE u.email = :email")
    Optional<User> findByEmail(String email);


}
