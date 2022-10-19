import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useParams } from 'react-router-dom';
import exportedObject from '../myWeb3/Web3';
import imgRegistration from '../../assets/reg.png';
import './style.css';

const RegisterModalDialog = () => {
    const [userMaticBal, setUserMaticBal] = useState(0);
    const [userAddr, setUserAddr] = useState('');
    const [message, setMessage] = useState('');
    const [waitingConfirmMessage, setWaitingConfirmMessage] = useState('');
    const [messageClass, setMessageClass] = useState('');
    const [myRefer, setMyReferer] = useState('');
    const [estimateGas, setEstimateGas] = useState(0);
    const [isShow, invokeModal] = useState(false);
    const { referer } = useParams('');
  
    const timeLen = 10000;
    const MySwal = withReactContent(Swal);
    const ZERO_ADDR = '0x0000000000000000000000000000000000000000';
    const REFERER_DEFAULT = '0x5e61592E3FcA39951E1f5CeE12081Dff5f46C74a';
    useEffect(() => {
        const coonectWallet = async () => {
            var myobj = await exportedObject.walletConnect();
            var estimateGas = await exportedObject.web3.utils.toHex(exportedObject.web3.utils.toWei('10', 'gwei'));
            setUserAddr(myobj[0]);
            setUserMaticBal(myobj[3]);
            setEstimateGas(estimateGas);
        }
        coonectWallet();
    }, [])
    var refer = '';
    const isRegisteredCheck = async () => {
        
        var { referrer } = await exportedObject.MY_CONTRACT.methods.userInfo(userAddr).call();
        refer = await exportedObject.web3.utils.toHex(referrer);
        if(refer === ZERO_ADDR)
        {
            invokeModal(!false);
            setMyReferer(referer);
            refer = referer;
            if(refer === '' || refer === undefined)
            {
                setMessageClass('text-danger');
                setMessage('This is deafult referer');
                setMyReferer(REFERER_DEFAULT);
            }
            else
            {
                var { maxDeposit } = await exportedObject.MY_CONTRACT.methods.userInfo(refer).call();
                var minDeposit = exportedObject.web3.utils.fromWei(maxDeposit, 'ether');
                if(parseInt(minDeposit) < 5)
                {
                    setMessageClass('text-danger');
                    setMessage('This is inactive refer wallet address.');
                }
                else
                {
                    setMessageClass('text-success');
                    setMessage('This is your referer');
                }
            }
        }
    }
    isRegisteredCheck();
    setInterval(() => {
        isRegisteredCheck();        
    }, 30000);

    const closeModal = () => {
        invokeModal(!true);
    }
    
    const registerBut = async () => {
        setWaitingConfirmMessage('Please wait while confirming your request...');
        var { maxDeposit } = await exportedObject.MY_CONTRACT.methods.userInfo(myRefer).call();
        var minDeposit = exportedObject.web3.utils.fromWei(maxDeposit, 'ether');
        if(parseInt(minDeposit) < 5 && REFERER_DEFAULT !== '0x5e61592E3FcA39951E1f5CeE12081Dff5f46C74a')
        {
            MySwal.fire({
                position: 'center',
                icon: 'error',
                title: 'This is inactive refer wallet address.',
                showConfirmButton: false,
                timer: timeLen,
                timerProgressBar: true,
            });
            return false;
        }

        if(userMaticBal < 0.001)
        {
            MySwal.fire({
                position: 'center',
                icon: 'error',
                title: 'Insufficient MATIC Balance.',
                showConfirmButton: false,
                timer: timeLen,
                timerProgressBar: true,
            });
            return false;
        }

        await exportedObject.MY_CONTRACT.methods.register(myRefer).estimateGas({from: userAddr}).then(async function(gasAmount){
            if(gasAmount >= 8000000)
            {
                MySwal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Method ran out of gas.',
                    showConfirmButton: false,
                    timer: timeLen,
                    timerProgressBar: true,
                });
                return false;
            }
            await exportedObject.MY_CONTRACT.methods.register(myRefer).send({ from: userAddr, gasPrice: estimateGas, gas: gasAmount }).on('confirmation', function(confirmationNumber, receipt){
                if(confirmationNumber > 0 && confirmationNumber < 2)
                {
                    MySwal.fire({
                        position: 'center',
                        icon: 'success',
                        title: `Registration Completed Successfully.`,
                        text: `Your transaction hash \n ${receipt.transactionHash}`,
                        showConfirmButton: false,
                        timer: timeLen,
                        timerProgressBar: true,
                    });
                    //window.location.href = './index.php';
                    return false;
                }
            }).on('error', function(error, receipt) { 
                // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                MySwal.fire({
                    position: 'center',
                    icon: 'error',
                    title: error.message,
                    text: receipt,
                    showConfirmButton: false,
                    timer: timeLen,
                    timerProgressBar: true,
                });
            });
        })
        .catch(function(error){
            MySwal.fire({
                position: 'center',
                icon: 'error',
                title: 'Method ran out of gas.',
                text: error.message,
                showConfirmButton: false,
                timer: timeLen,
                timerProgressBar: true,
            });
            return false;
        });
    }
    
    return (
        <>
            <div className="modal fade show" tabIndex="-1" style={{display: isShow ? 'block' : 'none' }} >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-dark">Confirm Your Inviter</h5>
                            <button type="button" className="btn-close" onClick={closeModal} data-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="registerCardBody">
                                <img src={imgRegistration} alt="Referer" />
                                <h4 className={messageClass}>{message}</h4>
                                <p className={"joinRefer "+messageClass }>{myRefer}</p>
                                <p className={"waitingConfirm text-info"}>{waitingConfirmMessage}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeModal} data-dismiss="modal">Close</button>
                            { message === 'This is your referer' ? <button type="button" className="btn btn-primary" onClick={ registerBut }>Confirm</button> : '' }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterModalDialog