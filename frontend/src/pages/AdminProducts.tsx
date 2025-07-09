import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import api from '../utils/api';
import { toast } from 'react-toastify';
import styled from 'styled-components';
// @ts-ignore
import Papa from 'papaparse';
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

  .MuiTypography-root {
    color: #fff !important;
  }

  input[type="file"] {
    color: #fff !important;
    &::file-selector-button {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      margin-right: 10px;
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

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkUploadResult, setBulkUploadResult] = useState<string | null>(null);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (e) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (e) {
      toast.error('Failed to delete product');
    }
  };

  const handleSave = async () => {
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.productId}`, formData);
        toast.success('Product updated');
      } else {
        await api.post('/products', formData);
        toast.success('Product added');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (e) {
      toast.error('Failed to save product');
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
          await api.post('/products/bulk', products);
          setBulkUploadResult('Bulk upload successful!');
          setBulkModalOpen(false);
          fetchProducts();
        } catch (error: any) {
          setBulkUploadResult(error.response?.data?.message || 'Bulk upload failed');
        }
      },
      error: (err: any) => {
        setBulkUploadResult('CSV parsing error: ' + err.message);
      }
    });
  };

  const handleEditStock = (product: any) => {
    setSelectedProduct(product);
    setNewStock(product.stockQuantity);
    setStockModalOpen(true);
  };

  const handleStockUpdate = async () => {
    if (!selectedProduct) return;
    try {
      await api.put(`/products/updateStockQuantity/${selectedProduct.productId}?quantity=${newStock}`);
      toast.success('Stock updated');
      setStockModalOpen(false);
      fetchProducts();
    } catch (e) {
      toast.error('Failed to update stock');
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
        <PageTitle variant="h4" fontWeight={700}>Product Management</PageTitle>
        <Box display="flex" gap={2}>
          <StyledButton 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => { 
              setEditingProduct(null); 
              setFormData({}); 
              setModalOpen(true); 
            }}
          >
            Add Product
          </StyledButton>
          <SecondaryButton 
            variant="contained" 
            startIcon={<UploadIcon />} 
            onClick={handleBulkUpload}
          >
            Bulk Upload
          </SecondaryButton>
        </Box>
      </Box>
      
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.productId}>
                <TableCell>{product.productId}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
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
                    onClick={() => handleEdit(product)}
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
                    onClick={() => handleDelete(product.productId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
      
      {/* Product Modal */}
      <StyledDialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <TextField 
            label="Name" 
            fullWidth 
            margin="normal" 
            value={formData.name || ''} 
            onChange={e => setFormData({ ...formData, name: e.target.value })} 
          />
          <TextField 
            label="Price" 
            type="number" 
            fullWidth 
            margin="normal" 
            value={formData.price || ''} 
            onChange={e => setFormData({ ...formData, price: e.target.value })} 
          />
          <TextField 
            label="Description" 
            fullWidth 
            margin="normal" 
            value={formData.description || ''} 
            onChange={e => setFormData({ ...formData, description: e.target.value })} 
          />
          <TextField 
            label="Category" 
            fullWidth 
            margin="normal" 
            value={formData.category || ''} 
            onChange={e => setFormData({ ...formData, category: e.target.value })} 
          />
          <TextField
            label="Image URL"
            fullWidth
            margin="normal"
            value={formData.imageUrl || ''}
            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
          />
          <TextField 
            label="Stock Quantity" 
            type="number" 
            fullWidth 
            margin="normal" 
            value={formData.stockQuantity || ''} 
            onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })} 
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
          <StyledButton onClick={handleSave} variant="contained">
            Save
          </StyledButton>
        </DialogActions>
      </StyledDialog>
      
      {/* Bulk Upload Modal */}
      <StyledDialog open={bulkModalOpen} onClose={() => setBulkModalOpen(false)}>
        <DialogTitle>Bulk Product Upload</DialogTitle>
        <DialogContent>
          <Typography mb={2}>Upload a CSV file with columns: name, price, description, category, imageUrl, stockQuantity</Typography>
          <input type="file" accept=".csv" onChange={handleBulkFileChange} title="Bulk Product CSV File" />
          {bulkUploadResult && (
            <Typography 
              mt={2} 
              sx={{ 
                color: bulkUploadResult.includes('success') ? '#00c853' : '#ff6b6b' 
              }}
            >
              {bulkUploadResult}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setBulkModalOpen(false)}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': { color: '#fff' }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </StyledDialog>
      
      {/* Stock Edit Modal */}
      <StyledDialog open={stockModalOpen} onClose={() => setStockModalOpen(false)}>
        <DialogTitle>Edit Stock Quantity</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <>
              <Typography><b>Product:</b> {selectedProduct.name}</Typography>
              <Typography><b>Current Stock:</b> {selectedProduct.stockQuantity}</Typography>
              <TextField 
                label="New Stock Quantity" 
                type="number" 
                fullWidth 
                margin="normal" 
                value={newStock} 
                onChange={e => setNewStock(Number(e.target.value))} 
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setStockModalOpen(false)}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': { color: '#fff' }
            }}
          >
            Cancel
          </Button>
          <StyledButton onClick={handleStockUpdate} variant="contained">
            Update Stock
          </StyledButton>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
};

export default AdminProducts; 