package com.cms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String name, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("CMS Portal — Email Verification Code");
            helper.setText(buildOtpHtml(name, otp), true);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Email send failed: " + e.getMessage());
        }
    }

    private String buildOtpHtml(String name, String otp) {
        return """
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
              <h2 style="color:#1e40af;margin-bottom:8px">CMS Portal</h2>
              <p style="color:#444">Hello <strong>%s</strong>,</p>
              <p style="color:#444">Your email verification code is:</p>
              <div style="font-size:36px;font-weight:700;letter-spacing:12px;color:#1e40af;
                          background:#dbeafe;padding:20px;border-radius:10px;text-align:center;
                          margin:20px 0">%s</div>
              <p style="color:#888;font-size:13px">This code expires in <strong>10 minutes</strong>.
              Do not share it with anyone.</p>
              <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
              <p style="color:#aaa;font-size:12px">CMS Portal — Complaint Management System</p>
            </div>
            """.formatted(name, otp);
    }
}
