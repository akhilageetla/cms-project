package com.cms.service;

import com.cms.dto.ComplaintDTOs.*;
import com.cms.model.*;
import com.cms.model.Complaint.ComplaintStatus;
import com.cms.repository.*;
import com.cms.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    @Autowired private ComplaintRepository complaintRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private FeedbackRepository feedbackRepo;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private AiService aiService;

    private User getUserByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ComplaintResponse createComplaint(String email, CreateComplaintRequest req) {
        User user = getUserByEmail(email);
        Complaint complaint = new Complaint();
        complaint.setUser(user);
        complaint.setCategory(req.getCategory());
        complaint.setSubject(req.getSubject());
        complaint.setDescription(req.getDescription());
        complaint.setPriority(req.getPriority() != null ? req.getPriority() : "Medium");
        complaint.setStatus(ComplaintStatus.PENDING);
        Complaint saved = complaintRepo.save(complaint);
        return ComplaintResponse.from(saved);
    }

    public List<ComplaintResponse> getMyComplaints(String email) {
        User user = getUserByEmail(email);
        return complaintRepo.findByUserOrderByCreatedAtDesc(user)
                .stream().map(ComplaintResponse::from).collect(Collectors.toList());
    }

    public ComplaintResponse getComplaintById(String email, Long id) {
        User user = getUserByEmail(email);
        Complaint complaint = complaintRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        if (!complaint.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Access denied");
        return ComplaintResponse.from(complaint);
    }

    public ComplaintResponse submitFeedback(String email, Long id, FeedbackRequest req) {
        User user = getUserByEmail(email);
        Complaint complaint = complaintRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        if (!complaint.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Access denied");
        if (complaint.getFeedback() != null)
            throw new RuntimeException("Feedback already submitted");

        Feedback feedback = new Feedback();
        feedback.setComplaint(complaint);
        feedback.setRating(req.getRating());
        feedback.setComment(req.getComment());
        feedbackRepo.save(feedback);

        complaint.setStatus(ComplaintStatus.CLOSED);
        complaint.setFeedback(feedback);
        Complaint saved = complaintRepo.save(complaint);
        return ComplaintResponse.from(saved);
    }

    // Runs every 30 seconds — picks up complaints older than 3 minutes and calls AI
    @Scheduled(fixedDelay = 30000)
    public void processAiResponses() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(3);
        List<Complaint> pending = complaintRepo.findPendingOlderThan(threshold);
        for (Complaint complaint : pending) {
            try {
                System.out.println("AI processing ticket: " + complaint.getTicketNumber());
                String aiText = aiService.generateResolution(
                        complaint.getCategory(),
                        complaint.getSubject(),
                        complaint.getDescription(),
                        complaint.getPriority()
                );
                complaint.setAiResponse(aiText);
                complaint.setAiRespondedAt(LocalDateTime.now());
                complaint.setStatus(ComplaintStatus.AI_RESOLVED);
                complaintRepo.save(complaint);
                System.out.println("AI resolved: " + complaint.getTicketNumber());
            } catch (Exception e) {
                System.err.println("AI scheduler error for " + complaint.getTicketNumber() + ": " + e.getMessage());
            }
        }
    }
}
