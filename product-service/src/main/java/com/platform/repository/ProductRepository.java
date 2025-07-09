package com.platform.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.platform.entity.Product;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Custom query method to find products by category   
    List<Product> findByCategory(String category);
    
    // Search products by name containing keyword
    List<Product> findByNameContainingIgnoreCase(String name);
    
    // Find products by price range
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);
    
    // Find products by category and price range
    List<Product> findByCategoryAndPriceBetween(String category, Double minPrice, Double maxPrice);
    
    // Find products with stock quantity greater than specified value
    List<Product> findByStockQuantityGreaterThan(int quantity);
    
    // Custom search query with multiple criteria
    @Query("SELECT p FROM Product p WHERE " +
           "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:inStock IS NULL OR p.stockQuantity > 0)")
    List<Product> searchProducts(@Param("name") String name, 
                                @Param("category") String category,
                                @Param("minPrice") Double minPrice,
                                @Param("maxPrice") Double maxPrice,
                                @Param("inStock") Boolean inStock);
}
