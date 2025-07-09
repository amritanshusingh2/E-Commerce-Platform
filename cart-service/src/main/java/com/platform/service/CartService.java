package com.platform.service;

import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Autowired;
import com.platform.repository.CartRepository;
import com.platform.entity.CartItem;
import com.platform.model.ProductDTO;
import com.platform.feign.ProductClient;
import java.util.Optional;
import java.util.List;
import com.platform.model.CartItemRequest;
import com.platform.model.CartSummary;
import com.platform.model.CartItemDTO;
import java.util.ArrayList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CartService {

    private static final Logger logger = LoggerFactory.getLogger(CartService.class);

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductClient productClient;

    public List<CartItemDTO> getCartItemsByUserId(Long userId) {
        logger.info("Getting cart items by user ID: {}", userId);
        try {
            List<CartItem> items = cartRepository.findByUserId(userId);
            List<CartItemDTO> dtos = new ArrayList<>();
            for (CartItem item : items) {
                ProductDTO product;
                try {
                    product = productClient.getProductById(item.getProductId());
                } catch (Exception e) {
                    continue; // Skip if product does not exist
                }
                if (product == null || product.getStockQuantity() <= 0) {
                    continue; // Skip if product does not exist or is out of stock
                }
                CartItemDTO dto = new CartItemDTO();
                dto.setId(item.getCartItemid());
                dto.setProductId(item.getProductId());
                dto.setProductName(product.getName());
                dto.setPrice(product.getPrice());
                dto.setQuantity(item.getQuantity());
                dto.setImageUrl(product.getImageUrl()); // if available
                dtos.add(dto);
            }
            return dtos;
        } catch (Exception e) {
            logger.error("Get cart items by user ID failed for user ID: {}", userId, e);
            throw e;
        }
    }

    public CartItem addCartItem(CartItemRequest request, Long userId) {
        logger.info("Adding cart item for user ID: {} with product ID: {}", userId, request.getProductId());
        try {
            Optional<CartItem> existingItem = cartRepository.findByUserIdAndProductId(userId, request.getProductId());
            ProductDTO product = productClient.getProductById(request.getProductId());
            if (product == null) {
                throw new RuntimeException("Product does not exist");
            }
            if (product.getStockQuantity() < request.getQuantity() || product.getStockQuantity() <= 0) {
                throw new RuntimeException("Product is out of stock");
            }
            double pricePerUnit = product.getPrice();
            if (existingItem.isPresent()) {
                CartItem item = existingItem.get();
                int newQuantity = item.getQuantity() + request.getQuantity();
                if (product.getStockQuantity() < newQuantity) {
                    throw new RuntimeException("Not enough stock for the requested quantity");
                }
                item.setQuantity(newQuantity);
                item.setTotalPrice(newQuantity * pricePerUnit);
                logger.info("Cart item updated for user ID: {} with product ID: {}", userId, request.getProductId());
                return cartRepository.save(item);
            } else {
                CartItem newItem = new CartItem();
                newItem.setUserId(userId);
                newItem.setProductId(request.getProductId());
                newItem.setQuantity(request.getQuantity());
                newItem.setTotalPrice(request.getQuantity() * pricePerUnit);
                logger.info("New cart item added for user ID: {} with product ID: {}", userId, request.getProductId());
                return cartRepository.save(newItem);
            }
        } catch (Exception e) {
            logger.error("Add cart item failed for user ID: {} with product ID: {}", userId, request.getProductId(), e);
            throw e;
        }
    }

    public void removeCartItem(Long cartItemId) {
        logger.info("Removing cart item with ID: {}", cartItemId);
        try {
            Optional<CartItem> existingItem = cartRepository.findById(cartItemId);
            if (existingItem.isPresent()) {
                CartItem Item = existingItem.get();
                int currQuantity = Item.getQuantity();
                if (currQuantity > 1) {
                    Item.setQuantity(currQuantity - 1);
                    ProductDTO product = productClient.getProductById(Item.getProductId());
                    double pricePerUnit = product.getPrice();
                    Item.setTotalPrice((currQuantity - 1) * pricePerUnit);
                    cartRepository.save(Item);
                    logger.info("Cart item quantity reduced for cart item ID: {}", cartItemId);
                } else {
                    cartRepository.deleteById(cartItemId);
                    logger.info("Cart item deleted for cart item ID: {}", cartItemId);
                }
            } else {
                throw new RuntimeException("Cart item not found with id: " + cartItemId);
            }
        } catch (Exception e) {
            logger.error("Remove cart item failed for cart item ID: {}", cartItemId, e);
            throw e;
        }
    }

    public double calculateTotalPrice(Long userId) {
        logger.info("Calculating total price for user ID: {}", userId);
        try {
            List<CartItem> items = cartRepository.findByUserId(userId);
            return items.stream()
                    .mapToDouble(CartItem::getTotalPrice)
                    .sum();
        } catch (Exception e) {
            logger.error("Calculate total price failed for user ID: {}", userId, e);
            throw e;
        }
    }

    public CartSummary getCartSummary(Long userId) {
        logger.info("Getting cart summary for user ID: {}", userId);
        try {
            List<CartItem> items = cartRepository.findByUserId(userId);
            double totalPrice = items.stream()
                    .mapToDouble(CartItem::getTotalPrice)
                    .sum();
            int totalItems = items.stream()
                    .mapToInt(CartItem::getQuantity)
                    .sum();
            int uniqueProducts = items.size();
            
            return new CartSummary(totalPrice, totalItems, uniqueProducts);
        } catch (Exception e) {
            logger.error("Get cart summary failed for user ID: {}", userId, e);
            throw e;
        }
    }

    public void clearCart(Long userId) {
        logger.info("Clearing cart for user ID: {}", userId);
        try {
            List<CartItem> items = cartRepository.findByUserId(userId);
            if (items.isEmpty()) {
                throw new RuntimeException("Cart is already empty for user with id: " + userId);
            }
            cartRepository.deleteAll(items);
            logger.info("Cart cleared successfully for user ID: {}", userId);
        } catch (Exception e) {
            logger.error("Clear cart failed for user ID: {}", userId, e);
            throw e;
        }
    }

    public CartItem updateCartItemQuantity(Long cartItemId, int quantity) {
        logger.info("Updating cart item quantity for cart item ID: {} with quantity: {}", cartItemId, quantity);
        try {
            Optional<CartItem> itemOpt = cartRepository.findById(cartItemId);
            if (itemOpt.isPresent()) {
                CartItem item = itemOpt.get();
                if (quantity <= 0) {
                    cartRepository.deleteById(cartItemId);
                    logger.info("Cart item deleted due to zero quantity for cart item ID: {}", cartItemId);
                    return null;
                }
                ProductDTO product = productClient.getProductById(item.getProductId());
                if (product == null) {
                    throw new RuntimeException("Product does not exist");
                }
                if (product.getStockQuantity() < quantity) {
                    throw new RuntimeException("Not enough stock for the requested quantity");
                }
                item.setQuantity(quantity);
                item.setTotalPrice(quantity * product.getPrice());
                logger.info("Cart item quantity updated for cart item ID: {}", cartItemId);
                return cartRepository.save(item);
            } else {
                throw new RuntimeException("Cart item not found with id: " + cartItemId);
            }
        } catch (Exception e) {
            logger.error("Update cart item quantity failed for cart item ID: {} with quantity: {}", cartItemId, quantity, e);
            throw e;
        }
    }

    public void removeCartItemsByProductId(Long productId) {
        logger.info("Removing cart items by product ID: {}", productId);
        try {
            cartRepository.deleteByProductId(productId);
            logger.info("Cart items removed successfully for product ID: {}", productId);
        } catch (Exception e) {
            logger.error("Remove cart items by product ID failed for product ID: {}", productId, e);
            throw e;
        }
    }
}
