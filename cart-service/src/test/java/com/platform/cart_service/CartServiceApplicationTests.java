package com.platform.cart_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import com.platform.service.CartService;
import com.platform.entity.CartItem;
import com.platform.repository.CartRepository;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import com.platform.controller.CartController;
import com.platform.model.CartItemRequest;
import com.platform.model.CartItemDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpHeaders;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class CartServiceApplicationTests {

	@Test
	void contextLoads() {
	}

	@ExtendWith(MockitoExtension.class)
	class CartServiceUnitTest {
		@Mock
		private CartRepository cartRepository;
		@InjectMocks
		private CartService cartService;

		@Test
		void calculateTotalPrice_returnsZero_whenNoCartItemsFound() {
			when(cartRepository.findByUserId(1L)).thenReturn(new java.util.ArrayList<>());
			double result = cartService.calculateTotalPrice(1L);
			assertEquals(0.0, result);
		}
	}

	@Mock
	private CartService cartService;
	@InjectMocks
	private CartController cartController;
	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}
	@Test
	void testRemoveCartItemCallsService() {
		cartController.removeCartItem(5L);
		verify(cartService, times(1)).removeCartItem(5L);
	}
}
