import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import api from '../utils/api';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

// Dark theme styled components
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Paper)`
  padding: 1.5rem;
  border-radius: 16px;
  text-align: center;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  color: #fff !important;
  transition: transform 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4) !important;
  }

  .MuiTypography-h5 {
    color: #fff !important;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }

  .MuiTypography-body1 {
    color: rgba(255, 255, 255, 0.8) !important;
  }
`;

const ChartContainer = styled(Paper)`
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
  color: #fff !important;

  .MuiTypography-h6 {
    color: #fff !important;
    font-weight: 600;
    margin-bottom: 1rem;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }
`;

const PageTitle = styled(Typography)`
  color: #fff !important;
  font-weight: 700 !important;
  margin-bottom: 2rem !important;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  background: linear-gradient(45deg, #fff, #f0f0f0);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const AdminAnalytics: React.FC = () => {
  const [stats, setStats] = useState<any>({});
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const [usersRes, productsRes, ordersRes, revenueRes, pendingRes, completedRes] = await Promise.all([
        api.get('/admin/users/analytics/count'),
        api.get('/products/admin/analytics/count'),
        api.get('/order/admin/analytics/count'),
        api.get('/order/admin/orders/analytics/revenue'),
        api.get('/order/admin/orders/analytics/pending'),
        api.get('/order/admin/orders/analytics/completed'),
      ]);
      setStats({
        totalUsers: usersRes.data,
        totalProducts: productsRes.data,
        totalOrders: ordersRes.data,
        totalRevenue: revenueRes.data,
        pendingOrders: pendingRes.data,
        completedOrders: completedRes.data,
      });
      // TODO: Replace with real API call for revenue trend when available
      setRevenueTrend([
        { date: '2024-07-01', revenue: 1200 },
        { date: '2024-07-02', revenue: 1500 },
        { date: '2024-07-03', revenue: 1100 },
        { date: '2024-07-04', revenue: 1800 },
        { date: '2024-07-05', revenue: 2000 },
        { date: '2024-07-06', revenue: 1700 },
        { date: '2024-07-07', revenue: 2100 },
      ]);
    } catch (e) {
      //
    }
  };

  useEffect(() => { fetchStats(); }, []);

  // Custom chart colors for dark theme
  const chartColors = {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#4facfe',
    success: '#00c853',
    warning: '#ffd700',
    danger: '#ff6b6b',
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Button 
          variant="contained" 
          onClick={() => navigate('/admin/dashboard')} 
          sx={{ mb: 2, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)', color: '#fff', border: '1px solid rgba(102, 126, 234, 0.3)', backdropFilter: 'blur(5px)' }}
        >
          Back to Dashboard
        </Button>
        <PageTitle variant="h4" fontWeight={700} mb={3}>Advanced Analytics</PageTitle>
      </Box>
      
      <StatsGrid>
        <StatCard 
          sx={{ 
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%) !important',
          }}
        >
          <Typography variant="h5">{stats.totalUsers}</Typography>
          <Typography>Total Users</Typography>
        </StatCard>
        
        <StatCard 
          sx={{ 
            background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.8) 0%, rgba(0, 242, 254, 0.8) 100%) !important',
          }}
        >
          <Typography variant="h5">{stats.totalProducts}</Typography>
          <Typography>Total Products</Typography>
        </StatCard>
        
        <StatCard 
          sx={{ 
            background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.8) 0%, rgba(102, 126, 234, 0.8) 100%) !important',
          }}
        >
          <Typography variant="h5">{stats.totalOrders}</Typography>
          <Typography>Total Orders</Typography>
        </StatCard>
        
        <StatCard 
          sx={{ 
            background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.8) 0%, rgba(0, 242, 254, 0.8) 100%) !important',
          }}
        >
          <Typography variant="h5">₹{stats.totalRevenue}</Typography>
          <Typography>Total Revenue</Typography>
        </StatCard>
        
        <StatCard 
          sx={{ 
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.8) 0%, rgba(255, 237, 78, 0.8) 100%) !important',
          }}
        >
          <Typography variant="h5">{stats.pendingOrders}</Typography>
          <Typography>Pending Orders</Typography>
        </StatCard>
        
        <StatCard 
          sx={{ 
            background: 'linear-gradient(135deg, rgba(0, 200, 83, 0.8) 0%, rgba(67, 233, 123, 0.8) 100%) !important',
          }}
        >
          <Typography variant="h5">{stats.completedOrders}</Typography>
          <Typography>Completed Orders</Typography>
        </StatCard>
      </StatsGrid>
      
      <ChartContainer>
        <Typography variant="h6" mb={2}>Revenue Trend (Last 7 Days)</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#fff' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
            />
            <YAxis 
              tick={{ fill: '#fff' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(15, 15, 35, 0.95)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke={chartColors.primary} 
              strokeWidth={3} 
              dot={{ r: 5, fill: chartColors.primary }} 
              activeDot={{ r: 8, stroke: chartColors.primary, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      <ChartContainer>
        <Typography variant="h6" mb={2}>Order Status Breakdown</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={[
            { name: 'Pending', value: stats.pendingOrders || 0 }, 
            { name: 'Completed', value: stats.completedOrders || 0 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#fff' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
            />
            <YAxis 
              tick={{ fill: '#fff' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(15, 15, 35, 0.95)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Bar 
              dataKey="value" 
              fill={chartColors.secondary}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Box>
  );
};

export default AdminAnalytics; 