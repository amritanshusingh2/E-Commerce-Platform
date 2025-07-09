import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../utils/api';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Dark theme styled components
const PageTitle = styled(Typography)`
  color: #fff !important;
  font-weight: 700 !important;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  background: linear-gradient(45deg, #fff, #f0f0f0);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StyledTableContainer = styled(TableContainer)`
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border-radius: 16px !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
  overflow: hidden;

  .MuiTableCell-root {
    color: #fff !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  }

  .MuiTableHead-root .MuiTableCell-root {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%) !important;
    backdrop-filter: blur(10px);
    font-weight: 600 !important;
  }

  .MuiTableRow-root:hover {
    background: rgba(255, 255, 255, 0.05) !important;
  }
` as typeof TableContainer;

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background: linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%) !important;
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff !important;
    border-radius: 16px !important;
  }

  .MuiDialogTitle-root {
    color: #fff !important;
    font-weight: 600 !important;
  }

  .MuiTextField-root {
    .MuiInputLabel-root {
      color: rgba(255, 255, 255, 0.7) !important;
    }
    
    .MuiOutlinedInput-root {
      .MuiOutlinedInput-notchedOutline {
        border-color: rgba(255, 255, 255, 0.2) !important;
      }
      
      &:hover .MuiOutlinedInput-notchedOutline {
        border-color: rgba(255, 255, 255, 0.3) !important;
      }
      
      &.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: #667eea !important;
      }
    }
    
    .MuiInputBase-input {
      color: #fff !important;
    }
  }

  .MuiMenuItem-root {
    color: #fff !important;
    background: rgba(255, 255, 255, 0.05) !important;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1) !important;
    }
    
    &.Mui-selected {
      background: rgba(102, 126, 234, 0.2) !important;
    }
  }
`;

