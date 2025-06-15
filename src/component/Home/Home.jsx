import React from 'react'
import { useLoginProvider } from '../../context/LoginContext';
import LoginPage from '../Register/LoginPage';

const Home = () => {

 const {isAuthenticated} = useLoginProvider();

  return (
    <div>
      {!isAuthenticated && <LoginPage />}
    </div>
  )
}

export default Home