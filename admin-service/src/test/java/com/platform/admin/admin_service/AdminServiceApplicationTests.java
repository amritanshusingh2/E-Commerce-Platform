package com.platform.admin.admin_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import com.platform.admin.admin_service.controller.AdminController;
import com.platform.admin.admin_service.Feign.UserClient;
import com.platform.admin.admin_service.Feign.ProductClient;
import com.platform.admin.admin_service.Feign.OrderClient;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class AdminServiceApplicationTests {

	@Test
	void contextLoads() {
	}

	@Mock
	private UserClient userClient;
	@Mock
	private ProductClient productClient;
	@Mock
	private OrderClient orderClient;
	@InjectMocks
	private AdminController adminController;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void testGetAllUsersReturnsList() {
		List<Object> users = Arrays.asList(new Object(), new Object());
		when(userClient.getAllUsers()).thenReturn(users);
		List<Object> result = adminController.getAllUsers();
		assertEquals(2, result.size());
	}

	@Test
	void testGetUserCountReturnsValue() {
		when(userClient.getUserCount()).thenReturn(5L);
		long count = adminController.getUserCount();
		assertEquals(5L, count);
	}

	@Test
	void testCreateProductDelegatesToClient() {
		Object product = new Object();
		when(productClient.createProduct(product)).thenReturn(product);
		Object result = adminController.createProduct(product);
		assertEquals(product, result);
	}

	@Test
	void testGetAllOrdersEmptyList() {
		when(orderClient.getAllOrders()).thenReturn(Collections.emptyList());
		List<Object> result = adminController.getAllOrders();
		assertTrue(result.isEmpty());
	}
}
