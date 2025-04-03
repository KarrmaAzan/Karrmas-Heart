import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Container, TextField, Button, Typography, Alert, MenuItem } from '@mui/material';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext'; // ✅ Import AuthContext

export default function Register() {
  const { register, handleSubmit, watch } = useForm();
  const [error, setError] = useState('');
  const userRole = watch('role', 'user');
  const { login } = useContext(AuthContext); // ✅ Use login from context

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/auth/register', data);
      login(response.data); // ✅ Save token + user globally
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Register</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField label="Name" fullWidth margin="normal" {...register('name')} required />
        <TextField label="Email" fullWidth margin="normal" {...register('email')} required />
        <TextField label="Password" fullWidth margin="normal" type="password" {...register('password')} required />
        
        <TextField
          select
          label="Role"
          fullWidth
          margin="normal"
          {...register('role')}
          defaultValue="user"
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>

        {userRole === 'admin' && (
          <TextField
            label="Admin Secret Key"
            fullWidth
            margin="normal"
            {...register('adminSecret')}
            required
          />
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </form>
    </Container>
  );
}
