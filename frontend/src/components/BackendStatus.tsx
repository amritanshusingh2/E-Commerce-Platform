import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../utils/api';

const StatusContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const StatusOnline = styled(StatusContainer)`
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
`;

const StatusOffline = styled(StatusContainer)`
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
`;

const BackendStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        // Try to access a simple endpoint
        await api.get('/actuator/health');
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };

    checkBackendStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isOnline === null) {
    return null; // Don't show anything while checking
  }

  if (isOnline) {
    return (
      <StatusOnline>
        ✓ Backend Online
      </StatusOnline>
    );
  }

  return (
    <StatusOffline>
      ✗ Backend Offline - Please start backend services
    </StatusOffline>
  );
};

export default BackendStatus; 