import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import styled from 'styled-components';

const EcomLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '10px'}}>
    <defs>
      <linearGradient id="cartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    <circle cx="18" cy="18" r="18" fill="url(#cartGradient)" fillOpacity="0.18" />
    <rect x="8" y="12" width="20" height="10" rx="3" fill="url(#cartGradient)" fillOpacity="0.7" />
    <rect x="10" y="16" width="16" height="6" rx="2" fill="#fff" fillOpacity="0.9" />
    <circle cx="13" cy="27" r="2" fill="#fff" />
    <circle cx="23" cy="27" r="2" fill="#fff" />
    <rect x="12" y="10" width="12" height="4" rx="2" fill="#fff" fillOpacity="0.7" />
  </svg>
);

const Nav = styled.nav`
  background: linear-gradient(90deg, #292a3e 0%, #35365c 100%);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  border-bottom: 3px solid #667eea;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 2rem;
  font-weight: bold;
  text-decoration: none;
  background: linear-gradient(135deg, #a084e8 0%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NavMenu = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')};
    width: 100%;
    height: calc(100vh - 70px);
    background: linear-gradient(90deg, #181824 0%, #23243a 100%);
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 2rem;
    transition: left 0.3s ease;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;

  &:hover {
    color: #a084e8;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #a084e8 0%, #667eea 100%);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const CartIcon = styled(Link)`
  position: relative;
  color: #fff;
  font-size: 1.5rem;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #a084e8;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
`;

const UserMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #a084e8;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #23243a;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  z-index: 1000;
  overflow: hidden;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  color: #fff;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #181824;
  }
`;

const LogoutButton = styled.button`
  display: block;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  color: #e74c3c;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #181824;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin, isLoading } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <Nav>
      <NavContainer>
        <LogoRow>
          <EcomLogo />
          <Logo to="/">GenC Cart</Logo>
        </LogoRow>

        <MobileMenuButton onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>

        <NavMenu $isOpen={isMenuOpen}>
          <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setIsMenuOpen(false)}>
            Products
          </NavLink>
          <NavLink to="/reviews" onClick={() => setIsMenuOpen(false)}>
            Reviews
          </NavLink>
          <NavLink to="/contact" onClick={() => setIsMenuOpen(false)}>
            Contact
          </NavLink>

          <NavActions>
            <CartIcon to="/cart" onClick={() => setIsMenuOpen(false)}>
              <FaShoppingCart />
              {getCartCount() > 0 && <CartBadge>{getCartCount()}</CartBadge>}
            </CartIcon>

            {isLoading ? null : isAuthenticated ? (
              <UserMenu>
                <UserButton onClick={toggleDropdown}>
                  <FaUser />
                </UserButton>
                {isDropdownOpen && (
                  <DropdownMenu>
                    <DropdownItem to="/profile" onClick={() => setIsDropdownOpen(false)}>
                      <FaUser style={{ marginRight: '8px' }} />
                      Profile
                    </DropdownItem>
                    <DropdownItem to="/orders" onClick={() => setIsDropdownOpen(false)}>
                      <FaShoppingCart style={{ marginRight: '8px' }} />
                      My Orders
                    </DropdownItem>
                    {isAdmin && (
                      <DropdownItem to="/admin/dashboard" onClick={() => setIsDropdownOpen(false)}>
                        <FaShieldAlt style={{ marginRight: '8px' }} />
                        Admin Panel
                      </DropdownItem>
                    )}
                    <LogoutButton onClick={handleLogout}>
                      <FaSignOutAlt style={{ marginRight: '8px' }} />
                      Logout
                    </LogoutButton>
                  </DropdownMenu>
                )}
              </UserMenu>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </NavLink>
                <NavLink to="/register" onClick={() => setIsMenuOpen(false)}>
                  Register
                </NavLink>
              </>
            )}
          </NavActions>
        </NavMenu>
      </NavContainer>
    </Nav>
  );
};

export default Navbar; 