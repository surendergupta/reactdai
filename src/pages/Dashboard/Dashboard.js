import React from 'react'
import Header from '../../components/header/Header';
import Main from '../../components/main/Main';
import RegisterModalDialog from '../../components/RegisterModalDialog/RegisterModalDialog';
import Footer from '../../components/footer/Footer';

import './style.css';

const Dashboard = () => {
  return (
    <div className="App">
      <Header />
        <Main />
        <RegisterModalDialog />
      <Footer />
    </div>
  )
}

export default Dashboard;