import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    color: #667eea;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  p {
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }

  a {
    color: #bdc3c7;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #667eea;
    }
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #bdc3c7;

  svg {
    margin-right: 0.5rem;
    color: #667eea;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  text-decoration: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #34495e;
  margin-top: 2rem;
  padding-top: 1rem;
  text-align: center;
  color: #bdc3c7;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>GenC Cart</h3>
          <p>
            Your one-stop destination for all your shopping needs. We provide high-quality products 
            with excellent customer service and fast delivery.
          </p>
          <SocialLinks>
            <SocialLink href="#" aria-label="Facebook">
              <FaFacebook />
            </SocialLink>
            <SocialLink href="#" aria-label="Twitter">
              <FaTwitter />
            </SocialLink>
            <SocialLink href="#" aria-label="Instagram">
              <FaInstagram />
            </SocialLink>
            <SocialLink href="#" aria-label="LinkedIn">
              <FaLinkedin />
            </SocialLink>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Customer Service</h3>
          <ul>
            <li><a href="/contact#help-center">Help Center</a></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Contact Information</h3>
          <ContactInfo>
            <FaEnvelope />
            <a href="mailto:myecommerce.test1@gmail.com">myecommerce.test1@gmail.com</a>
          </ContactInfo>
          <ContactInfo>
            <FaPhone />
            <a href="tel:+917932568790">+91 7932568790</a>
          </ContactInfo>
          <ContactInfo>
            <FaMapMarkerAlt />
            <div>
              <p>Cognizant CDC</p>
              <p>Phase 3, Plot # 26, MIDC, Hinjewadi</p>
              <p>Rajiv Gandhi Infotech Park, Hinjawadi</p>
              <p>Pimpri-Chinchwad, Maharashtra 411057, India</p>
            </div>
          </ContactInfo>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <p>&copy; 2024 GenC Cart. All rights reserved. | Designed with ❤️ for our customers</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer; 