package com.cms.service;
import com.cms.dto.AuthDTOs.*;
import com.cms.model.User;
import com.cms.repository.UserRepository;
import com.cms.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service
public class AuthService {
    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;
    public AuthResponse signup(SignupRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setEmailVerified(true);
        userRepo.save(user);
        String jwt = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(jwt, user.getName(), user.getEmail(), "Account created successfully");
    }
    public AuthResponse signin(SigninRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid email or password");
        String jwt = jwtUtil.generateToken(user.getEmail());
return new AuthResponse(jwt, user.getName(), user.getEmail(), "Login successful");
    }
}