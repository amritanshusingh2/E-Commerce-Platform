package com.platform.product_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import com.platform.service.ProductService;
import com.platform.entity.Product;
import com.platform.repository.ProductRepository;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import com.platform.controller.ProductController;
import com.platform.model.ProductDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class ProductServiceApplicationTests {

	@Test
	void contextLoads() {
	}

	@Mock
	private ProductService productService;
	@InjectMocks
	private ProductController productController;
	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}
	@Test
	void testGetAllProductsReturnsList() {
		List<Product> products = Arrays.asList(new Product(), new Product());
		when(productService.getAllProducts()).thenReturn(products);
		List<Product> result = productController.getAllProducts();
		assertEquals(2, result.size());
	}
	@Test
	void testGetProductCountReturnsValue() {
		when(productService.getProductCount()).thenReturn(7L);
		long count = productController.getProductCount();
		assertEquals(7L, count);
	}
	@Test
	void testSaveProductDelegatesToService() {
		Product product = new Product();
		when(productService.saveProduct(product)).thenReturn(product);
		Product result = productController.saveProduct(product);
		assertEquals(product, result);
	}
	@Test
	void testGetProductsByCategoryReturnsList() {
		List<Product> products = Arrays.asList(new Product(), new Product());
		when(productService.getProductsByCategory("Electronics")).thenReturn(products);
		List<Product> result = productController.getProductsByCategory("Electronics");
		assertEquals(2, result.size());
	}
}

@ExtendWith(MockitoExtension.class)
class ProductServiceUnitTest {
	@Mock
	private ProductRepository productRepository;
	@InjectMocks
	private ProductService productService;

	@Test
	void getProductById_throwsException_whenProductNotFound() {
		when(productRepository.findById(1L)).thenReturn(java.util.Optional.empty());
		Exception ex = assertThrows(RuntimeException.class, () -> productService.getProductById(1L));
		assertTrue(ex.getMessage().contains("Product not found"));
	}
}
