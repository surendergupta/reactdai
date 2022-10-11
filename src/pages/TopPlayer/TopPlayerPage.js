import React from 'react'

import Header from '../../components/header/Header';
import Top from '../../components/Top/Top';
import Footer from '../../components/footer/Footer';
import './style.css';

const TopPlayerPage = () => {
  return (
    <div className="App">
      <Header />
        <Top />
      <Footer />
    </div>
  )
}

export default TopPlayerPage;