package com.platform;

import com.platform.controller.AnalyticsController;
import com.platform.model.DashboardStats;
import com.platform.service.AnalyticsService;
import com.platform.feign.UserClient;
import com.platform.feign.ProductClient;
import com.platform.feign.OrderClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AnalyticsServiceApplicationTests {
    @Mock
    private AnalyticsService analyticsService;
    @Mock
    private UserClient userClient;
    @Mock
    private ProductClient productClient;
    @Mock
    private OrderClient orderClient;
    @InjectMocks
    private AnalyticsController analyticsController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetDashboardStatsReturnsOk() {
        DashboardStats stats = new DashboardStats();
        when(analyticsService.getDashboardStats()).thenReturn(stats);
        ResponseEntity<DashboardStats> response = analyticsController.getDashboardStats();
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(stats, response.getBody());
    }

    @Test
    void testTestServiceConnectionsAllSuccess() {
        when(userClient.getUserCount()).thenReturn(5L);
        when(productClient.getProductCount()).thenReturn(10L);
        when(orderClient.getOrderCount()).thenReturn(3L);
        ResponseEntity<String> response = analyticsController.testServiceConnections();
        assertTrue(response.getBody().contains("✓ User service: 5 users"));
        assertTrue(response.getBody().contains("✓ Product service: 10 products"));
        assertTrue(response.getBody().contains("✓ Order service: 3 orders"));
    }

    @Test
    void testDebugUserServiceReturnsUserCount() {
        when(userClient.getUserCount()).thenReturn(7L);
        ResponseEntity<String> response = analyticsController.debugUserService();
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("User count: 7", response.getBody());
    }

    @Test
    void testDebugProductServiceHandlesException() {
        when(productClient.getProductCount()).thenThrow(new RuntimeException("DB error"));
        ResponseEntity<String> response = analyticsController.debugProductService();
        assertEquals(400, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("Product service error: DB error"));
    }
} 