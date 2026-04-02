package com.cms.service;

import com.cms.dto.AuthDTOs.*;
import com.cms.model.OtpToken;
import com.cms.model.User;
import com.cms.repository.OtpTokenRepository;
import com.cms.repository.UserRepository;
import com.cms.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class AuthService {

    @Autowired private UserRepository userRepo;
    @Autowired private OtpTokenRepository otpRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private EmailService emailService;

    public AuthResponse signup(SignupRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        userRepo.save(user);

        String otp = String.format("%06d", new Random().nextInt(999999));
        otpRepo.deleteByEmail(req.getEmail());
        otpRepo.save(new OtpToken(req.getEmail(), otp));

        System.out.println("\n==============================================");
        System.out.println("OTP for " + req.getEmail() + " is: " + otp);
        System.out.println("==============================================\n");

        try {
            emailService.sendOtpEmail(req.getEmail(), req.getName(), otp);
            System.out.println("Email sent to " + req.getEmail());
        } catch (Exception e) {
            System.err.println("Email failed - use OTP from console: " + e.getMessage());
        }

        return new AuthResponse(null, req.getName(), req.getEmail(), "OTP sent");
    }

    public AuthResponse verifyOtp(OtpRequest req) {
        OtpToken token = otpRepo.findTopByEmailAndUsedFalseOrderByIdDesc(req.getEmail())
                .orElseThrow(() -> new RuntimeException("No OTP found. Please sign up again."));
        if (token.isExpired()) throw new RuntimeException("OTP expired. Please sign up again.");
        if (!token.getCode().equals(req.getCode())) throw new RuntimeException("Invalid OTP code.");

        token.setUsed(true);
        otpRepo.save(token);

        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEmailVerified(true);
        userRepo.save(user);

        String jwt = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(jwt, user.getName(), user.getEmail(), "Verified successfully");
    }

    public AuthResponse signin(SigninRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!user.isEmailVerified()) throw new RuntimeException("Please verify your email first");
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid email or password");
        String jwt = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(jwt, user.getName(), user.getEmail(), "Login successful");
    }
}
