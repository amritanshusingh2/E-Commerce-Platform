import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import styled from 'styled-components';

const ProductDetailContainer = styled.div`
  padding: 2rem 0;
  background: #f8f9fa;
  min-height: 80vh;
`;

const ProductContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
  margin-bottom: 2rem;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ProductInfo = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ProductName = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const ProductPrice = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 1rem;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #f39c12;
`;

const ProductStock = styled.p<{ $inStock: boolean }>`
  color: ${props => props.$inStock ? '#27ae60' : '#e74c3c'};
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ProductDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border: 2px solid #e1e5e9;
  background: white;
  border-radius: 8px;
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
  width: 80px;
  height: 40px;
  text-align: center;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 4rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 4rem;
  color: #e74c3c;
`;

interface Product {
  productId: number;
  name: string;
  price: number;
  description: string;
  category: string;
  stockQuantity: number;
  imageUrl?: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8020/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= (product?.stockQuantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product.productId, quantity);
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

  if (loading) {
    return (
      <ProductDetailContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      </ProductDetailContainer>
    );
  }

  if (error || !product) {
    return (
      <ProductDetailContainer>
        <ErrorMessage>
          <h2>{error || 'Product not found'}</h2>
          <Link to="/products" className="btn btn-primary">
            Back to Products
          </Link>
        </ErrorMessage>
      </ProductDetailContainer>
    );
  }

  return (
    <ProductDetailContainer>
      <ProductContent>
        <BackButton to="/products">
          <FaArrowLeft />
          Back to Products
        </BackButton>

        <ProductGrid>
          <ProductImage src={product.imageUrl ? product.imageUrl : getProductImage(product.productId)} alt={product.name} />
          
          <ProductInfo>
            <ProductName>{product.name}</ProductName>
            <ProductPrice>₹{product.price}</ProductPrice>
            
            <ProductRating>
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <span style={{ color: '#666', marginLeft: '8px' }}>(4.5)</span>
            </ProductRating>

            <ProductStock $inStock={product.stockQuantity > 0}>
              {product.stockQuantity > 0 
                ? 'In Stock' 
                : 'Out of Stock'
              }
            </ProductStock>

            <ProductDescription>{product.description}</ProductDescription>

            <QuantityControl>
              <QuantityButton
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </QuantityButton>
              <QuantityInput
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                min="1"
                max={product.stockQuantity}
              />
              <QuantityButton
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stockQuantity}
              >
                +
              </QuantityButton>
            </QuantityControl>

            <AddToCartButton
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
            >
              <FaShoppingCart />
              Add to Cart
            </AddToCartButton>
          </ProductInfo>
        </ProductGrid>
      </ProductContent>
    </ProductDetailContainer>
  );
};

export default ProductDetail; 