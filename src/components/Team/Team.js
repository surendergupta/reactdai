import React, { useEffect, useState } from 'react'
import exportedObject from '../myWeb3/Web3.js';

import imgDai from '../../assets/dai.png';

import './style.css';
const Team = () => {
    const [userAddress, setUserAddress] = useState('');
    const [maxDirectDeposit1, setMaxDirectDeposit1] = useState(0);
    const [otherDirectDeposit1, setOtherDirectDeposit1] = useState(0);
    const [totalTeamDeposit1, setTotalTeamDeposit1] = useState(0);
    const [totalInvited1, setTotalInvited1] = useState(0);
    const [userTeamList, setUserTeamList] = useState([]);

    useEffect(() => {
        const updateTeamInfos =  async (from, to) => {
            var userTeamLists = [];
            var divider = 1000000000000000000;
            var myobj = await exportedObject.walletConnect();
            var userAddr = myobj[0];
            setUserAddress(myobj[0]);
            var teamDeposit = await exportedObject.MY_CONTRACT.methods.getTeamDeposit(userAddr).call();
            var { teamNum } = await exportedObject.MY_CONTRACT.methods.userInfo(userAddr).call();
            var maxDirectDeposit = (parseInt(teamDeposit[0])/divider);
            var otherDirectDeposit = (parseInt(teamDeposit[1])/divider);
            var teamTotalDeposits = (parseInt(teamDeposit[2])/divider);
            setMaxDirectDeposit1(maxDirectDeposit.toFixed(2));
            setOtherDirectDeposit1(otherDirectDeposit.toFixed(2));
            setTotalTeamDeposit1(teamTotalDeposits.toFixed(2));
            setTotalInvited1(teamNum);
            var totalInvited = 0;
            var totalActive = 0;
            var teamEachDeposit = new Array(20).fill(0);
            for(var i = from; i < to; i++)
            {
                var inviteAmount = parseInt(await exportedObject.MY_CONTRACT.methods.getTeamUsersLength(userAddr, i).call());
                if(inviteAmount > 0)
                {
                    for(var j = 0; j < inviteAmount; j++)
                    {
                        var inviteUserAddr = await exportedObject.MY_CONTRACT.methods.teamUsers(userAddr, i, j).call();
                        var {start, level, totalDeposit} = await exportedObject.MY_CONTRACT.methods.userInfo(inviteUserAddr).call();
                        var iAddrShort = inviteUserAddr.substring(0, 8) +"..."+ inviteUserAddr.substring(inviteUserAddr.length-8);
                        var iLevel = "L" + level;
                        var layer = i + 1;
                        var iStatus = "UnActive";
                        var iTotalDeposit = parseInt(totalDeposit);
                        if(iTotalDeposit > 0)
                        {
                            iStatus = "Actived";
                            totalActive = totalActive + 1;
                        }
                        var iStartTime = parseInt(start) * 1000;
                        var iTime = await exportedObject.getDate(iStartTime);
                        userTeamLists.push({iAddrShort,iLevel,layer,iStatus,iTime});
                        totalInvited = totalInvited + 1;
                        var forMatTotalDeposit = (parseInt(totalDeposit) / divider);
                        teamEachDeposit[i] = teamEachDeposit[i] + forMatTotalDeposit;
                    }
                }
                else
                {
                    break;
                }
            }
            var unique = userTeamLists.filter((v, i, a) => a.indexOf(v) === i);
            setUserTeamList(unique);
        }
        updateTeamInfos(0,20);
    }, []);

  
  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col-12 col-md-12'>
            <div className='text-center'>
              <h5 className='mt-3 mb-3'><span className='badge badge-info'>MY TEAM</span></h5>
              <h5 className='mt-2 mb-2'><span className='badge badge-info'>Login Account: {userAddress}</span></h5>
            </div>
            <div className='row'>
              <div className='col-12 col-sm-6 col-md-4'>
                <div className='info-box bg-warning'>
                  <span className='info-box-icon elevation-1'>
                    <img src={imgDai} alt='DAI' height='30' />
                  </span>
                  <div className='info-box-content'>
                    <span className='info-box-text text-dark'>
                      <b>TOTAL BUSINESS</b>
                    </span>
                    <span className='info-box-number'>{totalTeamDeposit1}</span>
                  </div>
                </div>
              </div>
              <div className='col-12 col-sm-6 col-md-4'>
                <div className='info-box bg-warning'>
                  <span className='info-box-icon elevation-1'>
                    <img src={imgDai} alt='DAI' height='30' />
                  </span>
                  <div className='info-box-content'>
                    <span className='info-box-text text-dark'>
                      <b>SIDE A BUSINESS</b>
                    </span>
                    <span className='info-box-number'>{maxDirectDeposit1}</span>
                  </div>
                </div>
              </div>
              <div className='col-12 col-sm-6 col-md-4'>
                <div className='info-box bg-warning'>
                  <span className='info-box-icon elevation-1'>
                    <img src={imgDai} alt='DAI' height='30' />
                  </span>
                  <div className='info-box-content'>
                    <span className='info-box-text text-dark'>
                      <b>SIDE B BUSINESS</b>
                    </span>
                    <span className='info-box-number'>{otherDirectDeposit1}</span>
                  </div>
                </div>
              </div>
              <div className='col-12 col-sm-6 col-md-4'>
                <div className='info-box bg-warning'>
                  <span className='info-box-icon elevation-1'>
                    <i className='far fa-users'></i>
                  </span>
                  <div className='info-box-content'>
                    <span className='info-box-text text-dark'>
                      <b>TEAM</b>
                    </span>
                    <span className='info-box-number'>{totalInvited1}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='card card-primary card-outline'>
              <div className='card-body'>
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <th>Address</th>
                      <th>Level</th>
                      <th>Layer</th>
                      <th>Status</th>
                      <th>Time</th>
                    </tr>
                    {
                        userTeamList.map((row,i) => {
                            return <tr key={i}><td>{row.iAddrShort}</td><td>{row.iLevel}</td><td>{row.layer}</td><td>{row.iStatus}</td><td>{row.iTime}</td></tr>;
                        })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
            <div className='clearfix'>&nbsp;</div>
            <div className='clearfix'>&nbsp;</div>
            <div className='clearfix'>&nbsp;</div>
        </div>
      </div>
    </>
  )
}

export default Team;