import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTruck, FaCheckCircle, FaTimesCircle, FaEye, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const OrdersContainer = styled.div`
  padding: 2rem 0;
  background: #f8f9fa;
  min-height: 80vh;
`;

const OrdersContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const OrdersTitle = styled.h1`
  font-size: 3rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const OrdersTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 12px 24px;
  background: ${props => props.$active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.$active ? 'white' : '#333'};
  border: 2px solid ${props => props.$active ? 'transparent' : '#e1e5e9'};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
  }
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  overflow: hidden;
`;

const OrderHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
  }
`;

const OrderInfo = styled.div`
  h3 {
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }
  p {
    color: #666;
    font-size: 14px;
    margin: 0.25rem 0;
  }
  @media (max-width: 600px) {
    h3 {
      font-size: 1rem;
    }
    p {
      font-size: 12px;
    }
  }
`;

const OrderStatus = styled.div<{ $status: string }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.$status) {
      case 'PENDING': return 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
      case 'CONFIRMED': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'SHIPPED': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'DELIVERED': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'CANCELLED': return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
      default: return 'linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)';
    }
  }};
  color: ${props => props.$status === 'PENDING' ? '#333' : 'white'};
  @media (max-width: 600px) {
    font-size: 10px;
    padding: 6px 10px;
  }
`;

const OrderItems = styled.div`
  padding: 1.5rem;
`;

const OrderItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 0.5rem 0;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemDetails = styled.div`
  h4 {
    color: #333;
    margin-bottom: 0.25rem;
  }

  p {
    color: #666;
    font-size: 14px;
  }
`;

const ItemPrice = styled.div`
  text-align: right;
  font-weight: 600;
  color: #667eea;
`;

const OrderTotal = styled.div`
  padding: 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #eee;
  text-align: right;

  h4 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  .total {
    font-size: 1.5rem;
    font-weight: bold;
    color: #667eea;
  }
`;

