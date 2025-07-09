package com.platform.service;

import com.platform.entity.Product;
import com.platform.repository.ProductRepository;
import com.platform.feign.CartClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartClient cartClient;

    public List<Product> getAllProducts() {
        logger.info("Getting all products");
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        logger.info("Getting product by ID: {}", id);
        try {
            return productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        } catch (Exception e) {
            logger.error("Get product by ID failed for ID: {}", id, e);
            throw e;
        }
    }

    public Product saveProduct(Product product) {
        logger.info("Saving product: {}", product.getName());
        try {
            return productRepository.save(product);
        } catch (Exception e) {
            logger.error("Save product failed for product: {}", product.getName(), e);
            throw e;
        }
    }

    public void deleteProduct(Long id) {
        logger.info("Deleting product with ID: {}", id);
        try {
            // Remove product from all carts before deleting
            cartClient.deleteCartItemsByProductId(id);
            productRepository.deleteById(id);
            logger.info("Product deleted successfully: {}", id);
        } catch (Exception e) {
            logger.error("Delete product failed for ID: {}", id, e);
            throw e;
        }
    }

    public Product updateProduct(Long id, Product productDetails) {
        logger.info("Updating product with ID: {}", id);
        try {
            Product product = productRepository.findById(id).orElse(null);
            if (product != null) {
                product.setName(productDetails.getName());
                product.setDescription(productDetails.getDescription());
                product.setPrice(productDetails.getPrice());
                product.setCategory(productDetails.getCategory());
                product.setImageUrl(productDetails.getImageUrl());
                product.setStockQuantity(productDetails.getStockQuantity());
                // Ensure stock quantity is not negative
                if (product.getStockQuantity() < 0) {
                    throw new RuntimeException("Stock quantity cannot be negative");
                }
                // Remove from all carts if stock is zero
                if (product.getStockQuantity() == 0) {
                    cartClient.deleteCartItemsByProductId(product.getProductId());
                }
                logger.info("Product updated successfully: {}", id);
                return productRepository.save(product);
            }
            return null;
        } catch (Exception e) {
            logger.error("Update product failed for ID: {}", id, e);
            throw e;
        }
    }

    public List<Product> getProductsByCategory(String category) {
        logger.info("Getting products by category: {}", category);
        return productRepository.findByCategory(category);
    }

    public void updateStockQuantity(Long productId, int quantity) {
        logger.info("Updating stock quantity for product ID: {} with quantity: {}", productId, quantity);
        try {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
            
            if (quantity <= 0) {
                throw new RuntimeException("Quantity must be positive");
            }
            
            if (product.getStockQuantity() < quantity) {
                throw new RuntimeException(product.getName() + " is out of stock. Available: " + product.getStockQuantity() + ", Requested: " + quantity);
            }
            
            int newStockQuantity = product.getStockQuantity() - quantity;
            product.setStockQuantity(newStockQuantity);
            productRepository.save(product);
            
            logger.info("Stock updated for product {} (ID: {}): {} -> {}", product.getName(), productId, (product.getStockQuantity() + quantity), newStockQuantity);
        } catch (Exception e) {
            logger.error("Update stock quantity failed for product ID: {} with quantity: {}", productId, quantity, e);
            throw e;
        }
    }

    public long getProductCount() {
        logger.info("Getting product count");
        return productRepository.count();
    }
    
    // Search products by name
    public List<Product> searchProductsByName(String name) {
        logger.info("Searching products by name: {}", name);
        return productRepository.findByNameContainingIgnoreCase(name);
    }
    
    // Get products by price range
    public List<Product> getProductsByPriceRange(Double minPrice, Double maxPrice) {
        logger.info("Getting products by price range: {} - {}", minPrice, maxPrice);
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }
    
    // Get products by category and price range
    public List<Product> getProductsByCategoryAndPriceRange(String category, Double minPrice, Double maxPrice) {
        logger.info("Getting products by category: {} and price range: {} - {}", category, minPrice, maxPrice);
        return productRepository.findByCategoryAndPriceBetween(category, minPrice, maxPrice);
    }
    
    // Get products in stock
    public List<Product> getProductsInStock() {
        logger.info("Getting products in stock");
        return productRepository.findByStockQuantityGreaterThan(0);
    }
    
    // Advanced search with multiple criteria
    public List<Product> searchProducts(String name, String category, Double minPrice, Double maxPrice, Boolean inStock) {
        logger.info("Advanced search with name: {}, category: {}, minPrice: {}, maxPrice: {}, inStock: {}", name, category, minPrice, maxPrice, inStock);
        return productRepository.searchProducts(name, category, minPrice, maxPrice, inStock);
    }

    public List<Product> saveProductsBulk(List<Product> products) {
        logger.info("Saving {} products in bulk", products.size());
        try {
            return productRepository.saveAll(products);
        } catch (Exception e) {
            logger.error("Save products bulk failed for {} products", products.size(), e);
            throw e;
        }
    }
}
