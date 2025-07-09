import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaArrowRight, FaTruck, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import axios from 'axios';
import styled from 'styled-components';

const PageBackground = styled.div`
  min-height: 100vh;
  background: #fff;
  color: #222;
`;

const HeroSection = styled.section`
  background: #fff;
  color: #222;
  padding: 0 0 3rem 0;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 80px 20px 0 20px;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
  color: #222;
  text-shadow: none;
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 2rem;
  color: #444;
  opacity: 1;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  border: none;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
  &:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
  }
`;

const OutlineButton = styled(Link)`
  display: inline-block;
  padding: 15px 30px;
  background: #fff;
  color: #667eea;
  border: 2px solid #764ba2;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.3s, color 0.3s, transform 0.3s;
  &:hover {
    background: #764ba2;
    color: #fff;
    transform: translateY(-2px) scale(1.03);
  }
`;

const FeaturesSection = styled.section`
  padding: 4rem 0;
  background: #fff;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ProductsSubtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 2.5rem 1.5rem 2rem 1.5rem;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 6px 24px rgba(44,62,80,0.10);
  border: 1.5px solid #e0e0e0;
  transition: transform 0.3s, box-shadow 0.3s;
  &:hover {
    transform: translateY(-5px) scale(1.03);
    box-shadow: 0 15px 40px rgba(44,62,80,0.13);
  }
  svg {
    font-size: 3rem;
    color: #667eea;
    margin-bottom: 1rem;
  }
  h3 {
    margin-bottom: 1rem;
    color: #223;
    font-size: 1.25rem;
    font-weight: 700;
  }
  p {
    color: #666;
    line-height: 1.6;
  }
`;

const ProductsSection = styled.section`
  padding: 4rem 0;
  background: linear-gradient(135deg, #181824 0%, #23243a 100%);
`;

const SectionTitle = styled.h2<{ color?: string }>`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: ${({ color }) => color || '#fff'};
  font-weight: 700;
  text-shadow: ${({ color }) => color === '#fff' ? '0 2px 8px rgba(0,0,0,0.4)' : 'none'};
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ProductCard = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(44,62,80,0.10);
  border: 1.5px solid #e0e0e0;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
  &:hover {
    transform: translateY(-5px) scale(1.03);
    box-shadow: 0 15px 40px rgba(44,62,80,0.13);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductName = styled.h3`
  margin-bottom: 0.5rem;
  color: #223;
  font-size: 1.25rem;
  font-weight: 700;
`;

const ProductPrice = styled.p`
  font-size: 1.15rem;
  font-weight: 700;
  color: #2d3e50;
  margin-bottom: 1rem;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #ffd700;
`;

const ViewMoreButton = styled.div`
  text-align: center;
  margin-top: 3rem;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
  }
`;

// Add or update these for future search/filter boxes
const SearchInput = styled.div`
  position: relative;
  input {
    width: 100%;
    padding: 12px 45px 12px 16px;
    border: 2px solid #23243a;
    border-radius: 8px;
    font-size: 16px;
    background: #fff;
    color: #222;
    transition: all 0.3s ease;
    &::placeholder {
      color: #888;
      opacity: 1;
    }
    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      background: #fff;
    }
  }
  svg {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #667eea;
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid #23243a;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
  color: #222;
  cursor: pointer;
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: #fff;
  }
  option {
    background: #fff;
    color: #222;
  }
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductDescription = styled.p`
  color: #444;
  font-size: 1rem;
  margin-bottom: 1rem;
  min-height: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8020/products');
        // Get first 6 products as featured
        setFeaturedProducts(response.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  return (
    <PageBackground>
      <HeroSection>
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Hero" style={{ width: '100%', maxHeight: '320px', objectFit: 'cover', borderRadius: '0 0 32px 32px' }} />
        <HeroContent>
          <HeroTitle>Welcome to GenC Cart</HeroTitle>
          <HeroSubtitle>
            Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast delivery!
          </HeroSubtitle>
          <HeroButtons>
            <PrimaryButton to="/products">
              <FaShoppingCart style={{ marginRight: '8px' }} />
              Shop Now
            </PrimaryButton>
            <OutlineButton to="/register">Join Us</OutlineButton>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <div className="container">
          <SectionTitle color="#222">Why Choose GenC Cart?</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FaTruck />
              <h3>Fast Delivery</h3>
              <p>Get your orders delivered within 24-48 hours with our express shipping service.</p>
            </FeatureCard>
            <FeatureCard>
              <FaShieldAlt />
              <h3>Secure Shopping</h3>
              <p>Your data is protected with bank-level security and encrypted transactions.</p>
            </FeatureCard>
            <FeatureCard>
              <FaHeadset />
              <h3>24/7 Support</h3>
              <p>Our customer support team is available round the clock to help you.</p>
            </FeatureCard>
          </FeaturesGrid>
        </div>
      </FeaturesSection>

      <ProductsSection>
        <SectionTitle>Featured Products</SectionTitle>
        <ProductsGrid>
          {featuredProducts.map((product) => (
            <ProductCard key={product.productId}>
              <ProductImage src={product.imageUrl ? product.imageUrl : getProductImage(product.productId)} alt={product.name} />
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductDescription>{product.description}</ProductDescription>
                <ProductPrice>₹{product.price}</ProductPrice>
                <ProductRating>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </ProductRating>
                <CTAButton to={`/products/${product.productId}`}>View Details <FaArrowRight style={{ marginLeft: '8px' }} /></CTAButton>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductsGrid>
        <ViewMoreButton>
          <CTAButton to="/products">View All Products</CTAButton>
        </ViewMoreButton>
      </ProductsSection>
    </PageBackground>
  );
};

export default Home; 