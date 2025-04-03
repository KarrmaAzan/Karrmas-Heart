import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Container, TextField, Button, Typography, Alert } from '@mui/material';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/auth/login', data);
      login(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Login</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField label="Email" fullWidth margin="normal" {...register('email')} required />
        <TextField label="Password" fullWidth margin="normal" type="password" {...register('password')} required />
        <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
      </form>
    </Container>
  );
}
