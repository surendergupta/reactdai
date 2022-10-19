import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Web3 from 'web3'
import { Web3ReactProvider } from '@web3-react/core'
import { MetaMaskProvider } from './hooks/useMetaMask'

import Dashboard from './pages/Dashboard/Dashboard';
import DepositPage from './pages/Deposit/DepositPage';
import WithdrawPage from './pages/Withdraw/WithdrawPage';
import SplitPage from './pages/Split/SplitPage';
import TeamPage from './pages/Team/TeamPage';
import DepositHistoryPage from './pages/DepositHistory/DepositHistoryPage';
import LatestDepositorPage from './pages/LatestDepositor/LatestDepositorPage';
import TopPlayerPage from './pages/TopPlayer/TopPlayerPage';

function getLibrary(provider, connector) {
  return new Web3(provider)
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <MetaMaskProvider>
        <Router>
          <Routes>
            <Route path="/">
              <Route path=":referer" element={<Dashboard />} />
              <Route path="" element={<Dashboard />} />
            </Route>
            {/* <Route path="/:referer" element={<Dashboard/>} /> */}
            <Route path="/deposit" element={ <DepositPage />} />
            <Route path="/withdraw" element={ <WithdrawPage /> } />
            <Route path="/split" element={ <SplitPage /> } />
            <Route path="/team" element={ <TeamPage />} />
            <Route path="/history" element={ <DepositHistoryPage /> } />
            <Route path="/depositor" element={ <LatestDepositorPage />} />
            <Route path="/top-player" element={<TopPlayerPage />} />
          </Routes>
        </Router>
      </MetaMaskProvider>
    </Web3ReactProvider>    
  </React.StrictMode>
);