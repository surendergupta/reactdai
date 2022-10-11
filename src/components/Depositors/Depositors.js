import React, { useEffect, useState } from 'react'
import exportedObject from '../myWeb3/Web3.js';
import imgDai from '../../assets/dai.png';
import './style.css';
const Depositors = () => {
  
  const [latestDeposit1, setLatestDeposit1] = useState('NULL');
  const [latestDeposit2, setLatestDeposit2] = useState('NULL');
  const [latestDeposit3, setLatestDeposit3] = useState('NULL');
  const [latestDeposit4, setLatestDeposit4] = useState('NULL');
  const [latestDeposit5, setLatestDeposit5] = useState('NULL');
  const [latestDeposit6, setLatestDeposit6] = useState('NULL');
  const [latestDeposit7, setLatestDeposit7] = useState('NULL');
  const [latestDeposit8, setLatestDeposit8] = useState('NULL');
  const [latestDeposit9, setLatestDeposit9] = useState('NULL');
  const [latestDeposit10, setLatestDeposit10] = useState('NULL');
  
  const [latestAmount1, setLatestAmount1] = useState('0.00');
  const [latestAmount2, setLatestAmount2] = useState('0.00');
  const [latestAmount3, setLatestAmount3] = useState('0.00');
  const [latestAmount4, setLatestAmount4] = useState('0.00');
  const [latestAmount5, setLatestAmount5] = useState('0.00');
  const [latestAmount6, setLatestAmount6] = useState('0.00');
  const [latestAmount7, setLatestAmount7] = useState('0.00');
  const [latestAmount8, setLatestAmount8] = useState('0.00');
  const [latestAmount9, setLatestAmount9] = useState('0.00');
  const [latestAmount10, setLatestAmount10] = useState('0.00');
  
  const [latestDepositTime1, setLatestDepositTime1] = useState('...');
  const [latestDepositTime2, setLatestDepositTime2] = useState('...');
  const [latestDepositTime3, setLatestDepositTime3] = useState('...');
  const [latestDepositTime4, setLatestDepositTime4] = useState('...');
  const [latestDepositTime5, setLatestDepositTime5] = useState('...');
  const [latestDepositTime6, setLatestDepositTime6] = useState('...');
  const [latestDepositTime7, setLatestDepositTime7] = useState('...');
  const [latestDepositTime8, setLatestDepositTime8] = useState('...');
  const [latestDepositTime9, setLatestDepositTime9] = useState('...');
  const [latestDepositTime10, setLatestDepositTime10] = useState('...');
  
  useEffect(() => {    
    latestPlayersPageInfo();
  }, [])
  
  const latestPlayersPageInfo = async () => {
    var depositCount = parseInt(await exportedObject.MY_CONTRACT.methods.getDepositorsLength().call());
    var recycle = 10;
    if(depositCount < recycle)
    {
      recycle = depositCount;
    }

    var index = 0;
    var userMap = new Map();
    for(var i = depositCount; i > depositCount - recycle; i--)
    {
      var userLatestDeposit = await exportedObject.MY_CONTRACT.methods.depositors(i - 1).call();
      if(!userMap.has(userLatestDeposit))
      {
        userMap.set(userLatestDeposit, 0);
      }
      else
      {
        var val = userMap.get(userLatestDeposit);
        userMap.set(userLatestDeposit, val + 1);
      }
      var userCount = userMap.get(userLatestDeposit);
      var userLatestOrderNum = parseInt(await exportedObject.MY_CONTRACT.methods.getOrderLength(userLatestDeposit).call());
      var {amount, start} = await exportedObject.MY_CONTRACT.methods.orderInfos(userLatestDeposit, userLatestOrderNum - 1 - userCount).call();
      var latestAmount = parseInt(amount)/1000000000000000000;
      var latestStart = exportedObject.getDate(parseInt(start) * 1000);
      if(index === 0)
      {
        setLatestDeposit1(userLatestDeposit)
        setLatestAmount1("$" + latestAmount.toFixed(2))
        setLatestDepositTime1(latestStart)
      }
      if(index === 1)
      {
        setLatestDeposit2(userLatestDeposit)
        setLatestAmount2("$" + latestAmount.toFixed(2))
        setLatestDepositTime2(latestStart)
      }
      if(index === 2)
      {
        setLatestDeposit3(userLatestDeposit)
        setLatestAmount3("$" + latestAmount.toFixed(2))
        setLatestDepositTime3(latestStart)
      }
      if(index === 3)
      {
        setLatestDeposit4(userLatestDeposit)
        setLatestAmount4("$" + latestAmount.toFixed(2))
        setLatestDepositTime4(latestStart)
      }
      if(index === 4)
      {
        setLatestDeposit5(userLatestDeposit)
        setLatestAmount5("$" + latestAmount.toFixed(2))
        setLatestDepositTime5(latestStart)
      }
      if(index === 5)
      {
        setLatestDeposit6(userLatestDeposit)
        setLatestAmount6("$" + latestAmount.toFixed(2))
        setLatestDepositTime6(latestStart)
      }
      if(index === 6)
      {
        setLatestDeposit7(userLatestDeposit)
        setLatestAmount7("$" + latestAmount.toFixed(2))
        setLatestDepositTime7(latestStart)
      }
      if(index === 7)
      {
        setLatestDeposit8(userLatestDeposit)
        setLatestAmount8("$" + latestAmount.toFixed(2))
        setLatestDepositTime8(latestStart)
      }
      if(index === 8)
      {
        setLatestDeposit9(userLatestDeposit)
        setLatestAmount9("$" + latestAmount.toFixed(2))
        setLatestDepositTime9(latestStart)
      }
      if(index === 9)
      {
        setLatestDeposit10(userLatestDeposit)
        setLatestAmount10("$" + latestAmount.toFixed(2))
        setLatestDepositTime10(latestStart);
      }
      //$(".latestDeposit").eq(index).text(userLatestDeposit);
      //$(".latestAmount").eq(index).text("$" + latestAmount.toFixed(2));
      
      //$(".latestDepositTime").eq(index).text(latestStart);
      index++;
    }
  }
  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col-12 col-md-12'>
            <div className='text-center'>
              <h5 className='mt-2 mb-2'><span className='badge badge-info'>Latest Depositors</span></h5>
            </div>
            <div className='row'>
              <div className='col-12 col-sm-12 col-md-12'>
                <div className='card card-primary card-outline'>
                  <div className='card-body'>
                    <div className="table-responsive">
                      <table className="table table-borderless text-dark">
                        <tbody>
                          <tr>
                            <td className="latestDeposit">{latestDeposit1} </td>
                            <td className="latestDepositTime">{latestDepositTime1}</td>
                            <td className="text-right">
                              <img src={imgDai} height="15" alt="dai" /> 
                              <span className="latestAmount">{latestAmount1}</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="latestDeposit">{latestDeposit2} </td>
                            <td className="latestDepositTime">{latestDepositTime2}</td>
                            <td className="text-right">
                              <img src={imgDai} height="15" alt="dai" /> 
                              <span className="latestAmount">{latestAmount2}</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="latestDeposit">{latestDeposit3} </td>
                            <td className="latestDepositTime">{latestDepositTime3}</td>
                            <td className="text-right">
                              <img src={imgDai} height="15" alt="dai" /> 
                              <span className="latestAmount">{latestAmount3}</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="latestDeposit">{latestDeposit4} </td>
                            <td className="latestDepositTime">{latestDepositTime4}</td>
                            <td className="text-right">
                              <img src={imgDai} height="15" alt="dai" /> 
                              <span className="latestAmount">{latestAmount4}</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="latestDeposit">{latestDeposit5}</td>
                            <td className="latestDepositTime">{latestDepositTime5}</td>
                            <td className="text-right">
                              <img src={imgDai} height="15" alt="dai" /> 
                              <span className="latestAmount">{latestAmount5}</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="latestDeposit">{latestDeposit6}</td>
                            <td className="latestDepositTime">{latestDepositTime6}</td>
                            <td className="text-right">
                              <img src={imgDai} height="15" alt="dai" /> 
                              <span className="latestAmount">{latestAmount6}</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="latestDeposit">{latestDeposit7}</td>
                            <td className="latestDepositTime">{latestDepositTime7}</td>
                            <td className="text-right">
                              <img src={imgDai} height="15" alt="dai" /> 
                              <span className="latestAmount">{latestAmount7}</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="latestDeposit">{latestDeposit8}</td>
                            <td className="latestDepositTime">{latestDepositTime8}</td>
                            <td className="text-right">
                              <img src={imgDai} height="15" alt="dai" />
                              <span className="latestAmount">{latestAmount8}</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="latestDeposit">{latestDeposit9}</td>
                            <td className="latestDepositTime">{latestDepositTime9}</td>
                            <td className="text-right">
                              <img src={imgDai} height="15" alt="dai" /> 
                              <span className="latestAmount">{latestAmount9}</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="latestDeposit">{latestDeposit10}</td>
                            <td className="latestDepositTime">{latestDepositTime10}</td>
                            <td className="text-right">
                              <img src={imgDai} height="15" alt="dai" /> 
                              <span className="latestAmount">{latestAmount10}</span>
                            </td>
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

export default Depositors;