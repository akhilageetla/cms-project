package com.cms.repository;

import com.cms.model.Complaint;
import com.cms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByUserOrderByCreatedAtDesc(User user);

    @Query("SELECT c FROM Complaint c WHERE c.status = 'PENDING' AND c.createdAt <= :threeMinutesAgo")
    List<Complaint> findPendingOlderThan(@Param("threeMinutesAgo") LocalDateTime threeMinutesAgo);
}