const CheckoutForm = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;

  h3 {
    color: #333;
    margin-bottom: 1rem;
    border-bottom: 2px solid #667eea;
    padding-bottom: 0.5rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 600;
  }

  input, textarea, select {
    width: 100%;
    padding: 12px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
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

const EmptyState = styled.div`
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

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 3rem;
`;

interface Order {
  orderId: number;
  userId: number;
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
  orderItems: OrderItem[];
  shippingAddress: string;
  paymentStatus: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  shippedAt?: string;
  deliveredAt?: string;
  paymentMethod?: string;
  transactionId?: string;
}

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checkout' | 'history'>('checkout');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    shippingAddress: '',
    paymentMethod: 'COD',
    specialInstructions: '',
    // UPI fields
    upiId: '',
    // Card fields
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
    // Net banking fields
    bankName: ''
  });
  const { token, isAuthenticated } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:8020';

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchOrders();
    }
  }, [isAuthenticated, token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/order/user/details`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Orders data received:', response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!checkoutData.shippingAddress.trim()) {
      toast.error('Please enter shipping address');
      return;
    }

    // Validate payment method specific fields
    if (checkoutData.paymentMethod === 'UPI' && !checkoutData.upiId.trim()) {
      toast.error('Please select a UPI app');
      return;
    }

    if (checkoutData.paymentMethod === 'CARD') {
      if (!checkoutData.cardNumber.trim()) {
        toast.error('Please enter card number');
        return;
      }
      if (!checkoutData.cardHolderName.trim()) {
        toast.error('Please enter card holder name');
        return;
      }
      if (!checkoutData.expiryDate.trim()) {
        toast.error('Please enter expiry date');
        return;
      }
      if (!checkoutData.cvv.trim()) {
        toast.error('Please enter CVV');
        return;
      }
    }

    if (checkoutData.paymentMethod === 'NET_BANKING' && !checkoutData.bankName.trim()) {
      toast.error('Please select a bank');
      return;
    }

    try {
      setLoading(true);
      const orderRequest = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: checkoutData.shippingAddress,
        paymentInfo: {
          paymentMethod: checkoutData.paymentMethod,
          upiId: checkoutData.paymentMethod === 'UPI' ? checkoutData.upiId : undefined,
          cardNumber: checkoutData.paymentMethod === 'CARD' ? checkoutData.cardNumber : undefined,
          cardHolderName: checkoutData.paymentMethod === 'CARD' ? checkoutData.cardHolderName : undefined,
          expiryDate: checkoutData.paymentMethod === 'CARD' ? checkoutData.expiryDate : undefined,
          cvv: checkoutData.paymentMethod === 'CARD' ? checkoutData.cvv : undefined,
          bankName: checkoutData.paymentMethod === 'NET_BANKING' ? checkoutData.bankName : undefined
        }
      };

      const response = await axios.post(`${API_BASE_URL}/order/create`, orderRequest, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Order placed successfully!');
      await clearCart();
      setCheckoutData({
        shippingAddress: '',
        paymentMethod: 'COD',
        specialInstructions: '',
        upiId: '',
        cardNumber: '',
        cardHolderName: '',
        expiryDate: '',
        cvv: '',
        bankName: ''
      });
      setActiveTab('history');
      await fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <FaClock />;
      case 'CONFIRMED': return <FaCheckCircle />;
      case 'SHIPPED': return <FaTruck />;
      case 'DELIVERED': return <FaCheckCircle />;
      case 'CANCELLED': return <FaTimesCircle />;
      default: return <FaClock />;
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

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return 'Invalid Date';
    }
  };

  if (!isAuthenticated) {
    return (
      <OrdersContainer>
        <OrdersContent>
          <EmptyState>
            <FaShoppingCart />
            <h2>Please Login</h2>
            <p>You need to be logged in to view your orders.</p>
            <button onClick={() => navigate('/login')} style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Login
            </button>
          </EmptyState>
        </OrdersContent>
      </OrdersContainer>
    );
  }

  return (
    <OrdersContainer>
      <OrdersContent>
        <OrdersTitle>My Orders</OrdersTitle>

        <OrdersTabs>
          <TabButton 
            $active={activeTab === 'checkout'} 
            onClick={() => setActiveTab('checkout')}
          >
            Checkout ({cartItems.length} items)
          </TabButton>
          <TabButton 
            $active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
          >
            Order History ({Array.isArray(orders) ? orders.length : 0})
          </TabButton>
        </OrdersTabs>

        {activeTab === 'checkout' && (
          <>
            {cartItems.length === 0 ? (
              <EmptyState>
                <FaShoppingCart />
                <h2>Your cart is empty</h2>
                <p>Add some products to your cart to proceed with checkout.</p>
                <button onClick={() => navigate('/products')} style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  Browse Products
                </button>
              </EmptyState>
            ) : (
              <CheckoutForm>
                <FormSection>
                  <h3>Order Summary</h3>
                  <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                    <p><strong>Items:</strong> {cartItems.length}</p>
                    <p><strong>Total:</strong> ₹{getCartTotal()}</p>
                  </div>
                </FormSection>

                <FormSection>
                  <h3>Shipping Information</h3>
                  <FormGroup>
                    <label>Shipping Address</label>
                    <textarea
                      value={checkoutData.shippingAddress}
                      onChange={(e) => setCheckoutData({...checkoutData, shippingAddress: e.target.value})}
                      placeholder="Enter your complete shipping address..."
                      required
                    />
                  </FormGroup>
                </FormSection>

                <FormSection>
                  <h3>Payment & Additional Information</h3>
                  <FormGrid>
                    <FormGroup>
                      <label htmlFor="paymentMethod">Payment Method</label>
                      <select
                        id="paymentMethod"
                        value={checkoutData.paymentMethod}
                        onChange={(e) => setCheckoutData({...checkoutData, paymentMethod: e.target.value})}
                      >
                        <option value="COD">Cash on Delivery</option>
                        <option value="UPI">UPI Payment</option>
                        <option value="CARD">Credit/Debit Card</option>
                        <option value="NET_BANKING">Net Banking</option>
                      </select>
                    </FormGroup>
                    <FormGroup>
                      <label>Special Instructions (Optional)</label>
                      <textarea
                        value={checkoutData.specialInstructions}
                        onChange={(e) => setCheckoutData({...checkoutData, specialInstructions: e.target.value})}
                        placeholder="Any special delivery instructions..."
                      />
                    </FormGroup>
                  </FormGrid>

                  {/* UPI Payment Fields */}
                  {checkoutData.paymentMethod === 'UPI' && (
                    <FormGrid>
                      <FormGroup>
                        <label htmlFor="upiId">UPI ID</label>
                        <select
                          id="upiId"
                          value={checkoutData.upiId}
                          onChange={(e) => setCheckoutData({...checkoutData, upiId: e.target.value})}
                        >
                          <option value="">Select UPI App</option>
                          <option value="gpay@okicici">Google Pay</option>
                          <option value="paytm@paytm">Paytm</option>
                          <option value="phonepe@ybl">PhonePe</option>
                          <option value="amazonpay@apl">Amazon Pay</option>
                          <option value="bhim@upi">BHIM</option>
                        </select>
                      </FormGroup>
                    </FormGrid>
                  )}

                  {/* Card Payment Fields */}
                  {checkoutData.paymentMethod === 'CARD' && (
                    <FormGrid>
                      <FormGroup>
                        <label>Card Number</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={checkoutData.cardNumber}
                          onChange={(e) => setCheckoutData({...checkoutData, cardNumber: e.target.value})}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Card Holder Name</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={checkoutData.cardHolderName}
                          onChange={(e) => setCheckoutData({...checkoutData, cardHolderName: e.target.value})}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={checkoutData.expiryDate}
                          onChange={(e) => setCheckoutData({...checkoutData, expiryDate: e.target.value})}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={checkoutData.cvv}
                          onChange={(e) => setCheckoutData({...checkoutData, cvv: e.target.value})}
                        />
                      </FormGroup>
                    </FormGrid>
                  )}

                  {/* Net Banking Fields */}
                  {checkoutData.paymentMethod === 'NET_BANKING' && (
                    <FormGrid>
                      <FormGroup>
                        <label htmlFor="bankName">Select Bank</label>
                        <select
                          id="bankName"
                          value={checkoutData.bankName}
                          onChange={(e) => setCheckoutData({...checkoutData, bankName: e.target.value})}
                        >
                          <option value="">Select Bank</option>
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                          <option value="State Bank of India">State Bank of India</option>
                          <option value="Axis Bank">Axis Bank</option>
                          <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                          <option value="Punjab National Bank">Punjab National Bank</option>
                        </select>
                      </FormGroup>
                    </FormGrid>
                  )}
                </FormSection>

                <CheckoutButton onClick={handleCheckout} disabled={loading}>
                  {loading ? 'Processing...' : `Place Order - ₹${getCartTotal()}`}
                </CheckoutButton>
              </CheckoutForm>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <>
            {loading ? (
              <LoadingSpinner>
                <div className="spinner"></div>
              </LoadingSpinner>
            ) : orders.length === 0 ? (
              <EmptyState>
                <FaShoppingCart />
                <h2>No Orders Yet</h2>
                <p>You haven't placed any orders yet. Start shopping to see your order history.</p>
                <button onClick={() => navigate('/products')} style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  Browse Products
                </button>
              </EmptyState>
            ) : (
              (Array.isArray(orders) ? orders : []).map((order) => (
                <OrderCard key={order.orderId}>
                  <OrderHeader>
                    <OrderInfo>
                      <h3>Order #{order.orderId}</h3>
                      <p>Date: {formatDate(order.createdAt)}</p>
                      <p>Payment: {order.paymentStatus} ({order.paymentMethod})</p>
                      {order.transactionId && (
                        <p>Transaction ID: {order.transactionId}</p>
                      )}
                      {order.trackingNumber && order.trackingNumber !== 'TBD' && (
                        <p>Tracking: {order.trackingNumber} ({order.carrier})</p>
                      )}
                      {order.estimatedDelivery && (
                        <p>Estimated Delivery: {formatDate(order.estimatedDelivery)}</p>
                      )}
                      {order.shippedAt && (
                        <p>Shipped: {formatDate(order.shippedAt)}</p>
                      )}
                      {order.deliveredAt && (
                        <p>Delivered: {formatDate(order.deliveredAt)}</p>
                      )}
                      <p>Address: {order.shippingAddress}</p>
                    </OrderInfo>
                    <OrderStatus $status={order.orderStatus}>
                      {getStatusIcon(order.orderStatus)} {order.orderStatus}
                    </OrderStatus>
                  </OrderHeader>

                  <OrderItems>
                    {(order.orderItems || []).map((item, index) => (
                      <OrderItem key={index}>
                        <ItemImage src={getProductImage(item.productId)} alt={item.productName} />
                        <ItemDetails>
                          <h4>{item.productName}</h4>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: ₹{item.price}</p>
                        </ItemDetails>
                        <ItemPrice>₹{item.totalPrice}</ItemPrice>
                      </OrderItem>
                    ))}
                  </OrderItems>

                  <OrderTotal>
                    <h4>Total Amount</h4>
                    <div className="total">₹{order.totalPrice}</div>
                  </OrderTotal>
                </OrderCard>
              ))
            )}
          </>
        )}
      </OrdersContent>
    </OrdersContainer>
  );
};

export default Orders; 