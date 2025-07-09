package com.platform.order_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import com.platform.service.OrderService;
import com.platform.entity.Order;
import com.platform.repository.OrderRepository;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import com.platform.controller.OrderController;
import com.platform.model.OrderRequest;
import com.platform.model.OrderResponse;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.http.HttpHeaders;
import java.util.Arrays;
import java.util.List;
import org.mockito.MockitoAnnotations;

@SpringBootTest
class OrderServiceApplicationTests {

	@Test
	void contextLoads() {
	}

	@Mock
	private OrderService orderService;
	@InjectMocks
	private OrderController orderController;
	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}
	@Test
	void testGetAllOrdersReturnsList() {
		List<Order> orders = Arrays.asList(new Order(), new Order());
		when(orderService.getAllOrders()).thenReturn(orders);
		List<Order> result = orderController.getAllOrders();
		assertEquals(2, result.size());
	}
	@Test
	void testGetOrderCountReturnsValue() {
		when(orderService.getOrderCount()).thenReturn(5L);
		long count = orderController.getOrderCount();
		assertEquals(5L, count);
	}
	@Test
	void testUpdateOrderStatusDelegatesToService() {
		Order order = new Order();
		when(orderService.updateOrderStatus(1L, "SHIPPED")).thenReturn(order);
		Order result = orderController.updateOrderStatus(1L, "SHIPPED");
		assertEquals(order, result);
	}
	@Test
	void testMarkOrderAsDeliveredDelegatesToService() {
		Order order = new Order();
		when(orderService.markOrderAsDelivered(2L)).thenReturn(order);
		Order result = orderController.markOrderAsDelivered(2L);
		assertEquals(order, result);
	}
}

@ExtendWith(MockitoExtension.class)
class OrderServiceUnitTest {
	@Mock
	private OrderRepository orderRepository;
	@InjectMocks
	private OrderService orderService;

	@Test
	void getOrdersByUserId_returnsEmptyList_whenNoOrdersFound() {
		when(orderRepository.findByUserId(1L)).thenReturn(new java.util.ArrayList<>());
		java.util.List<Order> result = orderService.getOrdersByUserId(1L);
		assertTrue(result.isEmpty());
	}
}
