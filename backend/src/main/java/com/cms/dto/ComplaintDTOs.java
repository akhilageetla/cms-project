package com.cms.dto;

import com.cms.model.Complaint;
import java.time.LocalDateTime;

public class ComplaintDTOs {

    public static class CreateComplaintRequest {
        private String category;
        private String subject;
        private String description;
        private String priority;

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
    }

    public static class FeedbackRequest {
        private int rating;
        private String comment;

        public int getRating() { return rating; }
        public void setRating(int rating) { this.rating = rating; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }

    public static class ComplaintResponse {
        private Long id;
        private String ticketNumber;
        private String category;
        private String subject;
        private String description;
        private String priority;
        private String status;
        private String aiResponse;
        private LocalDateTime aiRespondedAt;
        private LocalDateTime createdAt;
        private FeedbackResponse feedback;

        public ComplaintResponse() {}

        public static ComplaintResponse from(Complaint c) {
            ComplaintResponse r = new ComplaintResponse();
            r.setId(c.getId());
            r.setTicketNumber(c.getTicketNumber());
            r.setCategory(c.getCategory());
            r.setSubject(c.getSubject());
            r.setDescription(c.getDescription());
            r.setPriority(c.getPriority());
            r.setStatus(c.getStatus().name());
            r.setAiResponse(c.getAiResponse());
            r.setAiRespondedAt(c.getAiRespondedAt());
            r.setCreatedAt(c.getCreatedAt());
            if (c.getFeedback() != null) {
                r.setFeedback(FeedbackResponse.from(c.getFeedback()));
            }
            return r;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTicketNumber() { return ticketNumber; }
        public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getAiResponse() { return aiResponse; }
        public void setAiResponse(String aiResponse) { this.aiResponse = aiResponse; }
        public LocalDateTime getAiRespondedAt() { return aiRespondedAt; }
        public void setAiRespondedAt(LocalDateTime aiRespondedAt) { this.aiRespondedAt = aiRespondedAt; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public FeedbackResponse getFeedback() { return feedback; }
        public void setFeedback(FeedbackResponse feedback) { this.feedback = feedback; }
    }

    public static class FeedbackResponse {
        private int rating;
        private String comment;

        public FeedbackResponse() {}
        public FeedbackResponse(int rating, String comment) {
            this.rating = rating;
            this.comment = comment;
        }

        public static FeedbackResponse from(com.cms.model.Feedback f) {
            return new FeedbackResponse(f.getRating(), f.getComment());
        }

        public int getRating() { return rating; }
        public void setRating(int rating) { this.rating = rating; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }
}

