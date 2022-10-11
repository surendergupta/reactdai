import React from 'react'

import Header from '../../components/header/Header';
import Split from '../../components/Split/Split';
import Footer from '../../components/footer/Footer';
import './style.css';

const SplitPage = () => {
  return (
    <div className="App">
      <Header />
        <Split />
      <Footer />
    </div>
  )
}

export default SplitPage;