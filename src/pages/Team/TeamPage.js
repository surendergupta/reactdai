import React from 'react'

import Header from '../../components/header/Header';
import Team from '../../components/Team/Team';
import Footer from '../../components/footer/Footer';
import './style.css';

const TeamPage = () => {
  return (
    <div className="App">
      <Header />
        <Team />
      <Footer />
    </div>
  )
}

export default TeamPage;