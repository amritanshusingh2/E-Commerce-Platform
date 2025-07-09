import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaStar, FaShoppingCart, FaEye } from 'react-icons/fa';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import styled, { keyframes } from 'styled-components';

// Animated background gradient
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
`;

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const PageBackground = styled.div`
  min-height: 100vh;
  background: #fff;
  color: #222;
`;

const FloatingOrbs = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: ${floatAnimation} 8s ease-in-out infinite;
  }

  &::before {
    width: 250px;
    height: 250px;
    top: 5%;
    left: 5%;
    animation-delay: 0s;
  }

  &::after {
    width: 180px;
    height: 180px;
    top: 70%;
    right: 5%;
    animation-delay: 4s;
  }
`;

const LogoBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 2rem 0 1rem 0;
  justify-content: center;
`;

const GenCLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="20" fill="url(#logoGradient)" fillOpacity="0.3" />
    <rect x="10" y="10" width="20" height="20" rx="6" fill="url(#logoGradient)" fillOpacity="0.6" />
    <path d="M15 25L25 15M15 15L25 25" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="20" cy="20" r="3" fill="#fff" fillOpacity="0.9" />
  </svg>
);

const GenCName = styled.span`
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: #222;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ProductsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 2rem 1.5rem;
`;

const ProductsHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const ProductsTitle = styled.h1`
  font-size: 3.5rem;
  color: #222;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-shadow: none;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ProductsSubtitle = styled.p`
  font-size: 1.3rem;
  color: #666;
  font-weight: 400;
`;

const FiltersSection = styled.div`
  background: #fff;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(44,62,80,0.10);
  margin-bottom: 3rem;
  border: 1.5px solid #e0e0e0;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(44,62,80,0.13);
  }
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1.5rem;
  align-items: center;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const SearchInput = styled.div`
  position: relative;
  input {
    width: 100%;
    padding: 12px 45px 12px 16px;
    border: 2px solid #e0e0e0;
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
    font-size: 1.2rem;
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
  color: #222;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;

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

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ProductCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(44,62,80,0.10);
  border: 1.5px solid #e0e0e0;
  padding: 0;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px) scale(1.03);
    box-shadow: 0 15px 40px rgba(44,62,80,0.13);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: all 0.3s ease;
  
  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div`
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.h3`
  margin-bottom: 0.8rem;
  color: #222;
  font-size: 1.4rem;
  font-weight: 700;
  text-align: center;
`;

const ProductPrice = styled.p`
  font-size: 1.3rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 1rem;
  text-align: center;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #ffd700;
  font-size: 1.1rem;
`;

const ProductStock = styled.p<{ color?: string }>`
  color: ${props => props.color || '#666'};
  font-size: 14px;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: ${props => props.color === '#00c853' ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 107, 107, 0.1)'};
  border: 1px solid ${props => props.color === '#00c853' ? 'rgba(0, 200, 83, 0.3)' : 'rgba(255, 107, 107, 0.3)'};
`;

const ProductActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: auto;
`;

const ViewButton = styled(Link)`
  flex: 1;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  text-align: center;
  font-weight: 700;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  padding: 12px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 20px rgba(79, 172, 254, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(79, 172, 254, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    background: #ccc;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 4rem;
  color: #666;
  font-size: 1.2rem;
  font-weight: 500;
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 4rem;
  color: #666;
  font-size: 1.2rem;
  background: #f8f9fa;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
`;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
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

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8020/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'stock':
          return b.stockQuantity - a.stockQuantity;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const getCategories = () => {
    const categories = [...new Set(products.map(product => product.category))];
    return categories;
  };

  const handleAddToCart = async (productId: number) => {
    await addToCart(productId, 1);
  };

  const fallbackImageUrl = 'https://via.placeholder.com/300x250?text=No+Image';

  const getImageSrc = (url?: string) => {
    if (!url) return fallbackImageUrl;
    try {
      // Only encode if not already encoded
      const encodedUrl = url.includes('%2B') ? url : url.replace(/\+/g, '%2B');
      return encodedUrl;
    } catch {
      return fallbackImageUrl;
    }
  };

  if (loading) {
    return (
      <PageBackground>
        <LoadingSpinner>Loading...</LoadingSpinner>
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <ProductsContainer>
        <ProductsHeader>
          <ProductsTitle>All Products</ProductsTitle>
          <ProductsSubtitle>Browse our wide range of products and find your favorites!</ProductsSubtitle>
        </ProductsHeader>
        <FiltersSection>
          <FilterRow>
            <SearchInput>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch />
            </SearchInput>
            <label style={{ position: 'relative' }}>
              <VisuallyHidden>Category Filter</VisuallyHidden>
              <FilterSelect value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                <option value="">All Categories</option>
                {getCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </FilterSelect>
            </label>
            <label style={{ position: 'relative' }}>
              <VisuallyHidden>Sort By</VisuallyHidden>
              <FilterSelect value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="stock">Sort by Stock</option>
              </FilterSelect>
            </label>
          </FilterRow>
        </FiltersSection>
        <ProductsGrid>
          {filteredProducts.length === 0 && !loading && (
            <NoProducts>
              <h3>No products found</h3>
              <p>Try adjusting your search criteria</p>
            </NoProducts>
          )}
          {filteredProducts.map((product) => (
            <ProductCard key={product.productId}>
              <ProductImage
                src={getImageSrc(product.imageUrl)}
                alt={product.name}
                onError={e => { (e.currentTarget as HTMLImageElement).src = fallbackImageUrl; }}
              />
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <p style={{ color: '#666', fontSize: '1rem', marginBottom: '0.8rem', textAlign: 'center', minHeight: '2.5em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {product.description}
                </p>
                <ProductPrice>₹{product.price}</ProductPrice>
                <ProductRating>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </ProductRating>
                <ProductStock color={product.stockQuantity > 0 ? '#00c853' : '#ff6b6b'}>
                  {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                </ProductStock>
                <ProductActions>
                  <ViewButton to={`/products/${product.productId}`}>
                    <FaEye /> View
                  </ViewButton>
                  <AddToCartButton
                    onClick={() => handleAddToCart(product.productId)}
                    disabled={product.stockQuantity === 0}
                    title={product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  >
                    <FaShoppingCart /> Add to Cart
                  </AddToCartButton>
                </ProductActions>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductsGrid>
        {loading && <LoadingSpinner>Loading...</LoadingSpinner>}
      </ProductsContainer>
    </PageBackground>
  );
};

export default Products; 