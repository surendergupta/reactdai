import React, { useEffect, useState } from 'react'
import exportedObject from '../myWeb3/Web3.js';

import imgMatic from '../../assets/logo.png';
import imgDai from '../../assets/dai.png';

import './style.css';
const Team = () => {
  const [userAddress, setUserAddress] = useState('');
  const [maxDirectDeposit1, setMaxDirectDeposit1] = useState(0);
  const [otherDirectDeposit1, setOtherDirectDeposit1] = useState(0);
  const [totalTeamDeposit1, setTotalTeamDeposit1] = useState(0);
  const [totalInvited1, setTotalInvited1] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [totalUnActived, setTotalUnActived] = useState(0);

  useEffect(() => {
    var myobj = exportedObject.walletConnect();
    setUserAddress(myobj[0]);
    updateTeamInfos(0,20);
  }, [])

  const updateTeamInfos =  async (from, to) => {
    var teamDeposit = await exportedObject.MY_CONTRACT.methods.getTeamDeposit(userAddress).call()
    var { teamNum } = await exportedObject.MY_CONTRACT.methods.userInfo(userAddress).call();
    var maxDirectDeposit = parseInt(teamDeposit[0])/1000000000000000000;
    var otherDirectDeposit = parseInt(teamDeposit[1])/1000000000000000000;
    var teamTotalDeposit = parseInt(teamDeposit[2])/1000000000000000000;
    setMaxDirectDeposit1(maxDirectDeposit.toFixed(2));
    setOtherDirectDeposit1(otherDirectDeposit.toFixed(2));
    setTotalTeamDeposit1(teamTotalDeposit.toFixed(2));
    setTotalInvited1(teamNum);

    var totalInvited = 0;
    var totalActive = 0;
    var teamEachDeposit = new Array(20).fill(0);
    for(var i = from; i < to; i++){
        var inviteAmount = parseInt(await exportedObject.MY_CONTRACT.methods.getTeamUsersLength(userAddress, i).call());
        if(inviteAmount > 0){
            for(var j = 0; j < inviteAmount; j++){
                var inviteUserAddr = await exportedObject.MY_CONTRACT.methods.teamUsers(userAddress, i, j).call();
                var {start, level, totalDeposit, teamTotalDeposit} = await exportedObject.MY_CONTRACT.methods.userInfo(inviteUserAddr).call();
                var depositHtml = "<tr>";
                
                var iAddr = inviteUserAddr;
                var iAddrShort = inviteUserAddr.substring(0, 4) +"..."+ inviteUserAddr.substring(inviteUserAddr.length-4);
                depositHtml = depositHtml + "<td><span class='DepC7'>" + iAddrShort + "</span></td>";
                
                var iLevel = "L" + level;
                depositHtml = depositHtml + "<td><span class='DepC3'>" + iLevel + "</span></td>";
                
                var layer = i + 1;
                depositHtml = depositHtml + "<td><span class='DepC3'>" + layer + "</span></td>";
                
                var iStatus = "UnActive";
                
                var iTotalDeposit = parseInt(totalDeposit);
                if(iTotalDeposit > 0){
                    iStatus = "Actived";
                    totalActive = totalActive + 1;
                }

                depositHtml = depositHtml + "<td><span class='DepC2'>" + iStatus + "</span></td>";
                
                var iStartTime = parseInt(start) * 1000;
                var iTime = exportedObject.getDate(iStartTime);
                depositHtml = depositHtml + "<td><span class='DepC4'>" + iTime + "</span></td>";
                depositHtml = depositHtml + "</tr>";
                //$(".DepTab2").append(depositHtml);
                
                totalInvited = totalInvited + 1;
                var totalUnActived = totalInvited - totalActive;
                var forMatTotalDeposit = (parseInt(totalDeposit) / 1000000000000000000);
                teamEachDeposit[i] = teamEachDeposit[i] + forMatTotalDeposit;
            }
        }
        else
        {
            break;
        }
    }
    console.log(totalActive);
    setTotalActive(totalActive);
    setTotalUnActived(totalUnActived);
    
    var sevenToTen = 0;
    for(var i = 6; i < 10; i++){
        sevenToTen = sevenToTen + teamEachDeposit[i];
    }

    var elToTw = 0;
    for(var i = 10; i < 20; i++){
        elToTw = elToTw + teamEachDeposit[i];
    }

    for(var i = 0; i < 6; i++){
        //$(".teamDeposit").eq(i).text(teamEachDeposit[i].toFixed(2));
        if(teamEachDeposit[i] > 0){
            var rate = parseFloat(teamEachDeposit[i] * 100 /teamTotalDeposit).toFixed(2);
            //$(".rate").eq(i).text(rate);
        }
    }

    if(sevenToTen > 0){
       // $(".teamDeposit").eq(6).text(sevenToTen);
        var rate = parseFloat(sevenToTen * 100 /teamTotalDeposit).toFixed(2);
       // $(".rate").eq(6).text(rate);
    }

    if(elToTw > 0){
        //$(".teamDeposit").eq(7).text(elToTw);
        var rate = parseFloat(elToTw * 100 /teamTotalDeposit).toFixed(2);
        //$(".rate").eq(7).text(rate);
    }
    var inviteLevel = "Level";
}
  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col-12 col-md-12'>
            <div className='text-center'>
              <h5 className='mt-3 mb-3'><span className='badge badge-info'>MY TEAM</span></h5>
            </div>
            <div className='row'>
              <div className='col-12 col-sm-6 col-md-3'>
                <div className='info-box bg-warning'>
                  <span className='info-box-icon elevation-1'>
                    <img src={imgDai} alt='DAI' height='30' />
                  </span>
                  <div className='info-box-content'>
                    <span className='info-box-text text-dark'>
                      <b>Sales</b>
                    </span>
                    <span className='info-box-number'>{totalTeamDeposit1}</span>
                  </div>
                </div>
              </div>
              <div className='col-12 col-sm-6 col-md-3'>
                <div className='info-box bg-warning'>
                  <span className='info-box-icon elevation-1'>
                    <i className='far fa-users'></i>
                  </span>
                  <div className='info-box-content'>
                    <span className='info-box-text text-dark'>
                      <b>Downline</b>
                    </span>
                    <span className='info-box-number'>{totalInvited1}</span>
                  </div>
                </div>
              </div>
              <div className='col-12 col-sm-6 col-md-3'>
                <div className='info-box bg-warning'>
                  <span className='info-box-icon elevation-1'>
                    <img src={imgDai} alt='DAI' height='30' />
                  </span>
                  <div className='info-box-content'>
                    <span className='info-box-text text-dark'>
                      <b>Strong Leg</b>
                    </span>
                    <span className='info-box-number'>{maxDirectDeposit1}</span>
                  </div>
                </div>
              </div>
              <div className='col-12 col-sm-6 col-md-3'>
                <div className='info-box bg-warning'>
                  <span className='info-box-icon elevation-1'>
                    <img src={imgDai} alt='DAI' height='30' />
                  </span>
                  <div className='info-box-content'>
                    <span className='info-box-text text-dark'>
                      <b>Rest Leg</b>
                    </span>
                    <span className='info-box-number'>{otherDirectDeposit1}</span>
                  </div>
                </div>
              </div>
              <div className='col-12 col-sm-6 col-md-3'>
                <div className='info-box bg-warning'>
                  <span className='info-box-icon elevation-1'>
                    <img src={imgDai} alt='DAI' height='30' />
                  </span>
                  <div className='info-box-content'>
                    <span className='info-box-text text-dark'>
                      <b>Total Active</b>
                    </span>
                    <span className='info-box-number'>{totalActive}</span>
                  </div>
                </div>
              </div>
              <div className='col-12 col-sm-6 col-md-3'>
                <div className='info-box bg-warning'>
                  <span className='info-box-icon elevation-1'>
                    <img src={imgDai} alt='DAI' height='30' />
                  </span>
                  <div className='info-box-content'>
                    <span className='info-box-text text-dark'>
                      <b>Total Inactive</b>
                    </span>
                    <span className='info-box-number'>{totalUnActived}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='card card-primary card-outline'>
              <div className='card-body'>
                <table className="table table-borderless DepTab2">
                  <tbody>
                    <tr>
                      <th>Address</th>
                      <th>Level</th>
                      <th>Layer</th>
                      <th>Status</th>
                      <th>Time</th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Team;