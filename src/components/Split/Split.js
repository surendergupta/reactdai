import React, {useState} from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import exportedObject from '../myWeb3/Web3.js';
import imgDai from '../../assets/dai.png';

import './style.css';
const Split = () => {
  const [userAddress, setUserAddress] = useState('');
  const [availableAmount, setAvailableAmount] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [transferAmount, setTransferAmount] = useState(0);
  const [receiverAddress, setReceiverAddress] = useState('');
  const timeLen = 10000;
  const MySwal = withReactContent(Swal);
  var myobj, estimateGas, gasLimit;
  var splitAmt = 0;
  const getWalletConnect = async () => {
    myobj = await exportedObject.walletConnect();
    setUserAddress(myobj[0]);
    gasLimit = exportedObject.web3.utils.toHex(exportedObject.web3.utils.toWei('0.00083026', 'gwei'));
    estimateGas = exportedObject.web3.utils.toHex(exportedObject.web3.utils.toWei('5', 'gwei'));
    splitAmt = await exportedObject.MY_CONTRACT.methods.getCurSplit(userAddress).call();
    splitAmt = parseFloat(splitAmt/1000000000000000000);
    setAvailableAmount(splitAmt);
  }
  getWalletConnect();
  function handleDepositAmount(event) {
    if(parseInt(event.target.value) < 50)
    {
      return false;
    }
    setDepositAmount(event.target.value);
  }

  function handleTransferAmount(event) {
    if(parseInt(event.target.value) < 50)
    {
      return false;
    }
    setTransferAmount(event.target.value);
  }

  function handleReceiverAddress(event) {
    if(parseInt(event.target.value) < 50)
    {
      return false;
    }
    setReceiverAddress(event.target.value);
  }
  
  async function handleSplitDeposit() {
    if(depositAmount >= 5 && depositAmount <= 50 && depositAmount % 5 === 0 && depositAmount <= availableAmount)
    {
      let deamount = exportedObject.web3.utils.BN(exportedObject.web3.utils.toWei(depositAmount.toString(), 'ether')).toString();
      await exportedObject.MY_CONTRACT.methods.depositBySplit(deamount).send({ from: userAddress, gasPrice: estimateGas, gas: gasLimit }, function(error, transactionHash){
        if(error)
        {
          MySwal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error Deposit by split.',
            text: error,
            showConfirmButton: false,
            timer: timeLen,
            timerProgressBar: true,
          });
        }
        if(transactionHash)
        {
          MySwal.fire({
            position: 'center',
            icon: 'success',
            title: `Deposit By Split Successfully`,
            text: `Your transaction hash \n ${transactionHash}`,
            showConfirmButton: false,
            timer: timeLen,
            timerProgressBar: true,
          });
        }
      })
      .catch((error) => {
        MySwal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error Deposit by split.',
          text: error.message,
          showConfirmButton: false,
          timer: timeLen,
          timerProgressBar: true,
        });
      });
    }
    else
    {
      MySwal.fire({
        position: 'center',
        icon: 'error',
        text: 'Transfer amount required or multiple of 5 or not more than 200 or split DAI amount required.',
        showConfirmButton: false,
        timer: timeLen,
        timerProgressBar: true,
      });
      return false;
    }
  }
  
  async function handleSplitTransfer() {
    if(exportedObject.web3.utils.isAddress(receiverAddress))
    {
      if(transferAmount >= 5 && transferAmount <= 50 && transferAmount % 5 === 0 && transferAmount <= availableAmount)
      {
        let tramount = exportedObject.web3.utils.BN(exportedObject.web3.utils.toWei(transferAmount.toString(), 'ether')).toString();
        await exportedObject.MY_CONTRACT.methods.transferBySplit(receiverAddress, tramount).send({ from: userAddress, gasPrice: estimateGas, gas: gasLimit }, function(error, transactionHash){
          if(error)
          {
            MySwal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error Transfer by split.',
              text: error,
              showConfirmButton: false,
              timer: timeLen,
              timerProgressBar: true,
            });
          }
          if(transactionHash)
          {
            MySwal.fire({
              position: 'center',
              icon: 'success',
              title: `Success Transfer by split.`,
              text: `Your transaction hash \n ${transactionHash}`,
              showConfirmButton: false,
              timer: timeLen,
              timerProgressBar: true,
            });
          }
        })
        .catch((error) => {
          MySwal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error Transfer by split.',
            text: error.message,
            showConfirmButton: false,
            timer: timeLen,
            timerProgressBar: true,
          });
        });
      }
      else
      {
        MySwal.fire({
          position: 'center',
          icon: 'error',
          text: 'Transfer amount required or multiple of 5 or not more than 200 or split DAI amount required.',
          showConfirmButton: false,
          timer: timeLen,
          timerProgressBar: true,
        });
        return false;
      }
    }
    else
    {
      MySwal.fire({
        position: 'center',
        icon: 'error',
        text: 'Enter a valid receiver address or required.',
        showConfirmButton: false,
        timer: timeLen,
        timerProgressBar: true,
      });
      return false;
    }
  }

  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col-12 col-md-12'>
            <div className='text-center'>
              <h5 className='mt-2 mb-2'><span className='badge badge-info'>SPLIT INCOME</span></h5>
            </div>
            <div className='row'>
              <div className='col-12 col-sm-6 col-md-6 mb-2'>
                <div className='card card-primary card-outline'>
                  <div className='card-body'>
                    <div className='text-center'>
                      <h5 className='mb-2'><span className='badge badge-info'>SPLIT DEPOSIT</span></h5>
                    </div>
                    <div className="form-group mb-3">
                      <input type="text" className="form-control freezingAmt" id="InputBusd" readOnly value={availableAmount} />
                    </div>
                    <div className="input-group">
                      <input type="text" onChange={handleDepositAmount} className="form-control form-control-border border-width-2" value={depositAmount} placeholder="50" />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <img src={imgDai} height="20" alt="DAI" /> 
                          <span className="text-orange"><b>DAI</b></span>
                        </span>
                      </div>
                    </div>
                    <div className='text-center'>
                      <button type='button' onClick={handleSplitDeposit} className="btn btn-primary btn-block mt-3 mb-1">Deposit</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-12 col-sm-6 col-md-6 mb-2'>
                <div className='card card-primary card-outline'>
                  <div className='card-body'>
                    <div className='text-center'>
                      <h5 className='mb-2'><span className='badge badge-info'>SPLIT TRANSFER</span></h5>
                    </div>
                    <div className="form-group mb-3">
                      <input type="text" className="form-control" id="InputBusd" readOnly value={availableAmount} placeholder='0' />
                    </div>
                    <div className="input-group mb-3">
                      <input type="text" onChange={handleTransferAmount} className="form-control form-control-border border-width-2" value={transferAmount} placeholder="50" />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <img src={imgDai} height="20" alt="DAI" /> 
                          <span className="text-orange"><b>DAI</b></span>
                        </span>
                      </div>
                    </div>
                    <div className="form-group">
                      <input type="text" onChange={handleReceiverAddress} className="form-control receiver" id="InputReceiverAddress" value={receiverAddress} placeholder='Enter receiver address' />
                    </div>
                    <div className='text-center'>
                      <button type='button' onClick={handleSplitTransfer} className="btn btn-primary btn-block mt-3 mb-1">Transfer</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='mb-4'>&nbsp;</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Split;