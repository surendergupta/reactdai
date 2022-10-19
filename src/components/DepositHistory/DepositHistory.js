import React, {useEffect, useState} from 'react';
import exportedObject from '../myWeb3/Web3.js';

import './style.css';
const DepositHistory = () => {
    const [userAddress, setUserAddress] = useState('');
    const [userDepositList, setUserDepositList] = useState([]);
    
    useEffect(() => {
        const getWalletConnect = async () => {
            var userOrderList = [];
            var myobj = await exportedObject.walletConnect();
            var userAddr = myobj[0];
            setUserAddress(myobj[0]);
            var length = await exportedObject.MY_CONTRACT.methods.getOrderLength(userAddr).call();
            for(let i = length - 1; i >= 0; i--)
            {
                var {amount, start, unfreeze, isUnfreezed} = await exportedObject.MY_CONTRACT.methods.orderInfos(userAddr, i).call();
                var startTS = parseInt(start)*1000;
                var dAmt = exportedObject.web3.utils.fromWei(amount.toString(), 'ether');
                var startDate = exportedObject.getDate(startTS);
                var unfreezeTS = parseInt(unfreeze)*1000;
                var unfreezeDate = exportedObject.getDate(unfreezeTS);
                var income = (parseInt(exportedObject.web3.utils.fromWei(amount.toString(), 'ether')) * (16 / 100));
                var date = new Date();
                var timeNow = date.getTime()
                var status;
                var className = '';
                if(timeNow < unfreezeTS)
                {
                    status = "Freezing";
                    className = 'text-primary';
                }
                else
                {
                    if(isUnfreezed)
                    {
                        status = "Completed";
                        className = 'text-success';
                    }
                    else
                    {
                        status = "Unbonded";
                        className = 'text-warning';
                    }
                }
                userOrderList.push({dAmt,startDate,unfreezeDate,income,className,status});
            }
            var unique = userOrderList.filter((v, i, a) => a.indexOf(v) === i);
            
            setUserDepositList(unique)
        }

        getWalletConnect();
    }, []);
  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col-12 col-md-12'>
            <div className='text-center'>
              <h5 className='mt-2 mb-2'><span className='badge badge-info'>Deposit History</span></h5>
              <h5 className='mt-2 mb-2'><span className='badge badge-info'>Login Account: {userAddress}</span></h5>
            </div>
            <div className='row'>
              <div className='col-12 col-sm-12 col-md-12'>
                <div className='card card-primary card-outline'>
                  <div className='card-body'>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <th>Amount</th>
                            <th>Deposit Date</th>
                            <th>Unlock Time</th>
                            <th>Reward</th>
                            <th>Order Status</th>
                          </tr>
                          {userDepositList.map((row,i) => {
                            return <tr key={i}><td>{row.dAmt}</td><td>{row.startDate}</td><td>{row.unfreezeDate}</td><td>{row.income}</td><td className={row.className}>{row.status}</td></tr>;
                            })}
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

export default DepositHistory;