import React, {useEffect, useState} from 'react';
import exportedObject from '../myWeb3/Web3.js';

import './style.css';
const DepositHistory = () => {
  const [userAddress, setUserAddress] = useState('');
  var userOrderList = [];  
  useEffect(() => {
    var myobj;
    const getWalletConnect = async () => {
      myobj = await exportedObject.walletConnect();
      setUserAddress(myobj[0]);
  
      var length = await exportedObject.MY_CONTRACT.methods.getOrderLength(userAddress).call();
      for(let i = length - 1; i >= 0; i--)
      {
          var {amount, start, unfreeze, isUnfreezed} = await exportedObject.MY_CONTRACT.methods.orderInfos(userAddress, i).call();
          var depositHtml = "<tr>"
          var startTS = parseInt(start)*1000;
          var dAmt = exportedObject.web3.utils.fromWei(amount.toString(), 'ether');
          depositHtml = depositHtml + "<td><span class='DepC2 DepCZ1'>$" + dAmt + "</span></td>";
          var startDate = exportedObject.getDate(startTS);
          depositHtml = depositHtml + "<td><span class='DepC3'>" + startDate + "</span></td>";
          var unfreezeTS = parseInt(unfreeze)*1000;
          var unfreezeDate = exportedObject.getDate(unfreezeTS);
          depositHtml = depositHtml + "<td><span class='DepC4'>" + unfreezeDate + "</span></td>";
          var income = (parseInt(exportedObject.web3.utils.fromWei(amount.toString(), 'ether')) * (16 / 100));
          depositHtml = depositHtml + "<td><span class='DepC4 DepCZ2'>$" + income + "</span></td>";
          var date = new Date();
          var timeNow = date.getTime()
          var status;
          var className = '';
          if(timeNow < unfreezeTS){
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
          depositHtml = depositHtml + "<td><b><span class='" + className + "'>" + status + "</span></b></td>"
          depositHtml = depositHtml + "</tr>";
          userOrderList.push(depositHtml);
      }
    }
    getWalletConnect();
  }, [])
  
  
  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col-12 col-md-12'>
            <div className='text-center'>
              <h5 className='mt-2 mb-2'><span className='badge badge-info'>Deposit History</span></h5>
            </div>
            <div className='row'>
              <div className='col-12 col-sm-12 col-md-12'>
                <div className='card card-primary card-outline'>
                  <div className='card-body'>
                    <div className="table-responsive">
                      <table className="table table-bordered DepTab">
                        <tbody>
                          <tr>
                            <th>Amount</th>
                            <th>Deposit Date</th>
                            <th>Unlock Time</th>
                            <th>Reward</th>
                            <th>Order Status</th>
                          </tr>
                          {userOrderList}
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