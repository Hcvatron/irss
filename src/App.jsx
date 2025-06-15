import React from 'react';
import Container from './container/Container';
import './assets/style.css'
import { LoginProvider } from './context/LoginContext';
import { LocalProvider } from './context/LocalContext';
import { AdminProvider } from './context/AdminContext';


function App() {
  return (
    <div>
      <AdminProvider>
      <LocalProvider >
      <LoginProvider >
      <Container />
      </LoginProvider>
      </LocalProvider>
      </AdminProvider>
    </div>
  );
}

export default App;
