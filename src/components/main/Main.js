import React, {useEffect, useState} from 'react';
import { Link } from "react-router-dom";

import imgCarosol from '../../assets/carosal-bg.jpg';
import exportedObject from '../myWeb3/Web3.js';
import './style.css';
const Main = () => {
    const [userAddr, setUserAddress] = useState('');
    const [userShortAddress, setUserShortAddress] = useState('');
    const [userMaticBalance, setUserMaticBalance] = useState(0);
    const [userDaiBalance, setUserDaiBalance] = useState(0);
    const [runTime, setRunTime] = useState(0);
    const [depositCountDown, setDepositCountDown] = useState('00:00:00');
    const [starPool, setStarPool] = useState('$0');
    const [topPool, setTopPool] = useState('$0');
    const [totalPlayers, setTotalPlayers] = useState('0');
    const [totalIncome, setTotalIncome] = useState('0');
    const [userReferer, setUserReferer] = useState('');
    
    const [userStarLevel1, setUserStarLevel1] = useState(<i className="far fa-star"></i>);
    const [userStarLevel2, setUserStarLevel2] = useState(<i className="far fa-star"></i>);
    const [userStarLevel3, setUserStarLevel3] = useState(<i className="far fa-star"></i>);
    const [userStarLevel4, setUserStarLevel4] = useState(<i className="far fa-star"></i>);
    const [userStarLevel5, setUserStarLevel5] = useState(<i className="far fa-star"></i>);
    
    useEffect(() => {
        const getWalletConnect = async () => {
            var myobj = await exportedObject.walletConnect();
            setUserAddress(myobj[0]);
            setUserShortAddress(myobj[1]);
            setUserMaticBalance(myobj[3]);
            setUserDaiBalance(myobj[4]);
            
        }
        getWalletConnect();
        
    }, []);

    const getHome = async () => {
        var myobj = await exportedObject.walletConnect();
        var userAddr = myobj[0];
        var startTime = parseInt(await exportedObject.MY_CONTRACT.methods.startTime().call() * 1000);
        var nowTime = (new Date()).getTime();
        var runTime = exportedObject.formatDate(startTime, nowTime);
        setRunTime(runTime);
        var orderLength = parseInt(await exportedObject.MY_CONTRACT.methods.getOrderLength(userAddr).call());
        if(orderLength > 0)
        {
            let maxLenOrder = orderLength -1;
            var {unfreeze} = await exportedObject.MY_CONTRACT.methods.orderInfos(userAddr, maxLenOrder).call();
            var unfreezeTS = (parseInt(unfreeze) * 1000);
            var depositCountDown = exportedObject.formatDate(nowTime, unfreezeTS);
            setDepositCountDown(depositCountDown);
        }
        var divider = 1000000000000000000;
        var starPool = (parseInt(await exportedObject.MY_CONTRACT.methods.starPool().call())/divider);
        var topPool = (parseInt(await exportedObject.MY_CONTRACT.methods.topPool().call())/divider);
        var totalUser = parseInt(await exportedObject.MY_CONTRACT.methods.totalUser().call());
        var { referrer } = await exportedObject.MY_CONTRACT.methods.userInfo(userAddr).call();
        var { totalRevenue } = await exportedObject.MY_CONTRACT.methods.userInfo(userAddr).call();
        var totalIncome = exportedObject.web3.utils.fromWei(totalRevenue.toString(), 'ether');
        var refer = exportedObject.web3.utils.toHex(referrer);
        var { level } = await exportedObject.MY_CONTRACT.methods.userInfo(userAddr).call();
        level = parseInt(level);
        setStarPool('$'+starPool.toFixed(2));
        setTopPool('$'+topPool.toFixed(2));
        setTotalPlayers(totalUser);        
        setUserReferer(refer);
        setTotalIncome(totalIncome);
        for(let i = 0; i < level; i++)
        {
            if(i === 0)
            {
                setUserStarLevel1(<i className="fas fa-star text-warning"></i>);
            }
            else if(i === 1)
            {
                setUserStarLevel2(<i className="fas fa-star text-warning"></i>);
            }
            else if(i === 2)
            {
                setUserStarLevel3(<i className="fas fa-star text-warning"></i>);
            }
            else if(i === 3)
            {
                setUserStarLevel4(<i className="fas fa-star text-warning"></i>);
            }
            else if(i === 4)
            {
                setUserStarLevel5(<i className="fas fa-star text-warning"></i>);
            }
        }
    }
    getHome();
    // setInterval(() => {
    //     getHome();
    // }, 30000);
  return (
    <>
      <div className='container'>
        <div className="badge bg-success mt-3 mb-3">
          Login Account: <strong>{userShortAddress}</strong>
        </div>
        <div id="demo" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#demo" data-bs-slide-to="0" className="active"></button>
            <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
            <button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={imgCarosol} alt="Los Angeles" className="d-block w-100" />
              <div className="carousel-caption">
                <h3>CONTRACT ADDRESS</h3>
                <p><span className='contractAddress'>{exportedObject.MY_CONTRACT_ADDRESS.substring(0, 8) + "..." + exportedObject.MY_CONTRACT_ADDRESS.substring(exportedObject.MY_CONTRACT_ADDRESS.length - 8)}</span></p>
              </div>
            </div>
            <div className="carousel-item">
              <img src={imgCarosol} alt="Chicago" className="d-block w-100" />
              <div className="carousel-caption">
                <h3>PLATFORM RUNNING TIME</h3>
                <p><span className='platformRunningTime'>{runTime}</span></p>
              </div>
            </div>
            <div className="carousel-item">
              <img src={imgCarosol} alt="New York" className="d-block w-100" />
              <div className="carousel-caption">
                <h3>DEPOSIT TIME</h3>
                <p><span className='depositTime'>{depositCountDown}</span></p>
              </div>
            </div>
          </div>

          {/* <button className="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button> */}
        </div>

        <div className='row mt-3'>
          <div className='col-12 col-md-4 mb-3'>
            <div className="card bg-primary text-white">
              <div className="card-body">Players <span className="badge rounded-pill bg-success">{totalPlayers}</span></div>
            </div>
          </div>
          <div className='col-12 col-md-4 mb-3'>
            <div className="card bg-primary text-white">
              <div className="card-body">Daily 4 Star Pool <span className="badge rounded-pill bg-success">{starPool}</span></div>
            </div>
          </div>
          <div className='col-12 col-md-4 mb-3'>
            <div className="card bg-primary text-white">
              <div className="card-body">Daily Top 3 Pool <span className="badge rounded-pill bg-success">{topPool}</span></div>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-12 col-md-4 mb-3'>
            <div className="card bg-primary text-white">
              <div className="card-body"><Link className="nav-link" to="/deposit">Deposit</Link> </div>
            </div>
          </div>
          <div className='col-12 col-md-4 mb-3'>
            <div className="card bg-primary text-white">
              <div className="card-body"><Link className="nav-link" to="/withdraw">Withdraw</Link></div>
            </div>
          </div>
          <div className='col-12 col-md-4 mb-3'>
            <div className="card bg-primary text-white">
              <div className="card-body"><Link className="nav-link" to="/split">Split</Link></div>
            </div>
          </div>
        </div>


        {/* <div className="card bg-purple text-dark">
          <div className="card-body ">
            <ul className="list-group ">
              <li className="list-group-item bg-purple text-white">Contract address: <span className='contractAddress'>0x4AF835...7fE588A0</span></li>
              <li className="list-group-item bg-purple text-white">Platform Running time: <span className='platformRunningTime'>00:02:46</span></li>
              <li className="list-group-item bg-purple text-white">Income: 10 Days Per Cycle. For 10 Days 16%</li>
              <li className="list-group-item bg-purple text-white">Deposit time: <span className='depositTime'>00:21:18</span></li>
            </ul>
          </div>
        </div> */}

        <div className="card bg-purple text-dark mb-3">
          <div className="card-body">
            <ul className="list-group">
              <li className="list-group-item bg-purple text-white">My Level: 
                <span className="mylevel">
                  <span className="level">{userStarLevel1}</span>
                  <span className="level">{userStarLevel2}</span>
                  <span className="level">{userStarLevel3}</span>
                  <span className="level">{userStarLevel4}</span>
                  <span className="level">{userStarLevel5}</span>
                </span>
              </li>
              <li className="list-group-item bg-purple text-white">Income: <span className='myIncome'>{totalIncome}</span></li>
              <li className="list-group-item bg-purple text-white">Matic Balance: <span className='myMatic'>{userMaticBalance}</span></li>
              <li className="list-group-item bg-purple text-white">DAI Balance: <span className='myDai'>{userDaiBalance}</span></li>
              <li className="list-group-item bg-purple text-white">Referral: <span className='myRef'> {userReferer.substring(0, 8) + "..." + userReferer.substring(userReferer.length - 8)}</span></li>
              <li className="list-group-item bg-purple text-white">My Referral Link: <span className='myRefLink'>{'http://localhost:3000/'+userAddr}</span></li>
            </ul>
          </div>
        </div>
        <div className='mt-3 mb-3'>&nbsp;</div>
        <div className='mt-3 mb-3'>&nbsp;</div>
      </div>
    </>
  )
}

export default Main;