import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaComments } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

// Animated background gradient
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(3deg); }
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
    animation: ${floatAnimation} 7s ease-in-out infinite;
  }

  &::before {
    width: 220px;
    height: 220px;
    top: 15%;
    left: 8%;
    animation-delay: 0s;
  }

  &::after {
    width: 160px;
    height: 160px;
    top: 65%;
    right: 8%;
    animation-delay: 3.5s;
  }
`;

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 2rem 1.5rem;
`;

const ContactHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const ContactTitle = styled.h1`
  font-size: 3.5rem;
  color: #222;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-shadow: none;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ContactSubtitle = styled.p`
  font-size: 1.3rem;
  color: #666;
  font-weight: 400;
`;

const ContactContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ContactInfo = styled.div`
  background: #fff;
  padding: 3rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(44,62,80,0.10);
  border: 1.5px solid #e0e0e0;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(44,62,80,0.13);
  }
`;

const ContactForm = styled.div`
  background: #fff;
  padding: 3rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(44,62,80,0.10);
  border: 1.5px solid #e0e0e0;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(44,62,80,0.13);
  }
`;

const SectionTitle = styled.h2`
  color: #222;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;

  &:hover {
    background: #fff;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ContactIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.5rem;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const ContactDetails = styled.div`
  h3 {
    color: #222;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    font-weight: 700;
  }
  p {
    color: #666;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 50px;
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
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px 12px 50px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
  color: #222;
  min-height: 120px;
  resize: vertical;
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
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  font-size: 1.2rem;
  z-index: 1;
`;

const TextareaIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 20px;
  color: #667eea;
  font-size: 1.2rem;
  z-index: 1;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #c3e6cb;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 600;
`;

const MapContainer = styled.div`
  margin-top: 3rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(44,62,80,0.10);
  border: 1.5px solid #e0e0e0;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(44,62,80,0.13);
  }
`;

const MapFrame = styled.iframe`
  width: 100%;
  height: 300px;
  border: none;
`;

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://localhost:8020/notifications/contact', formData);
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      alert('Failed to send message. Please try again later.');
    }
    setIsLoading(false);
  };

  return (
    <PageBackground>
      <ContactContainer>
        <ContactHeader>
          <ContactTitle>Contact Us</ContactTitle>
          <ContactSubtitle>We'd love to hear from you! Reach out with any questions, feedback, or partnership opportunities.</ContactSubtitle>
        </ContactHeader>
        <ContactContent>
          <ContactInfo>
            <SectionTitle>Get in Touch</SectionTitle>
            
            <ContactItem>
              <ContactIcon><FaEnvelope /></ContactIcon>
              <ContactDetails>
                <h3>Email</h3>
                <p>myecommerce.test1@gmail.com</p>
                <p>We'll respond within 24 hours</p>
              </ContactDetails>
            </ContactItem>

            <ContactItem>
              <ContactIcon><FaPhone /></ContactIcon>
              <ContactDetails>
                <h3>Phone</h3>
                <p>+91 7932568790</p>
                <p>Monday - Friday, 9:00 AM - 6:00 PM IST</p>
              </ContactDetails>
            </ContactItem>

            <ContactItem>
              <ContactIcon><FaMapMarkerAlt /></ContactIcon>
              <ContactDetails>
                <h3>Address</h3>
                <p>Cognizant CDC</p>
                <p>Phase 3, Plot # 26, MIDC, Hinjewadi</p>
                <p>Rajiv Gandhi Infotech Park, Hinjawadi</p>
                <p>Pimpri-Chinchwad, Maharashtra 411057, India</p>
              </ContactDetails>
            </ContactItem>

                         <ContactItem>
               <ContactIcon><FaEnvelope /></ContactIcon>
               <ContactDetails>
                 <h3>Business Hours</h3>
                 <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                 <p>Saturday: 10:00 AM - 4:00 PM</p>
                 <p>Sunday: Closed</p>
               </ContactDetails>
             </ContactItem>
          </ContactInfo>

          <ContactForm>
            <SectionTitle>Send us a Message</SectionTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <InputIcon><FaUser /></InputIcon>
                <FormInput
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? 'error' : ''}
                />
              </FormGroup>

              <FormGroup>
                <InputIcon><FaUser /></InputIcon>
                <FormInput
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? 'error' : ''}
                />
              </FormGroup>

              <FormGroup>
                <InputIcon><FaEnvelope /></InputIcon>
                <FormInput
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                />
              </FormGroup>

                              <FormGroup>
                 <InputIcon><FaEnvelope /></InputIcon>
                 <FormInput
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={errors.subject ? 'error' : ''}
                />
              </FormGroup>

              <FormGroup>
                <TextareaIcon><FaComments /></TextareaIcon>
                <FormTextarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={errors.message ? 'error' : ''}
                />
              </FormGroup>

              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? 'Sending Message...' : 'Send Message'}
              </SubmitButton>
            </Form>
          </ContactForm>
        </ContactContent>

        <MapContainer>
          <MapFrame
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.1754300000003!2d73.72421999999999!3d18.562499999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c103e68b5555%3A0x1d3a3a3a3a3a3a3a!2sCognizant%20CDC%2C%20Hinjewadi%2C%20Pune!5e0!3m2!1sen!2sin!4v1630456321547!5m2!1sen!2sin"
            allowFullScreen={false}
            loading="lazy"
          />
        </MapContainer>
      </ContactContainer>
    </PageBackground>
  );
};

export default Contact; 