package com.platform.entity;
import jakarta.persistence.*;

@Entity
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartItemid;
    private Long userId;
    private Long productId;
    private int quantity;
    private double totalPrice;

    public Long getCartItemid() {
        return cartItemid;
    }
    public void setCartItemid(Long cartItemid) {
        this.cartItemid = cartItemid;
    }   
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Long getProductId() {
        return productId;
    }
    public void setProductId(Long productId) {  
        this.productId = productId; 
    }
    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    public double getTotalPrice() {
        return totalPrice;
    }
    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }
    // @Override
    // public String toString() {
    //     return "CartItem{" +
    //             "cartItemid=" + cartItemid +
    //             ", userId=" + userId +
    //             ", productId=" + productId +
    //             ", quantity=" + quantity +
    //             ", totalPrice=" + totalPrice +
    //             '}';
    // }
}
