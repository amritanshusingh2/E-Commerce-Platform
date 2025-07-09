import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const CartContainer = styled.div`
  padding: 2rem 0;
  background: #f8f9fa;
  min-height: 80vh;
`;

const CartHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const CartTitle = styled.h1`
  font-size: 3rem;
  color: #333;
  margin-bottom: 1rem;
`;

const CartContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemInfo = styled.div`
  h3 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    font-size: 14px;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid #e1e5e9;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  height: 32px;
  text-align: center;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  font-size: 14px;
`;

const ItemPrice = styled.div`
  text-align: right;

  .price {
    font-size: 1.2rem;
    font-weight: bold;
    color: #667eea;
  }

  .total {
    font-size: 1rem;
    color: #666;
    margin-top: 0.25rem;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #fdf2f2;
  }
`;

const CartSummary = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  height: fit-content;
  position: sticky;
  top: 2rem;
`;

const SummaryTitle = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
    font-weight: bold;
    font-size: 1.2rem;
    color: #667eea;
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  svg {
    font-size: 4rem;
    color: #667eea;
    margin-bottom: 1rem;
  }

  h2 {
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    margin-bottom: 2rem;
  }
`;

const ContinueShoppingButton = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
`;

const ClearCartButton = styled.button`
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(250, 112, 154, 0.4);
  }
`;

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      await updateQuantity(cartItemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Navigate to checkout or order creation
    navigate('/orders');
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const getProductImage = (productId: number) => {
    const images = [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ];
    return images[productId % images.length];
  };

  if (isLoading) {
    return (
      <CartContainer>
        <div className="spinner"></div>
      </CartContainer>
    );
  }

  if (cartItems.length === 0) {
    return (
      <CartContainer>
        <div className="container">
          <EmptyCart>
            <FaShoppingCart />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <ContinueShoppingButton to="/products">
              <FaArrowLeft style={{ marginRight: '8px' }} />
              Continue Shopping
            </ContinueShoppingButton>
          </EmptyCart>
        </div>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <div className="container">
        <CartHeader>
          <CartTitle>Shopping Cart</CartTitle>
        </CartHeader>

        <CartContent>
          <CartItems>
            {cartItems.map((item) => (
              <CartItem key={item.id}>
                <ItemImage src={item.imageUrl ? item.imageUrl : getProductImage(item.productId)} alt={item.productName} />
                <ItemInfo>
                  <h3>{item.productName}</h3>
                  <p>Product ID: {item.productId}</p>
                </ItemInfo>
                <QuantityControl>
                  <QuantityButton
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FaMinus />
                  </QuantityButton>
                  <QuantityInput
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                    min="1"
                  />
                  <QuantityButton
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <FaPlus />
                  </QuantityButton>
                </QuantityControl>
                <ItemPrice>
                  <div className="price">₹{item.price}</div>
                  <div className="total">Total: ₹{item.price * item.quantity}</div>
                </ItemPrice>
                <RemoveButton onClick={() => removeFromCart(item.id)}>
                  <FaTrash />
                </RemoveButton>
              </CartItem>
            ))}
          </CartItems>

          <CartSummary>
            <SummaryTitle>Order Summary</SummaryTitle>
            <SummaryRow>
              <span>Items ({cartItems.length})</span>
              <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Subtotal</span>
              <span>₹{getCartTotal()}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Shipping</span>
              <span>Free</span>
            </SummaryRow>
            <SummaryRow>
              <span>Total</span>
              <span>₹{getCartTotal()}</span>
            </SummaryRow>

            <CheckoutButton onClick={handleCheckout}>
              Proceed to Checkout
            </CheckoutButton>

            <ClearCartButton onClick={handleClearCart}>
              Clear Cart
            </ClearCartButton>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/products" style={{ color: '#667eea', textDecoration: 'none' }}>
                <FaArrowLeft style={{ marginRight: '8px' }} />
                Continue Shopping
              </Link>
            </div>
          </CartSummary>
        </CartContent>
      </div>
    </CartContainer>
  );
};

export default Cart; 