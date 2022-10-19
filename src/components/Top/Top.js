import React, { useEffect, useState } from 'react'
import exportedObject from '../myWeb3/Web3.js';
import './style.css';
const Top = () => {
  const ZERO_ADDR = '0x0000000000000000000000000000000000000000';
  const [userAddress, setUserAddress] = useState();
  const [dayTopUser1, setDayTopUser1] = useState('NULL');
  const [dayTopUser2, setDayTopUser2] = useState('NULL');
  const [dayTopUser3, setDayTopUser3] = useState('NULL');
  
  useEffect(() => {
    topPlayersPageInfo();
  }, [])

  const topPlayersPageInfo = async () => {
    let myobj = await exportedObject.walletConnect();
    setUserAddress(myobj[0]);
    var curDay = parseInt(await exportedObject.MY_CONTRACT.methods.getCurDay().call());
    for(var i = 0; i < 3; i++)
    {
      var dayTopUser = await exportedObject.MY_CONTRACT.methods.dayTopUsers(curDay, i).call();
      if(dayTopUser !== ZERO_ADDR) 
      {
        if(i === 0)
        {
          setDayTopUser1(dayTopUser);
        }
        else if(i === 1)
        {
          setDayTopUser2(dayTopUser);
        }
        else if(i === 2)
        {
          setDayTopUser3(dayTopUser);
        }
      }
      else
      {
        break;
      }
    }
  }
  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col-12 col-md-12'>
            <div className='text-center'>
              <h5 className='mt-2 mb-2'><span className='badge badge-info'>Top 3 Players</span></h5>
              <h5 className='mt-2 mb-2'><span className='badge badge-info'>Login Account: {userAddress}</span></h5>
            </div>
            <div className='row'>
              <div className='col-12 col-sm-12 col-md-12'>
                <div className='card card-primary card-outline'>
                  <div className='card-body'>
                    <div className="table-responsive">
                      <table className="table borderless">
                        <tbody>
                          <tr>
                            <td>1 </td>
                            <td className="dayTopUser">{dayTopUser1}</td>
                            <td className="text-right"><i className="fas fa-level-up-alt text-success"></i></td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td className="dayTopUser">{dayTopUser2}</td>
                            <td className="text-right"><i className="fas fa-level-down-alt text-danger"></i></td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td className="dayTopUser">{dayTopUser3}</td>
                            <td className="text-right"><i className="fas fa-level-down-alt text-success"></i></td>
                          </tr>
                        </tbody>                        
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Top;