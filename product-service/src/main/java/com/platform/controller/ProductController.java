package com.platform.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.platform.entity.Product;
import com.platform.model.ProductDTO;
import com.platform.service.ProductService;

@RestController
@RequestMapping("/products")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired  
    private ProductService productService;

    // Public: anyone can view all products
    @GetMapping
    public List<Product> getAllProducts() {
        logger.info("GET /products called");
        return productService.getAllProducts();
    }

    // Public: anyone can view a product by id
    @GetMapping("/{id}")
    public ProductDTO getProductById(@PathVariable Long id) {
        logger.info("GET /products/{} called", id);
        try {
            Product product = productService.getProductById(id);
            if (product == null) {
                throw new RuntimeException("Product not found with id: " + id);
            }
            ProductDTO productDTO = new ProductDTO();
            productDTO.setProductId(product.getProductId());
            productDTO.setName(product.getName());
            productDTO.setPrice(product.getPrice());
            productDTO.setStockQuantity(product.getStockQuantity());
            productDTO.setDescription(product.getDescription());
            productDTO.setImageUrl(product.getImageUrl());
            return productDTO;
        } catch (Exception e) {
            logger.error("Get product by ID failed for ID: {}", id, e);
            throw e;
        }
    }

    // Only ADMIN can add a product
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Product saveProduct(@RequestBody Product product) {
        logger.info("POST /products called for product: {}", product.getName());
        try {
            return productService.saveProduct(product);
        } catch (Exception e) {
            logger.error("Save product failed for product: {}", product.getName(), e);
            throw e;
        }
    }

    // Only ADMIN can delete a product
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        logger.info("DELETE /products/{} called", id);
        try {
            Product product = productService.getProductById(id);
            if (product != null) {
                productService.deleteProduct(id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Delete product failed for ID: {}", id, e);
            throw e;
        }
    }

    // Only ADMIN can update a product
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        logger.info("PUT /products/{} called", id);
        try {
            Product updatedProduct = productService.updateProduct(id, productDetails);
            if (updatedProduct != null) {
                return ResponseEntity.ok(updatedProduct);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Update product failed for ID: {}", id, e);
            throw e;
        }
    }

    // Public: anyone can view products by category
    @GetMapping("/category/{category}")
    public List<Product> getProductsByCategory(@PathVariable String category) {
        logger.info("GET /products/category/{} called", category);
        return productService.getProductsByCategory(category);
    }

    // Only ADMIN can update stock quantity
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/updateStockQuantity/{productId}")
    public void updateStockQuantity(@PathVariable Long productId, @RequestParam int quantity) {
        logger.info("PUT /products/updateStockQuantity/{} called with quantity: {}", productId, quantity);
        try {
            productService.updateStockQuantity(productId, quantity);
        } catch (Exception e) {
            logger.error("Update stock quantity failed for product ID: {} with quantity: {}", productId, quantity, e);
            throw e;
        }
    }

    // Allow order service to update stock during order placement
    @PutMapping("/order/updateStockQuantity/{productId}")
    public ResponseEntity<String> updateStockForOrder(@PathVariable Long productId, @RequestParam int quantity) {
        logger.info("PUT /products/order/updateStockQuantity/{} called with quantity: {}", productId, quantity);
        try {
            productService.updateStockQuantity(productId, quantity);
            return ResponseEntity.ok("Stock updated successfully for order");
        } catch (RuntimeException e) {
            logger.error("Update stock for order failed for product ID: {} with quantity: {}", productId, quantity, e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ADMIN: Analytics - product count
    @GetMapping("/admin/analytics/count")
    @PreAuthorize("hasRole('ADMIN')")
    public long getProductCount() {
        logger.info("GET /products/admin/analytics/count called");
        return productService.getProductCount();
    }
    
    // Public: Search products by name
    @GetMapping("/search")
    public List<Product> searchProductsByName(@RequestParam String name) {
        logger.info("GET /products/search called with name: {}", name);
        return productService.searchProductsByName(name);
    }
    
    // Public: Get products by price range
    @GetMapping("/price-range")
    public List<Product> getProductsByPriceRange(@RequestParam Double minPrice, @RequestParam Double maxPrice) {
        logger.info("GET /products/price-range called with minPrice: {} and maxPrice: {}", minPrice, maxPrice);
        return productService.getProductsByPriceRange(minPrice, maxPrice);
    }
    
    // Public: Get products by category and price range
    @GetMapping("/category-price-range")
    public List<Product> getProductsByCategoryAndPriceRange(@RequestParam String category, 
                                                           @RequestParam Double minPrice, 
                                                           @RequestParam Double maxPrice) {
        logger.info("GET /products/category-price-range called with category: {}, minPrice: {}, maxPrice: {}", category, minPrice, maxPrice);
        return productService.getProductsByCategoryAndPriceRange(category, minPrice, maxPrice);
    }
    
    // Public: Get products in stock
    @GetMapping("/in-stock")
    public List<Product> getProductsInStock() {
        logger.info("GET /products/in-stock called");
        return productService.getProductsInStock();
    }
    
    // Public: Advanced search with multiple criteria
    @GetMapping("/advanced-search")
    public List<Product> advancedSearch(@RequestParam(required = false) String name,
                                       @RequestParam(required = false) String category,
                                       @RequestParam(required = false) Double minPrice,
                                       @RequestParam(required = false) Double maxPrice,
                                       @RequestParam(required = false) Boolean inStock) {
        logger.info("GET /products/advanced-search called with name: {}, category: {}, minPrice: {}, maxPrice: {}, inStock: {}", name, category, minPrice, maxPrice, inStock);
        return productService.searchProducts(name, category, minPrice, maxPrice, inStock);
    }

    // Only ADMIN can add multiple products at once
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/bulk")
    public List<Product> saveProductsBulk(@RequestBody List<Product> products) {
        logger.info("POST /products/bulk called with {} products", products.size());
        try {
            return productService.saveProductsBulk(products);
        } catch (Exception e) {
            logger.error("Save products bulk failed for {} products", products.size(), e);
            throw e;
        }
    }
}
