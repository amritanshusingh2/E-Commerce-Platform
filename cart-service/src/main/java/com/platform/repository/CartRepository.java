package com.platform.repository;

import java.util.List;

import com.platform.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface CartRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserId(Long userId);
    Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);
    @Modifying
    @Transactional
    @Query("DELETE FROM CartItem c WHERE c.productId = :productId")
    void deleteByProductId(Long productId);

}
