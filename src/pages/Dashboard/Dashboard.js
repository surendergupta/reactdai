import React from 'react'
import Header from '../../components/header/Header';
import Main from '../../components/main/Main';
import Footer from '../../components/footer/Footer';

import './style.css';
const Dashboard = () => {
  return (
    <div className="App">
      <Header />
        <Main />
      <Footer />
    </div>
  )
}

export default Dashboard;