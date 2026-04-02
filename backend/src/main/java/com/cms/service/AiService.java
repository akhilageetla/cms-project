package com.cms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@Service
public class AiService {

    @Value("${anthropic.api.key}")
    private String apiKey;

    @Value("${anthropic.api.url}")
    private String apiUrl;

    @Value("${anthropic.model}")
    private String model;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    public String generateResolution(String category, String subject, String description, String priority) {
        try {
            String prompt = """
                You are a professional customer support AI for an Online Complaint Management System.
                A user has submitted the following complaint. Provide a clear, empathetic, and actionable resolution.
                Be specific, professional, and helpful. Respond in 4-5 sentences.

                Category: %s
                Subject: %s
                Description: %s
                Priority: %s

                Provide a solution that:
                1. Acknowledges the issue with empathy
                2. Gives a concrete next step or fix
                3. Mentions escalation path if needed
                4. Ends with reassurance
                """.formatted(category, subject, description, priority);

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("model", model);
            body.put("max_tokens", 1000);
            body.put("messages", List.of(
                Map.of("role", "user", "content", prompt)
            ));

            String json = mapper.writeValueAsString(body);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .header("Content-Type", "application/json")
                    .header("x-api-key", apiKey)
                    .header("anthropic-version", "2023-06-01")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            Map<?, ?> responseMap = mapper.readValue(response.body(), Map.class);

            List<?> content = (List<?>) responseMap.get("content");
            if (content != null && !content.isEmpty()) {
                Map<?, ?> firstBlock = (Map<?, ?>) content.get(0);
                return (String) firstBlock.get("text");
            }
            return getFallbackResponse(subject, category);

        } catch (Exception e) {
            System.err.println("AI API error: " + e.getMessage());
            return getFallbackResponse(subject, category);
        }
    }

    private String getFallbackResponse(String subject, String category) {
        return "Thank you for submitting your complaint regarding '" + subject + "' under the " + category +
               " category. We have received your request and our support team is reviewing it. " +
               "You can expect a detailed follow-up within 24 business hours. " +
               "If this is urgent, please contact our helpline directly. " +
               "We apologize for any inconvenience caused and appreciate your patience.";
    }
}
