package com.cms.controller;

import com.cms.dto.ComplaintDTOs.*;
import com.cms.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal UserDetails user,
                                    @RequestBody CreateComplaintRequest req) {
        try {
            return ResponseEntity.ok(complaintService.createComplaint(user.getUsername(), req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> list(@AuthenticationPrincipal UserDetails user) {
        try {
            return ResponseEntity.ok(complaintService.getMyComplaints(user.getUsername()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@AuthenticationPrincipal UserDetails user,
                                 @PathVariable Long id) {
        try {
            return ResponseEntity.ok(complaintService.getComplaintById(user.getUsername(), id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<?> feedback(@AuthenticationPrincipal UserDetails user,
                                      @PathVariable Long id,
                                      @RequestBody FeedbackRequest req) {
        try {
            return ResponseEntity.ok(complaintService.submitFeedback(user.getUsername(), id, req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
