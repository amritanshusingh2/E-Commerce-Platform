import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Checkbox, FormControlLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
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

  .MuiFormControlLabel-root {
    color: #fff !important;
    
    .MuiCheckbox-root {
      color: rgba(255, 255, 255, 0.7) !important;
      
      &.Mui-checked {
        color: #667eea !important;
      }
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

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (e) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({ ...user, roles: user.roles || [] });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (e) {
      toast.error('Failed to delete user');
    }
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

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    if (!editingUser) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else {
        const hasUpper = /[A-Z]/.test(formData.password);
        const hasLower = /[a-z]/.test(formData.password);
        const hasDigit = /[0-9]/.test(formData.password);
        const hasSpecial = /[^a-zA-Z0-9]/.test(formData.password);
        if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
          newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      if (editingUser) {
        await api.put(`/admin/users/${editingUser.id}`, formData);
        toast.success('User updated');
      } else {
        await api.post('/admin/users', formData);
        toast.success('User added');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (e) {
      toast.error('Failed to save user');
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
        <PageTitle variant="h4" fontWeight={700}>User Management</PageTitle>
        <StyledButton 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => { 
            setEditingUser(null); 
            setFormData({ roles: ['ROLE_USER'] }); 
            setModalOpen(true); 
          }}
        >
          Add User
        </StyledButton>
      </Box>
      
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.roles?.join(', ')}</TableCell>
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
                    onClick={() => handleEdit(user)}
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
                    onClick={() => handleDelete(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
      
      <StyledDialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <TextField 
            label="Username" 
            fullWidth 
            margin="normal" 
            value={formData.username || ''} 
            onChange={e => setFormData({ ...formData, username: e.target.value })} 
            autoComplete="new-username"
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField 
            label="Email" 
            fullWidth 
            margin="normal" 
            value={formData.email || ''} 
            onChange={e => setFormData({ ...formData, email: e.target.value })} 
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField 
            label="First Name" 
            fullWidth 
            margin="normal" 
            value={formData.firstName || ''} 
            onChange={e => setFormData({ ...formData, firstName: e.target.value })} 
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField 
            label="Last Name" 
            fullWidth 
            margin="normal" 
            value={formData.lastName || ''} 
            onChange={e => setFormData({ ...formData, lastName: e.target.value })} 
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          {!editingUser && (
            <TextField 
              label="Password" 
              type="password" 
              fullWidth 
              margin="normal" 
              value={formData.password || ''} 
              onChange={e => setFormData({ ...formData, password: e.target.value })} 
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password}
            />
          )}
          <Box mt={2} mb={1}>
            <Typography fontWeight={600} sx={{ color: '#fff' }}>Roles</Typography>
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={formData.roles?.includes('ROLE_USER')} 
                  onChange={() => handleRoleChange('ROLE_USER')} 
                />
              } 
              label="User" 
            />
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={formData.roles?.includes('ROLE_ADMIN')} 
                  onChange={() => handleRoleChange('ROLE_ADMIN')} 
                />
              } 
              label="Admin" 
            />
          </Box>
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
          <StyledButton onClick={handleSave} variant="contained">
            Save
          </StyledButton>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
};

export default AdminUsers; 