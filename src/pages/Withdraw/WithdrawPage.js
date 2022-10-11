import React from 'react'

import Header from '../../components/header/Header';
import Withdraw from '../../components/Withdraw/Withdraw';
import Footer from '../../components/footer/Footer';
import './style.css';

const WithdrawPage = () => {
  return (
    <div className="App">
      <Header />
        <Withdraw />
      <Footer />
    </div>
  )
}

export default WithdrawPage;