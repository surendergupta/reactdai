import React from 'react'

import Header from '../../components/header/Header';
import DepositHistory from '../../components/DepositHistory/DepositHistory';
import Footer from '../../components/footer/Footer';
import './style.css';

const DepositHistoryPage = () => {
  return (
    <div className="App">
      <Header />
        <DepositHistory />
      <Footer />
    </div>
  )
}

export default DepositHistoryPage;