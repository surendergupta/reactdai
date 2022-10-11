import React from 'react'

import Header from '../../components/header/Header';
import Depositors from '../../components/Depositors/Depositors';
import Footer from '../../components/footer/Footer';
import './style.css';
const LatestDepositorPage = () => {
  return (
    <div className="App">
      <Header />
        <Depositors />
      <Footer />
    </div>
  )
}

export default LatestDepositorPage;