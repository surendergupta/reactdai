import React, {useState} from 'react'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import exportedObject from '../myWeb3/Web3.js';

import imgMatic from '../../assets/logo.png';
import imgDai from '../../assets/dai.png';

import './style.css';
const Deposit = () => {
  const [userAddress, setUserAddress] = useState('');
  const [userMaticBalance, setUserMaticBalance] = useState(0);
  const [userDaiBalance, setUserDaiBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  var myobj, estimateGas, gasLimit;
  const timeLen = 10000;
  const MySwal = withReactContent(Swal);
  const getWalletConnect = async () => {
    myobj = await exportedObject.walletConnect();
    setUserAddress(myobj[0]);
    setUserMaticBalance(myobj[3]);
    setUserDaiBalance(myobj[6]);
  }
  getWalletConnect();

  function handleChange(event) {
    if(parseInt(event.target.value) < 50)
    {
      // MySwal.fire({
      //   title: <p>Hello World</p>,
        
      // });
      setDepositAmount(50);
    }

    setDepositAmount(event.target.value);
  }

  async function handleDepositRequest()
  {
    let amount = parseInt(depositAmount);
    if(amount >= 50)
    {
      var amountDep = exportedObject.web3.utils.BN(exportedObject.web3.utils.toWei(depositAmount.toString(), 'ether')).toString();
      var amountEth = exportedObject.web3.utils.fromWei(amountDep, 'ether');
      var { maxDeposit } = await exportedObject.MY_CONTRACT.methods.userInfo(userAddress).call();
      let minDeposit = exportedObject.web3.utils.fromWei(maxDeposit, 'ether');
      if(parseInt(minDeposit) < 1)
      {
        minDeposit = 50;
        
      }
      // minimum 5 balance required
      if(parseInt(amountEth) < parseInt(minDeposit))
      {
        MySwal.fire({
          position: 'center',
          icon: 'error',
          title: `Minimum deposit ${minDeposit} DAI.`,
          showConfirmButton: false,
          timer: timeLen,
          timerProgressBar: true,
        });
        console.log(`Minimum deposit ${minDeposit} DAI.`);
        return false;
      }
      // multiple of 5 balance required
      if(parseInt(amountEth) % 50 !== '0')
      {
        MySwal.fire({
          position: 'center',
          icon: 'error',
          title: 'Multiple of 50 DAI.',
          text: 'Deposit amount must be multiple of 50 DAI.',
          showConfirmButton: false,
          timer: timeLen,
          timerProgressBar: true,
        });
        return false;
      }
      // maximum 2000 balance required
      if(parseInt(amountEth) > 2000)
      {
        MySwal.fire({
          position: 'center',
          icon: 'error',
          title: `Maximum deposit 2000 DAI.`,
          showConfirmButton: false,
          timer: timeLen,
          timerProgressBar: true,
        });
        return false;
      }
      // balance check
      if(parseInt(userDaiBalance) < parseInt(amountEth))
      {
        MySwal.fire({
          position: 'center',
          icon: 'error',
          title: 'Insufficient DAI Balance.',
          showConfirmButton: false,
          timer: timeLen,
          timerProgressBar: true,
        });
        return false;
      }

      var isAppr = await isApprove(exportedObject.MY_CONTRACT_ADDRESS);
      if(isAppr)
      {
        await exportedObject.MY_CONTRACT.methods.deposit(amountDep).estimateGas({from: userAddress}).then(async function(gasAmount){
          if(gasAmount >= 8000000)
          {
            MySwal.fire({
              position: 'center',
              icon: 'error',
              title: 'Method ran out of gas1.',
              showConfirmButton: false,
              timer: timeLen,
              timerProgressBar: true,
            });
            return false;
          }
          else
          {
            estimateGas = exportedObject.web3.utils.toHex(exportedObject.web3.utils.toWei('18', 'gwei'));
            gasLimit = exportedObject.web3.utils.toHex(exportedObject.web3.utils.toWei('0.00083026', 'gwei'));
            estimateGas = exportedObject.web3.utils.toHex(exportedObject.web3.utils.toWei('2.5', 'gwei'));
            console.log(exportedObject.MY_CONTRACT);
            await exportedObject.MY_CONTRACT.methods.deposit(amountDep).send({ from: userAddress, gas: gasLimit, value: 0 })
            .on('transactionHash', function(hash){
              MySwal.fire({
                position: 'center',
                icon: 'success',
                title: `Deposit Request Submittted`,
                text: `Your transaction hash \n ${hash}`,
                showConfirmButton: false,
                timer: 25000,
                timerProgressBar: true,
              });
            })
            .on('confirmation', function(confirmationNumber, receipt){
              if(confirmationNumber > 0 && confirmationNumber < 2)
              {
                MySwal.fire({
                  position: 'center',
                  icon: 'success',
                  title: `Deposit Request Comfirmed`,
                  text: `Your transaction hash \n ${receipt.transactionHash}`,
                  showConfirmButton: false,
                  timer: timeLen,
                  timerProgressBar: true,
                });
                window.location.href = './deposit-history.php';
                return false;
              }
            })
            .on('error', function(error, receipt) {
              if(error)
              {
                MySwal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'Error In Deposit.',
                  text: error,
                  showConfirmButton: false,
                  timer: timeLen,
                  timerProgressBar: true,
                });
                return false;
              }              
            });
          }
        })
        .catch(function(error){
          MySwal.fire({
            position: 'center',
            icon: 'error',
            title: 'Method ran out of gas2111.',
            text: error.message,
            showConfirmButton: false,
            timer: timeLen,
            timerProgressBar: true,
          });
          return false;
        });
      }
      else
      {
        setApprove(exportedObject.MY_CONTRACT_ADDRESS).then(async function(error){
          if(error)
          {
            MySwal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error In Deposit.',
              text: error.message,
              showConfirmButton: false,
              timer: timeLen,
              timerProgressBar: true,
            });
          }
          else
          {
            await exportedObject.MY_CONTRACT.methods.deposit(amount).estimateGas({from: userAddress}).then(async function(gasAmount){
              if(gasAmount >= 8000000)
              {
                MySwal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'Method ran out of gas3.',
                  showConfirmButton: false,
                  timer: timeLen,
                  timerProgressBar: true,
                });
                return false;
              }
              else
              {
                estimateGas = exportedObject.web3.utils.toHex(exportedObject.web3.utils.toWei('30', 'gwei'));
                await exportedObject.MY_CONTRACT.methods.deposit(amount).send({ from: userAddress, gasPrice: estimateGas, gas: gasAmount })
                .on('transactionHash', function(hash){
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: `Deposit Request Submittted`,
                    text: `Your transaction hash \n ${hash}`,
                    showConfirmButton: false,
                    timer: 25000,
                    timerProgressBar: true,
                  });
                })
                .on('confirmation', function(confirmationNumber, receipt){
                  if(confirmationNumber > 0 && confirmationNumber < 2)
                  {
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: `Deposit Request Comfirmed`,
                      text: `Your transaction hash \n ${receipt.transactionHash}`,
                      showConfirmButton: false,
                      timer: timeLen,
                      timerProgressBar: true,
                    });
                    window.location.href = './deposit-history.php';
                    return false;
                  }
                })
                .on('error', function(error, receipt) {
                  if(error)
                  {
                    Swal.fire({
                      position: 'center',
                      icon: 'error',
                      title: 'Error In Deposit.',
                      text: error,
                      showConfirmButton: false,
                      timer: timeLen,
                      timerProgressBar: true,
                    });
                    return false;
                  }
                });
              }
            })
            .catch(function(error){
              MySwal.fire({
                position: 'center',
                icon: 'error',
                title: 'Method ran out of gas4.',
                text: error.message,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              });
              return false;
            });
          }
        });
      }
    }
  }

  async function isApprove(to)
  {
    let res = await exportedObject.DAI_CONTRACT.methods.allowance(userAddress, to).call();
    var allowanceAmount = (res);
    if(allowanceAmount > 5000e18) 
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  const setApprove = async (to) => 
  {
    var amount = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
    await exportedObject.DAI_CONTRACT.methods.approve(to, amount).estimateGas({from: userAddress}).then(async function(gasAmount){
      if(gasAmount >= 8000000){
        MySwal.fire({
          position: 'center',
          icon: 'error',
          title: 'Method ran out of gas1.',
          showConfirmButton: false,
          timer: timeLen,
          timerProgressBar: true,
        });
        return false;
      }
      else
      {
        estimateGas = exportedObject.web3.utils.toHex(exportedObject.web3.utils.toWei('10', 'gwei'));
        await exportedObject.DAI_CONTRACT.methods.approve(to, amount).send({ from: userAddress, gasPrice: estimateGas, gas: gasAmount }, function(error, transactionHash){
          if(error)
          {
            MySwal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error In Approve DAI.',
              text: error.message,
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
              title: `Approve DAI Successfully. Wait for Deposit...`,
              text: `Your transaction hash \n ${transactionHash}`,
              showConfirmButton: false,
              timer: 18000,
              timerProgressBar: true,
            });
          }
        })
        .catch((error) => {
          MySwal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error In Approve DAI.',
            text: error.message,
            showConfirmButton: false,
            timer: timeLen,
            timerProgressBar: true,
          });
        });
      }
    });
  }
  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col-12 col-md-12'>
            <div className='text-center'>
              <h5 className='mt-3 mb-3'><span className='badge badge-info'>Deposit DAI</span></h5>
            </div>
            <div className='row'>
              <div className='col-12 col-sm-6 col-md-3'>
                <div className='info-box bg-purple'>
                  <span className='info-box-icon elevation-1'>
                    <img src={imgMatic} alt='MATIC' height='30' />
                  </span>
                  <div className='info-box-content'>
                    <span className='info-box-text text-dark'>
                      <b>Matic Balance</b>
                    </span>
                    <span className='info-box-number maticBal'>{userMaticBalance}</span>
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
                      <b>Dai Balance</b>
                    </span>
                    <span className='info-box-number maticBal'>{userDaiBalance}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='card card-primary card-outline'>
              <div className='card-body'>
                <div className="input-group">
                  <input type="text" onChange={handleChange} className="form-control form-control-border border-width-2 inputAmount" value={depositAmount} placeholder="50" />
                  <div className="input-group-append">
                    <span className="input-group-text">
                      <img src={imgDai} height="20" alt="DAI" /> 
                      <span className="text-orange"><b>DAI</b></span>
                    </span>
                  </div>
                </div>
                <p className="mb-2 text-dark"><small>Minimum deposit 50 DAI. A ratio of 50 max 2000</small></p>
                <div className='depositInfo text-dark'>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><span className="depositAmount">{depositAmount}</span> DAI</td>
                        <td className="text-center">+</td>
                        <td className="text-center">16%</td>
                        <td className="text-center">=</td>
                        <td className="text-center"><span className="total">{parseInt(depositAmount) + (depositAmount * 0.16)}</span> DAI</td>
                      </tr>
                      <tr>
                        <td>Deposit</td>
                        <td className="text-center">&nbsp;</td>
                        <td className="text-center">Each cycle</td>
                        <td className="text-center">&nbsp;</td>
                        <td className="text-center">Deposit and interest</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="mb-2">10 Day per cycle. 16% per cycle</p>
                  <p className="mb-3">You will have to redeposit every time after each cycle. It will have to be either the same amount or bigger amount. Every 2 cycle you deposit 1 extra Day will be added without interest. Maximum 45 Days.</p>
                  <button type='button' onClick={handleDepositRequest} className="btn btn-primary btn-block">Confirm</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Deposit;