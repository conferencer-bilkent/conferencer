package com.conferencer.service.impl;

import java.util.Optional;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        // Get the principal (user) object, which will be of type UserDetails (or custom User)
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            // If the principal is an instance of UserDetails, extract the username
            if (principal instanceof UserDetails userDetails) {
                return Optional.of(userDetails.getUsername());
            }
        }

        return Optional.empty();
    }
}