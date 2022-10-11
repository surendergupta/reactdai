import React from 'react';
import { Link } from "react-router-dom";
import './style.css';

import depositImg from '../../assets/deposit35_style2.png';
import withdrawImg from '../../assets/withdrawal-35-1.png';
import splitImg from '../../assets/icons8-split-35.png';
import historyImg from '../../assets/history35_1.png';

const Footer = () => {
  return (
    <>
      <footer>
        <div className="d-flex justify-content-around fixed-bottom bg-dark">
          <div className="p-2 ">
            <Link className="nav-link" to="/deposit">
              <img src={depositImg} alt='Deposit' />
            </Link>
          </div>
          <div className="p-2 ">
            <Link className="nav-link" to="/withdraw">
              <img src={withdrawImg} alt='Withdraw' />
            </Link>
          </div>
          <div className="p-2 ">
            <Link className="nav-link" to="/split">
              <img src={splitImg} alt='Split' />
            </Link>
          </div>
          <div className="p-2 ">
            <Link className="nav-link" to="/history">
              <img src={historyImg} alt='History' />
            </Link>
          </div>
        </div>
      </footer>      
    </>
  )
}

export default Footer;