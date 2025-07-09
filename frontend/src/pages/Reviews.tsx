import React, { useState } from 'react';
import { FaStar, FaUser, FaCalendar, FaThumbsUp } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import styled, { keyframes } from 'styled-components';

// Animated background gradient
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
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
    animation: ${floatAnimation} 6s ease-in-out infinite;
  }

  &::before {
    width: 200px;
    height: 200px;
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }

  &::after {
    width: 150px;
    height: 150px;
    top: 60%;
    right: 10%;
    animation-delay: 3s;
  }
`;

const ReviewsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 2rem 1.5rem;
`;

const ReviewsHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const ReviewsTitle = styled.h1`
  font-size: 3.5rem;
  color: #222;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-shadow: none;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ReviewsSubtitle = styled.p`
  font-size: 1.3rem;
  color: #666;
  font-weight: 400;
`;

const ReviewsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ReviewCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(44,62,80,0.10);
  padding: 2.5rem 2rem;
  margin: 2rem 0;
  color: #222;
  border: 1.5px solid #e0e0e0;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 15px 40px rgba(44,62,80,0.13);
  }
`;

const ReviewTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: none;
`;

const ReviewForm = styled.div`
  background: #fff;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(44,62,80,0.10);
  height: fit-content;
  position: sticky;
  top: 2rem;
  border: 1.5px solid #e0e0e0;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(44,62,80,0.13);
  }
`;

const FormTitle = styled.h2`
  color: #222;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const ReviewInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
  color: #222;
  margin-bottom: 1rem;
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

const ReviewTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
  color: #222;
  margin-bottom: 1rem;
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

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const StarButton = styled.button<{ $filled: boolean }>`
  background: none;
  border: none;
  font-size: 1.8rem;
  color: ${props => props.$filled ? '#ffd700' : '#ddd'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #ffd700;
    transform: scale(1.1);
  }
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

const ReviewsList = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(44,62,80,0.10);
  overflow: hidden;
  border: 1.5px solid #e0e0e0;
`;

const ReviewItem = styled.div`
  padding: 2rem;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.3s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8f9fa;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const ReviewerAvatar = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const ReviewerDetails = styled.div`
  h3 {
    color: #222;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    font-weight: 700;
  }
  p {
    color: #666;
    font-size: 14px;
    font-weight: 400;
  }
`;

const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffd700;
  font-size: 1.1rem;
`;

const ReviewDate = styled.div`
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 400;
`;

const ReviewContent = styled.div`
  color: #222;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  font-weight: 400;
`;

const ReviewActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LikeButton = styled.button<{ $liked: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.$liked ? '#667eea' : '#f8f9fa'};
  border: 1px solid ${props => props.$liked ? '#667eea' : '#e0e0e0'};
  color: ${props => props.$liked ? '#fff' : '#666'};
  cursor: pointer;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    background: #667eea;
    border-color: #667eea;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
  }
`;

const NoReviews = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  font-size: 1.1rem;
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 2.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid #e0e0e0;

  h3 {
    color: #222;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 700;
  }

  p {
    color: #666;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }

  a {
    display: inline-block;
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 700;
    transition: transform 0.3s, box-shadow 0.3s;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
    }
  }
`;

const ReviewUser = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 0.3rem;
`;

const ReviewProduct = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.3rem;
`;

const ReviewText = styled.p`
  color: #333;
  font-size: 1rem;
  margin-bottom: 0.8rem;
  font-weight: 400;
  line-height: 1.6;
`;