const StyledButton = styled(Button)`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%) !important;
  color: #fff !important;
  border: 1px solid rgba(102, 126, 234, 0.3) !important;
  backdrop-filter: blur(5px);
  
  &:hover {
    background: linear-gradient(135deg, rgba(102, 126, 234, 1) 0%, rgba(118, 75, 162, 1) 100%) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const SecondaryButton = styled(Button)`
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.8) 0%, rgba(0, 242, 254, 0.8) 100%) !important;
  color: #fff !important;
  border: 1px solid rgba(79, 172, 254, 0.3) !important;
  backdrop-filter: blur(5px);
  
  &:hover {
    background: linear-gradient(135deg, rgba(79, 172, 254, 1) 0%, rgba(0, 242, 254, 1) 100%) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const navigate = useNavigate();

  const isDelivered = formData.status === 'DELIVERED';
  const isPaymentValid = formData.paymentStatus === 'PAID';
  const startsWithTBD = (val: string) => val && val.trim().toUpperCase().startsWith('TBD');
  const isTrackingValid = formData.trackingNumber && formData.trackingNumber.trim() !== '' && !startsWithTBD(formData.trackingNumber);
  const isCarrierValid = formData.carrier && formData.carrier.trim() !== '' && !startsWithTBD(formData.carrier);
  const canSave = !isDelivered || (isPaymentValid && isTrackingValid && isCarrierValid);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/order/admin/all');
      setOrders(res.data);
    } catch (e) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleEdit = (order: any) => {
    setEditingOrder(order);
    setFormData({
      status: order.orderStatus,
      paymentStatus: order.paymentStatus,
      trackingNumber: order.trackingNumber || '',
      carrier: order.carrier || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await api.delete(`/order/admin/${id}`);
      toast.success('Order deleted');
      fetchOrders();
    } catch (e) {
      toast.error('Failed to delete order');
    }
  };

  const handleSave = async () => {
    if (!editingOrder) return;
    if (isDelivered) {
      const errors: any = {};
      if (!isPaymentValid) errors.paymentStatus = 'Payment must be PAID for delivered orders.';
      if (!isTrackingValid) errors.trackingNumber = 'Tracking number required for delivered orders.';
      if (!isCarrierValid) errors.carrier = 'Carrier required for delivered orders.';
      setValidationErrors(errors);
      if (Object.keys(errors).length > 0) return;
    } else {
      setValidationErrors({});
    }
    setSaving(true);
    try {
      // 1. Update tracking/courier info first if changed
      if (
        formData.trackingNumber && formData.carrier &&
        (formData.trackingNumber !== editingOrder.trackingNumber || formData.carrier !== editingOrder.carrier)
      ) {
        await api.put(`/order/tracking/${editingOrder.orderId}?trackingNumber=${formData.trackingNumber}&carrier=${formData.carrier}`);
      }
      // 2. Update payment status if changed
      if (formData.paymentStatus !== editingOrder.paymentStatus) {
        await api.put(`/order/payment/${editingOrder.orderId}?status=${formData.paymentStatus}`);
      }
      // 3. Update order status last if changed
      if (formData.status !== editingOrder.orderStatus) {
        await api.put(`/order/status/${editingOrder.orderId}?status=${formData.status}`);
      }
      toast.success('Order updated');
      setModalOpen(false);
      fetchOrders();
    } catch (e: any) {
      console.error('Order update error:', e);
      toast.error('Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsDelivered = async () => {
    if (!editingOrder) return;
    try {
      await api.put(`/order/delivered/${editingOrder.orderId}`);
      toast.success('Order marked as delivered');
      setModalOpen(false);
      fetchOrders();
    } catch (e) {
      toast.error('Failed to mark as delivered');
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <StyledButton 
          variant="contained" 
          onClick={() => navigate('/admin/dashboard')} 
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </StyledButton>
        <PageTitle variant="h4" fontWeight={700}>Order Management</PageTitle>
      </Box>
      
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>User Email</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.userId}</TableCell>
                <TableCell>{order.userEmail}</TableCell>
                <TableCell>₹{order.totalPrice}</TableCell>
                <TableCell>{order.orderStatus}</TableCell>
                <TableCell>{order.paymentStatus}</TableCell>
                <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</TableCell>
                <TableCell>
                  <IconButton 
                    sx={{ 
                      color: '#667eea',
                      '&:hover': { 
                        background: 'rgba(102, 126, 234, 0.1)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s ease',
                    }} 
                    onClick={() => handleEdit(order)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    sx={{ 
                      color: '#ff6b6b',
                      '&:hover': { 
                        background: 'rgba(255, 107, 107, 0.1)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s ease',
                    }} 
                    onClick={() => handleDelete(order.orderId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
      
      {/* Order Edit Modal */}
      <StyledDialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Edit Order</DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <TextField 
            select 
            label="Status" 
            fullWidth 
            margin="normal" 
            value={formData.status || ''} 
            onChange={e => setFormData({ ...formData, status: e.target.value })}
          >
            <MenuItem value="PENDING">PENDING</MenuItem>
            <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
            <MenuItem value="SHIPPED">SHIPPED</MenuItem>
            <MenuItem value="DELIVERED">DELIVERED</MenuItem>
            <MenuItem value="CANCELLED">CANCELLED</MenuItem>
          </TextField>
          <TextField 
            select 
            label="Payment Status" 
            fullWidth 
            margin="normal" 
            value={formData.paymentStatus || ''} 
            onChange={e => setFormData({ ...formData, paymentStatus: e.target.value })}
            error={!!validationErrors.paymentStatus}
            helperText={validationErrors.paymentStatus}
          >
            <MenuItem value="PENDING">PENDING</MenuItem>
            <MenuItem value="PAID">PAID</MenuItem>
            <MenuItem value="FAILED">FAILED</MenuItem>
            <MenuItem value="REFUNDED">REFUNDED</MenuItem>
          </TextField>
          <TextField 
            label="Tracking Number" 
            fullWidth 
            margin="normal" 
            value={formData.trackingNumber || ''} 
            onChange={e => setFormData({ ...formData, trackingNumber: e.target.value })} 
            error={!!validationErrors.trackingNumber}
            helperText={validationErrors.trackingNumber}
          />
          <TextField 
            label="Carrier" 
            fullWidth 
            margin="normal" 
            value={formData.carrier || ''} 
            onChange={e => setFormData({ ...formData, carrier: e.target.value })} 
            error={!!validationErrors.carrier}
            helperText={validationErrors.carrier}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setModalOpen(false)}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': { color: '#fff' }
            }}
          >
            Cancel
          </Button>
          <StyledButton onClick={handleSave} variant="contained" disabled={saving || !canSave}>
            {saving ? 'Saving...' : 'Save Changes'}
          </StyledButton>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
};

export default AdminOrders; 