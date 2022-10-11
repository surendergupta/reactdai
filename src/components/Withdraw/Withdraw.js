import React, {useState} from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import exportedObject from '../myWeb3/Web3.js';
import './style.css';
const Withdraw = () => {
  const [userAddress, setUserAddress] = useState('');
  const [userCapital, setUserCapital] = useState(0);
  const [userStaticReward, setUserStaticReward] = useState(0);
  const [userDirectReward, setUserDirectReward] = useState(0);
  const [userLevel4Reward, setUserLevel4Reward] = useState(0);
  // const [userLevel5Left, setUserLevel5Left] = useState(0);
  const [userLevel5Freezed, setUserLevel5Freezed] = useState(0);
  const [userLevel5Reward, setUserLevel5Reward] = useState(0);
  const [userStarReward, setUserStarReward] = useState(0);
  const [userTopReward, setUserTopReward] = useState(0);
  const [userTotalReward, setUserTotalReward] = useState(0);
  const timeLen = 10000;
  const MySwal = withReactContent(Swal);
  var myobj, estimateGas, gasLimit;
  const getWalletConnect = async () => {
    myobj = await exportedObject.walletConnect();
    setUserAddress(myobj[0]);
    var {capitals, statics, directs, level4Released, level5Released, level5Freezed, star, top} = await exportedObject.MY_CONTRACT.methods.rewardInfo(userAddress).call();
    let capamount = exportedObject.web3.utils.BN(exportedObject.web3.utils.fromWei(capitals.toString(), 'ether')).toString();
    var capital = parseFloat(capamount);
    setUserCapital(capital.toFixed(2));
    var orderLength = parseInt(await exportedObject.MY_CONTRACT.methods.getOrderLength(userAddress).call());
    var timeNow = ((new Date()).getTime() / 1000);
    var timeStep = 24 * 60 * 60;
    var totalStatic = parseInt(statics);
    for(var i = 0; i < orderLength; i++)
    {
      var {amount, start, unfreeze, isUnfreezed} = await exportedObject.MY_CONTRACT.methods.orderInfos(userAddress, i).call();
      var formatAmt = parseInt(amount);
      var formatStart = parseInt(start); 
      var formatUnfreeze = parseInt(unfreeze);
      if(!isUnfreezed)
      {
        if(timeNow > formatUnfreeze)
        {
          totalStatic = totalStatic + (formatAmt * 160 / 1000)
        }
        else
        {
          let dayPassed = (timeNow - formatStart) / timeStep;
          if(dayPassed > 10)
          {
            totalStatic = totalStatic + (formatAmt * 160 / 1000);
          }
          else
          {
            totalStatic = totalStatic + (formatAmt * 10  * dayPassed / 1000);
          }
        }
      }
    }
    totalStatic = parseInt(totalStatic);
    var staticWithdrawable = parseFloat(exportedObject.web3.utils.fromWei(totalStatic.toString(), 'ether') * 0.7);
    setUserStaticReward(staticWithdrawable.toFixed(2));
    var directReward = parseFloat(exportedObject.web3.utils.fromWei(directs.toString()) * 0.7);
    setUserDirectReward(directReward.toFixed(2));
    var level4Reward = parseFloat(exportedObject.web3.utils.fromWei(level4Released.toString()) * 0.7);
    setUserLevel4Reward(level4Reward.toFixed(2));
    //var level5Left1 = parseFloat(exportedObject.web3.utils.fromWei(level5Left.toString()) * 0.7);
    // setUserLevel5Left(level5Left.toFixed(2));
    var level5Freezed1 = parseFloat(exportedObject.web3.utils.fromWei(level5Freezed.toString()) * 0.7);
    setUserLevel5Freezed(level5Freezed1.toFixed(2));
    var level5Reward = parseFloat(exportedObject.web3.utils.fromWei(level5Released.toString()) * 0.7);
    setUserLevel5Reward(level5Reward.toFixed(2));
    var starReward = parseFloat(exportedObject.web3.utils.fromWei(star.toString()) * 0.7);
    setUserStarReward(starReward.toFixed(2));
    var topReward = parseFloat(exportedObject.web3.utils.fromWei(top.toString()) * 0.7);
    setUserTopReward(topReward.toFixed(2));
    var totalReward = 0;
    if(capital > 0)
    {
      totalReward = capital+staticWithdrawable+directReward+level4Reward+level5Reward+starReward+topReward;
    }
    else
    {
      totalReward = capital+directReward+level4Reward+level5Reward+starReward+topReward;
    }
    setUserTotalReward(totalReward.toFixed(2));
  }
  getWalletConnect();

  const handleWithdraw = async () => {
    gasLimit = exportedObject.web3.utils.toHex(exportedObject.web3.utils.toWei('0.00083026', 'gwei'));
    estimateGas = exportedObject.web3.utils.toHex(exportedObject.web3.utils.toWei('5', 'gwei'));
    await exportedObject.MY_CONTRACT.methods.withdraw().send({from: userAddress, gasPrice: estimateGas, gas: gasLimit }, function(error, transactionHash){
      if(error)
      {
        MySwal.fire({
          position: 'center',
          icon: 'error',
          title: 'Withdraw request failed.',
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
          title: `Withdraw requested successfully`,
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
        title: 'Something went wrong in withdraw process.',
        text: error.message,
        showConfirmButton: false,
        timer: timeLen,
        timerProgressBar: true,
      });
    });
  }
  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col-12 col-md-12'>
            <div className='text-center'>
              <h5 className='mt-2 mb-2'><span className='badge badge-info'>Withdraw DAI</span></h5>
            </div>
            <div className='row'>
              <div className='col-12 col-sm-12 col-md-12'>
                <div className='card card-primary card-outline'>
                  <div className='card-body'>
                    <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-center list-group-item-primary">Unlock Principal
                        <span className="badge bg-primary rounded-pill">{userCapital}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">Cycle Reward
                        <span className="badge bg-primary rounded-pill">{userStaticReward}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">Level 1
                        <span className="badge bg-primary rounded-pill">{userDirectReward}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">Level 2-5
                        <span className="badge bg-primary rounded-pill">{userLevel4Reward}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">Level 6-20
                        <span className="badge bg-primary rounded-pill">{userLevel5Reward}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center list-group-item-warning">Freezing
                        <span className="badge bg-primary rounded-pill">{userLevel5Freezed}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">Reward 4 Star
                        <span className="badge bg-primary rounded-pill">{userStarReward}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">Reward Top Player
                        <span className="badge bg-primary rounded-pill">{userTopReward}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center list-group-item-success">Available withdrawal
                        <span className="badge bg-primary rounded-pill">{ userTotalReward }</span>
                      </li>
                    </ul>
                    <div className='text-center'>
                      <button type='button' onClick={handleWithdraw} className="btn btn-primary btn-block mt-3 mb-1">Withdraw</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='mb-3'>&nbsp;</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Withdraw;