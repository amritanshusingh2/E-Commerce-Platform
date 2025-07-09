package com.platform.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.platform.entity.Order;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByUserId(Long userId);
    // List<Order> findByStatus(String status);
    // List<Order> findByUserIdAndStatus(Long userId, String status);


}
