import React, { useState, useEffect } from 'react';
import { FaUsers, FaBox, FaShoppingCart, FaChartLine, FaPlus, FaEdit, FaTrash, FaEye, FaTruck, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// @ts-ignore
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';

// Dark theme styled components
const DashboardContainer = styled.div`
  padding: 2rem 0;
  background: transparent;
  min-height: 80vh;
  color: #fff;
`;

const DashboardContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
`;

const DashboardTitle = styled.h1`
  font-size: 3rem;
  color: #fff;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  background: linear-gradient(45deg, #fff, #f0f0f0);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const DashboardTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 12px 24px;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)' 
    : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? 'white' : '#fff'};
  border: 2px solid ${props => props.$active ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)'};
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    background: ${props => props.$active 
      ? 'linear-gradient(135deg, rgba(102, 126, 234, 1) 0%, rgba(118, 75, 162, 1) 100%)' 
      : 'rgba(255, 255, 255, 0.15)'};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
  transition: transform 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #667eea;
  }

  .number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #fff;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }

  .label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
  }
`;

const DataTable = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TableHeader = styled.div`
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  th {
    background: rgba(255, 255, 255, 0.05);
    font-weight: 600;
    color: #fff;
    backdrop-filter: blur(5px);
  }

  tr:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' | 'view' }>`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  background: ${props => {
    switch (props.$variant) {
      case 'edit': return 'linear-gradient(135deg, rgba(79, 172, 254, 0.8) 0%, rgba(0, 242, 254, 0.8) 100%)';
      case 'delete': return 'linear-gradient(135deg, rgba(255, 99, 132, 0.8) 0%, rgba(255, 159, 64, 0.8) 100%)';
      case 'view': return 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: white;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const Modal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }

  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    backdrop-filter: blur(5px);

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  background: ${props => {
    switch (props.$variant) {
      case 'primary': return 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)';
      case 'secondary': return 'rgba(255, 255, 255, 0.1)';
      case 'danger': return 'linear-gradient(135deg, rgba(255, 99, 132, 0.8) 0%, rgba(255, 159, 64, 0.8) 100%)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: white;
  border: 1px solid ${props => {
    switch (props.$variant) {
      case 'primary': return 'rgba(102, 126, 234, 0.3)';
      case 'secondary': return 'rgba(255, 255, 255, 0.2)';
      case 'danger': return 'rgba(255, 99, 132, 0.3)';
      default: return 'rgba(255, 255, 255, 0.2)';
    }
  }};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 8px;
  border-radius: 12px;
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
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 3rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  margin: 3rem 0 2rem 0;
`;

const FeatureCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
  padding: 2.5rem 1.5rem 2rem 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  &:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 16px 40px rgba(102, 126, 234, 0.25);
  }
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
`;

interface Product {
  productId: number;
  name: string;
  price: number;
  description: string;
  category: string;
  stockQuantity: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

interface Order {
  orderId: number;
  userId: number;
  totalAmount: number;
  status: string;
  orderDate: string;
  paymentStatus: string;
  trackingNumber?: string;
  carrier?: string;
}

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders?: number;
  completedOrders?: number;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'users' | 'orders'>('overview');
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0, completedOrders: 0 });
  const [revenueTrend, setRevenueTrend] = useState<{ date: string; revenue: number }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'product' | 'user'>('product');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const { token, isAuthenticated, isAdmin } = useAuth();
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderEditData, setOrderEditData] = useState<any>({});
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkUploadResult, setBulkUploadResult] = useState<string | null>(null);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [orderModalReadOnly, setOrderModalReadOnly] = useState(false);
  const [orderEditErrors, setOrderEditErrors] = useState<any>({});
  const [orderUpdateLoading, setOrderUpdateLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:8020';

  useEffect(() => {
    if (isAuthenticated && isAdmin && token) {
      fetchStats();
      fetchData();
    }
  }, [isAuthenticated, isAdmin, token, activeTab]);

  const fetchStats = async () => {
    try {
      const [usersRes, productsRes, ordersRes, revenueRes, pendingRes, completedRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/users/analytics/count`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/products/admin/analytics/count`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/order/admin/analytics/count`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/order/admin/orders/analytics/revenue`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/order/admin/orders/analytics/pending`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/order/admin/orders/analytics/completed`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setStats({
        totalUsers: usersRes.data,
        totalProducts: productsRes.data,
        totalOrders: ordersRes.data,
        totalRevenue: revenueRes.data,
        pendingOrders: pendingRes.data,
        completedOrders: completedRes.data
      });

      // TODO: Replace with real API call for revenue trend when available
      setRevenueTrend([
        { date: '2024-07-01', revenue: 1200 },
        { date: '2024-07-02', revenue: 1500 },
        { date: '2024-07-03', revenue: 1100 },
        { date: '2024-07-04', revenue: 1800 },
        { date: '2024-07-05', revenue: 2000 },
        { date: '2024-07-06', revenue: 1700 },
        { date: '2024-07-07', revenue: 2100 }
      ]);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      switch (activeTab) {
        case 'products':
          const productsRes = await axios.get(`${API_BASE_URL}/products`, { headers: { Authorization: `Bearer ${token}` } });
          setProducts(productsRes.data);
          break;
        case 'users':
          const usersRes = await axios.get(`${API_BASE_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
          setUsers(usersRes.data);
          break;
        case 'orders':
          const ordersRes = await axios.get(`${API_BASE_URL}/order/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
          // Map backend fields to frontend expected fields
          const mappedOrders = (ordersRes.data || []).map((order: any) => ({
            orderId: order.orderId ?? order.id ?? 'N/A',
            userId: order.userId ?? 'N/A',
            userEmail: order.userEmail ?? '',
            totalAmount: order.totalPrice ?? 'N/A',
            status: order.orderStatus ?? 'N/A',
            orderDate: order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A',
            paymentStatus: order.paymentStatus ?? 'N/A',
            trackingNumber: order.trackingNumber ?? '',
            carrier: order.carrier ?? ''
          }));
          setOrders(mappedOrders);
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (type: 'product' | 'user') => {
    setModalType(type);
    setEditingItem(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (item: any, type: 'product' | 'user') => {
    setModalType(type);
    setEditingItem(item);
    setFormData(type === 'product' ? {
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      stockQuantity: item.stockQuantity
    } : {
      username: item.username,
      email: item.email,
      firstName: item.firstName,
      lastName: item.lastName,
      roles: item.roles || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number, type: 'product' | 'user' | 'order') => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      switch (type) {
        case 'product':
          await axios.delete(`${API_BASE_URL}/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          break;
        case 'user':
          await axios.delete(`${API_BASE_URL}/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          break;
        case 'order':
          await axios.delete(`${API_BASE_URL}/order/admin/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          break;
      }
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to delete ${type}`);
    }
  };

  const handleSubmit = async () => {
    try {
      if (modalType === 'product') {
        if (editingItem) {
          await axios.put(`${API_BASE_URL}/products/${editingItem.productId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
          toast.success('Product updated successfully');
        } else {
          await axios.post(`${API_BASE_URL}/products`, formData, { headers: { Authorization: `Bearer ${token}` } });
          toast.success('Product added successfully');
        }
      } else {
        if (editingItem) {
          await axios.put(`${API_BASE_URL}/admin/users/${editingItem.id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
          toast.success('User updated successfully');
        } else {
          await axios.post(`${API_BASE_URL}/admin/users`, formData, { headers: { Authorization: `Bearer ${token}` } });
          toast.success('User added successfully');
        }
      }
      setShowModal(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${editingItem ? 'update' : 'add'} ${modalType}`);
    }
  };

  const handleOrderEdit = (order: Order) => {
    setSelectedOrder(order);
    setOrderEditData({
      status: order.status,
      paymentStatus: order.paymentStatus,
      trackingNumber: order.trackingNumber || '',
      carrier: order.carrier || ''
    });
    setOrderModalOpen(true);
  };

  const handleOrderEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderEditData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleOrderUpdate = async () => {
    if (!selectedOrder) return;
    // Validation for DELIVERED status
    if (orderEditData.status === 'DELIVERED') {
      const errors: any = {};
      if (orderEditData.paymentStatus !== 'PAID') {
        errors.paymentStatus = 'Payment status must be PAID for delivered orders.';
      }
      if (!orderEditData.trackingNumber || orderEditData.trackingNumber.trim() === '') {
        errors.trackingNumber = 'Tracking Number is required for delivered orders.';
      }
      if (!orderEditData.carrier || orderEditData.carrier.trim() === '') {
        errors.carrier = 'Carrier is required for delivered orders.';
      }
      setOrderEditErrors(errors);
      if (Object.keys(errors).length > 0) return;
    } else {
      setOrderEditErrors({});
    }
    setOrderUpdateLoading(true);
    try {
      // Update status
      if (orderEditData.status !== selectedOrder.status) {
        await axios.put(`${API_BASE_URL}/order/status/${selectedOrder.orderId}?status=${orderEditData.status}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      }
      // Update payment status
      if (orderEditData.paymentStatus !== selectedOrder.paymentStatus) {
        await axios.put(`${API_BASE_URL}/order/payment/${selectedOrder.orderId}?status=${orderEditData.paymentStatus}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      }
      // Update tracking info
      if (orderEditData.trackingNumber && orderEditData.carrier && (orderEditData.trackingNumber !== selectedOrder.trackingNumber || orderEditData.carrier !== selectedOrder.carrier)) {
        await axios.put(`${API_BASE_URL}/order/tracking/${selectedOrder.orderId}?trackingNumber=${orderEditData.trackingNumber}&carrier=${orderEditData.carrier}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      }
      toast.success('Order updated successfully');
      setOrderModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update order');
    } finally {
      setOrderUpdateLoading(false);
    }
  };

  const handleMarkAsDelivered = async () => {
    if (!selectedOrder) return;
    try {
      await axios.put(`${API_BASE_URL}/order/delivered/${selectedOrder.orderId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Order marked as delivered');
      setOrderModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to mark as delivered');
    }
  };

  const handleBulkUpload = () => {
    setBulkModalOpen(true);
    setBulkUploadResult(null);
  };

  const handleBulkFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: async (results: any) => {
        try {
          const products = results.data;
          await axios.post(`${API_BASE_URL}/products/bulk`, products, { headers: { Authorization: `Bearer ${token}` } });
          setBulkUploadResult('Bulk upload successful!');
          setBulkModalOpen(false);
          fetchData();
        } catch (error: any) {
          setBulkUploadResult(error.response?.data?.message || 'Bulk upload failed');
        }
      },
      error: (err: any) => {
        setBulkUploadResult('CSV parsing error: ' + err.message);
      }
    });
  };

  const handleRoleChange = (role: string) => {
    setFormData((prev: any) => {
      const roles = prev.roles || [];
      if (roles.includes(role)) {
        return { ...prev, roles: roles.filter((r: string) => r !== role) };
      } else {
        return { ...prev, roles: [...roles, role] };
      }
    });
  };

  const handleEditStock = (product: Product) => {
    setSelectedProduct(product);
    setNewStock(product.stockQuantity);
    setStockModalOpen(true);
  };

  const handleStockUpdate = async () => {
    if (!selectedProduct) return;
    try {
      await axios.put(`${API_BASE_URL}/products/updateStockQuantity/${selectedProduct.productId}?quantity=${newStock}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Stock updated successfully');
      setStockModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update stock');
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <DashboardContainer>
        <DashboardContent>
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2>Access Denied</h2>
            <p>You need admin privileges to access this page.</p>
          </div>
        </DashboardContent>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardContent>
        <DashboardTitle>Admin Dashboard</DashboardTitle>

        <DashboardTabs>
          <TabButton $active={activeTab === 'overview'} onClick={() => navigate('/admin/dashboard')}>
            <FaChartLine /> Overview
          </TabButton>
          <TabButton $active={activeTab === 'products'} onClick={() => navigate('/admin/products')}>
            <FaBox /> Products
          </TabButton>
          <TabButton $active={activeTab === 'users'} onClick={() => navigate('/admin/users')}>
            <FaUsers /> Users
          </TabButton>
          <TabButton $active={activeTab === 'orders'} onClick={() => navigate('/admin/orders')}>
            <FaShoppingCart /> Orders
          </TabButton>
        </DashboardTabs>

        {activeTab === 'overview' && (
          <FeatureGrid>
            <FeatureCard onClick={() => navigate('/admin/users')}>
              <span className="icon"><FaUsers /></span>
              Users
            </FeatureCard>
            <FeatureCard onClick={() => navigate('/admin/products')}>
              <span className="icon"><FaBox /></span>
              Products
            </FeatureCard>
            <FeatureCard onClick={() => navigate('/admin/orders')}>
              <span className="icon"><FaShoppingCart /></span>
              Orders
            </FeatureCard>
            <FeatureCard onClick={() => navigate('/admin/analytics')}>
              <span className="icon"><FaChartLine /></span>
              Analytics
            </FeatureCard>
          </FeatureGrid>
        )}

        {activeTab === 'products' && (
          <DataTable>
            <TableHeader>
              <h3>Product Management</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <AddButton onClick={() => handleAdd('product')}>
                  <FaPlus /> Add Product
                </AddButton>
                <AddButton onClick={handleBulkUpload}>
                  <FaPlus /> Bulk Upload
                </AddButton>
              </div>
            </TableHeader>
            {loading ? (
              <LoadingSpinner><div className="spinner"></div></LoadingSpinner>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.productId}>
                      <td>{product.productId}</td>
                      <td>{product.name}</td>
                      <td>₹{product.price}</td>
                      <td>{product.category}</td>
                      <td>{product.stockQuantity}</td>
                      <td>
                        <ActionButton $variant="edit" onClick={() => handleEdit(product, 'product')}>
                          <FaEdit /> Edit
                        </ActionButton>
                        <ActionButton $variant="delete" onClick={() => handleDelete(product.productId, 'product')}>
                          <FaTrash /> Delete
                        </ActionButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            {/* Stock Edit Modal */}
            <Modal $isOpen={stockModalOpen}>
              <ModalContent>
                <h2>Edit Stock Quantity</h2>
                {selectedProduct && (
                  <>
                    <div><b>Product:</b> {selectedProduct.name}</div>
                    <div><b>Current Stock:</b> {selectedProduct.stockQuantity}</div>
                    <FormGroup>
                      <label htmlFor="stock-quantity-input">New Stock Quantity</label>
                      <input id="stock-quantity-input" type="number" value={newStock} onChange={e => setNewStock(Number(e.target.value))} min={0} title="New Stock Quantity" placeholder="Enter new stock quantity" />
                    </FormGroup>
                    <ButtonGroup>
                      <Button $variant="primary" onClick={handleStockUpdate}>Update Stock</Button>
                      <Button $variant="secondary" onClick={() => setStockModalOpen(false)}>Cancel</Button>
                    </ButtonGroup>
                  </>
                )}
              </ModalContent>
            </Modal>
            {/* Bulk Upload Modal */}
            <Modal $isOpen={bulkModalOpen}>
              <ModalContent>
                <h2>Bulk Product Upload</h2>
                <p>Upload a CSV file with columns: name, price, description, category, stockQuantity</p>
                <label htmlFor="bulk-upload-input">CSV File</label>
                <input id="bulk-upload-input" type="file" accept=".csv" onChange={handleBulkFileChange} title="Bulk Product CSV File" />
                {bulkUploadResult && <div style={{ marginTop: '1rem', color: bulkUploadResult.includes('success') ? 'green' : 'red' }}>{bulkUploadResult}</div>}
                <ButtonGroup>
                  <Button $variant="secondary" onClick={() => setBulkModalOpen(false)}>Close</Button>
                </ButtonGroup>
              </ModalContent>
            </Modal>
          </DataTable>
        )}

        {activeTab === 'users' && (
          <DataTable>
            <TableHeader>
              <h3>User Management</h3>
              <AddButton onClick={() => handleAdd('user')}>
                <FaPlus /> Add User
              </AddButton>
            </TableHeader>
            {loading ? (
              <LoadingSpinner><div className="spinner"></div></LoadingSpinner>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Roles</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.roles.join(', ')}</td>
                      <td>
                        <ActionButton $variant="edit" onClick={() => handleEdit(user, 'user')}>
                          <FaEdit /> Edit
                        </ActionButton>
                        <ActionButton $variant="delete" onClick={() => handleDelete(user.id, 'user')}>
                          <FaTrash /> Delete
                        </ActionButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </DataTable>
        )}

        {activeTab === 'orders' && (
          <DataTable>
            <TableHeader>
              <h3>Order Management</h3>
            </TableHeader>
            {loading ? (
              <LoadingSpinner><div className="spinner"></div></LoadingSpinner>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>User ID</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.orderId}>
                      <td>{order.orderId}</td>
                      <td>{order.userId}</td>
                      <td>₹{order.totalAmount ?? 'N/A'}</td>
                      <td><StatusBadge $status={order.status ?? 'N/A'}>{order.status ?? 'N/A'}</StatusBadge></td>
                      <td>{order.paymentStatus}</td>
                      <td>{order.orderDate ?? 'N/A'}</td>
                      <td>
                        <ActionButton $variant="view" onClick={() => { setOrderModalReadOnly(true); handleOrderEdit(order); }}><FaEye /> View</ActionButton>
                        <ActionButton $variant="edit" onClick={() => { setOrderModalReadOnly(false); handleOrderEdit(order); }}><FaEdit /> Edit</ActionButton>
                        <ActionButton $variant="delete" onClick={() => handleDelete(order.orderId, 'order')}><FaTrash /> Delete</ActionButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            {/* Order Edit Modal */}
            <Modal $isOpen={orderModalOpen}>
              <ModalContent style={{ position: 'relative' }}>
                {orderUpdateLoading && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                  }}>
                    <div style={{ color: '#fff', fontSize: 24, textAlign: 'center' }}>
                      <div className="spinner" style={{ marginBottom: 16 }}></div>
                      Updating order, please wait...
                    </div>
                  </div>
                )}
                <h2>Order Details</h2>
                {selectedOrder && (
                  <>
                    <div><b>Order ID:</b> {selectedOrder.orderId}</div>
                    <div><b>User ID:</b> {selectedOrder.userId}</div>
                    <div><b>Total Amount:</b> ₹{selectedOrder.totalAmount}</div>
                    <div><b>Date:</b> {selectedOrder.orderDate}</div>
                    <FormGroup>
                      <label htmlFor="order-status-select">Status</label>
                      <select
                        id="order-status-select"
                        name="status"
                        value={orderEditData.status}
                        onChange={handleOrderEditChange}
                        title="Order Status"
                        disabled={orderModalReadOnly}
                        style={{ color: '#fff', background: '#222' }}
                      >
                        <option value="PENDING" style={{ color: '#fff', background: '#222' }}>PENDING</option>
                        <option value="CONFIRMED" style={{ color: '#fff', background: '#222' }}>CONFIRMED</option>
                        <option value="SHIPPED" style={{ color: '#fff', background: '#222' }}>SHIPPED</option>
                        <option value="DELIVERED" style={{ color: '#fff', background: '#222' }}>DELIVERED</option>
                        <option value="CANCELLED" style={{ color: '#fff', background: '#222' }}>CANCELLED</option>
                      </select>
                    </FormGroup>
                    <FormGroup>
                      <label htmlFor="order-payment-status-select">Payment Status</label>
                      <select
                        id="order-payment-status-select"
                        name="paymentStatus"
                        value={orderEditData.paymentStatus}
                        onChange={handleOrderEditChange}
                        title="Payment Status"
                        disabled={orderModalReadOnly}
                        style={{ color: '#fff', background: '#222' }}
                      >
                        <option value="PENDING" style={{ color: '#fff', background: '#222' }}>PENDING</option>
                        <option value="PAID" style={{ color: '#fff', background: '#222' }}>PAID</option>
                        <option value="FAILED" style={{ color: '#fff', background: '#222' }}>FAILED</option>
                        <option value="REFUNDED" style={{ color: '#fff', background: '#222' }}>REFUNDED</option>
                      </select>
                      {orderEditErrors.paymentStatus && <div style={{ color: 'red', fontSize: '0.9em' }}>{orderEditErrors.paymentStatus}</div>}
                    </FormGroup>
                    <FormGroup>
                      <label htmlFor="order-tracking-number-input">Tracking Number</label>
                      <input
                        id="order-tracking-number-input"
                        name="trackingNumber"
                        value={orderEditData.trackingNumber}
                        onChange={handleOrderEditChange}
                        title="Tracking Number"
                        placeholder="Enter tracking number"
                        disabled={orderModalReadOnly}
                        style={{ color: '#fff', background: '#222' }}
                      />
                      {orderEditErrors.trackingNumber && <div style={{ color: 'red', fontSize: '0.9em' }}>{orderEditErrors.trackingNumber}</div>}
                    </FormGroup>
                    <FormGroup>
                      <label htmlFor="order-carrier-input">Carrier</label>
                      <input
                        id="order-carrier-input"
                        name="carrier"
                        value={orderEditData.carrier}
                        onChange={handleOrderEditChange}
                        title="Carrier"
                        placeholder="Enter carrier name"
                        disabled={orderModalReadOnly}
                        style={{ color: '#fff', background: '#222' }}
                      />
                      {orderEditErrors.carrier && <div style={{ color: 'red', fontSize: '0.9em' }}>{orderEditErrors.carrier}</div>}
                    </FormGroup>
                    <ButtonGroup>
                      <Button $variant="secondary" onClick={() => setOrderModalOpen(false)} disabled={orderUpdateLoading}>Cancel</Button>
                      {!orderModalReadOnly && (
                        <Button $variant="primary" onClick={handleOrderUpdate} disabled={orderUpdateLoading}>
                          {orderUpdateLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      )}
                    </ButtonGroup>
                  </>
                )}
              </ModalContent>
            </Modal>
          </DataTable>
        )}

        <Modal $isOpen={showModal}>
          <ModalContent>
            <h3>{editingItem ? 'Edit' : 'Add'} {modalType === 'product' ? 'Product' : 'User'}</h3>
            
            {modalType === 'product' ? (
              <>
                <FormGroup>
                  <label htmlFor="name">Product Name</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter product name"
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="price">Price</label>
                  <input
                    id="price"
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    placeholder="Enter price"
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter product description"
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="category">Category</label>
                  <input
                    id="category"
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="Enter category"
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="stockQuantity">Stock Quantity</label>
                  <input
                    id="stockQuantity"
                    type="number"
                    value={formData.stockQuantity || ''}
                    onChange={(e) => setFormData({...formData, stockQuantity: parseInt(e.target.value)})}
                    placeholder="Enter stock quantity"
                  />
                </FormGroup>
              </>
            ) : (
              <>
                <FormGroup>
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    value={formData.username || ''}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="Enter username"
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email"
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Enter first name"
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Enter last name"
                  />
                </FormGroup>
                <FormGroup>
                  <label>User Roles</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.roles?.includes('ROLE_USER')}
                        onChange={() => handleRoleChange('ROLE_USER')}
                      />
                      User
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.roles?.includes('ROLE_ADMIN')}
                        onChange={() => handleRoleChange('ROLE_ADMIN')}
                      />
                      Admin
                    </label>
                  </div>
                </FormGroup>
                {!editingItem && (
                  <FormGroup>
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      type="password"
                      value={formData.password || ''}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Enter password"
                    />
                  </FormGroup>
                )}
              </>
            )}

            <ButtonGroup>
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
              <Button $variant="primary" onClick={handleSubmit}>
                {editingItem ? 'Update' : 'Add'}
              </Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default AdminDashboard; 