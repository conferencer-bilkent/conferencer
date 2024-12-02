package com.conferencer.repository;

import com.conferencer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    @Query("SELECT u FROM User u "
            + "LEFT JOIN FETCH u.userToken ut "
            + "LEFT JOIN FETCH u.role r "
            + "LEFT JOIN FETCH r.authorities a "
            + " WHERE u.email = :email")
    User findByEmail(String email);
}
