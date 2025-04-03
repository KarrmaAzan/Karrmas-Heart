import Navbar from './Navbar';
import { Container } from '@mui/material';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Container sx={{ marginTop: 1 }}>
        {children}
      </Container>
    </>
  );
}
