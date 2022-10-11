import React from 'react'

import Header from '../../components/header/Header';
import Deposit from '../../components/Deposit/Deposit';
import Footer from '../../components/footer/Footer';
import './style.css';
const DepositPage = () => {
  return (
    <div className="App">
      <Header />
        <Deposit />
      <Footer />
    </div>
  )
}

export default DepositPage;