const ReviewLikes = styled.div`
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

interface Review {
  id: number;
  productName: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  liked: boolean;
}

const Reviews: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      productName: "Wireless Headphones",
      reviewerName: "John Doe",
      rating: 5,
      comment: "Excellent quality and great sound! The battery life is amazing and the comfort level is top-notch. Highly recommend!",
      date: "2024-01-15",
      likes: 12,
      liked: false
    },
    {
      id: 2,
      productName: "Smart Watch",
      reviewerName: "Jane Smith",
      rating: 4,
      comment: "Great features and good battery life. The only downside is the screen could be a bit brighter in sunlight.",
      date: "2024-01-10",
      likes: 8,
      liked: true
    },
    {
      id: 3,
      productName: "Laptop Stand",
      reviewerName: "Mike Johnson",
      rating: 5,
      comment: "Perfect for my home office setup. Sturdy construction and adjustable height. Exactly what I was looking for!",
      date: "2024-01-08",
      likes: 15,
      liked: false
    }
  ]);

  const [formData, setFormData] = useState({
    productName: '',
    rating: 0,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productName || !formData.rating || !formData.comment) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newReview: Review = {
        id: reviews.length + 1,
        productName: formData.productName,
        reviewerName: user?.firstName + ' ' + user?.lastName || 'Anonymous',
        rating: formData.rating,
        comment: formData.comment,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        liked: false
      };

      setReviews([newReview, ...reviews]);
      setFormData({ productName: '', rating: 0, comment: '' });
      setIsSubmitting(false);
      alert('Review submitted successfully!');
    }, 1000);
  };

  const handleLike = (reviewId: number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            likes: review.liked ? review.likes - 1 : review.likes + 1,
            liked: !review.liked 
          }
        : review
    ));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar key={index} color={index < rating ? '#ffd700' : '#ddd'} />
    ));
  };

  return (
    <PageBackground>
      <ReviewsContainer>
        <ReviewsHeader>
          <ReviewsTitle>Product Reviews</ReviewsTitle>
          <ReviewsSubtitle>See what our customers are saying and share your own experience!</ReviewsSubtitle>
        </ReviewsHeader>
        <ReviewsContent>
          <ReviewForm>
            <FormTitle>Write a Review</FormTitle>
            {!isAuthenticated ? (
              <LoginPrompt>
                <h3>Please Login</h3>
                <p>You need to be logged in to write a review.</p>
                <a href="/login">Login</a>
              </LoginPrompt>
            ) : (
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <ReviewInput
                    type="text"
                    name="productName"
                    placeholder="Product Name"
                    value={formData.productName}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label style={{ display: 'block', marginBottom: '0.8rem', color: '#222', fontWeight: '600', fontSize: '1rem' }}>
                    Rating
                  </label>
                  <RatingContainer>
                    {Array.from({ length: 5 }, (_, index) => (
                      <StarButton
                        key={index}
                        type="button"
                        $filled={index < formData.rating}
                        onClick={() => handleRatingChange(index + 1)}
                      >
                        <FaStar />
                      </StarButton>
                    ))}
                    <span style={{ color: '#666', marginLeft: '0.8rem', fontWeight: '500' }}>
                      {formData.rating > 0 ? `${formData.rating}/5` : 'Select rating'}
                    </span>
                  </RatingContainer>
                </FormGroup>

                <FormGroup>
                  <ReviewTextarea
                    name="comment"
                    placeholder="Share your experience with this product..."
                    value={formData.comment}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </SubmitButton>
              </Form>
            )}
          </ReviewForm>

          <ReviewsList>
            {reviews.length === 0 ? (
              <NoReviews>
                <h3>No reviews yet</h3>
                <p>Be the first to share your experience!</p>
              </NoReviews>
            ) : (
              reviews.map((review) => (
                <ReviewItem key={review.id}>
                  <ReviewHeader>
                    <ReviewerInfo>
                      <ReviewerAvatar>
                        {review.reviewerName.charAt(0)}
                      </ReviewerAvatar>
                      <ReviewerDetails>
                        <h3>{review.reviewerName}</h3>
                        <p>{review.productName}</p>
                      </ReviewerDetails>
                    </ReviewerInfo>
                    <ReviewDate>
                      <FaCalendar />
                      {review.date}
                    </ReviewDate>
                  </ReviewHeader>

                  <ReviewRating>
                    {renderStars(review.rating)}
                    <span style={{ color: '#666', marginLeft: '0.8rem', fontWeight: '500' }}>
                      {review.rating}/5
                    </span>
                  </ReviewRating>

                  <ReviewContent>
                    {review.comment}
                  </ReviewContent>

                  <ReviewActions>
                    <LikeButton
                      $liked={review.liked}
                      onClick={() => handleLike(review.id)}
                    >
                      <FaThumbsUp />
                      {review.likes} {review.likes === 1 ? 'like' : 'likes'}
                    </LikeButton>
                  </ReviewActions>
                </ReviewItem>
              ))
            )}
          </ReviewsList>
        </ReviewsContent>
      </ReviewsContainer>
    </PageBackground>
  );
};

export default Reviews; 