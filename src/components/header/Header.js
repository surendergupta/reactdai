import React from 'react';
import { Link } from "react-router-dom";
import logo from '../../assets/logo.png';

import './style.css';

const Header = () => {
  return (
    <>
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/"><img src={logo} alt='logo' /> Butter<strong>Fly</strong></Link>          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/deposit">Deposit</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/withdraw">Withdraw</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/split">Split</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/team">Team</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/history">History</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/depositor">Depositors</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/top-player">Top Players</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Header;