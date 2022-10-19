import Web3 from 'web3';
var web3;
if (typeof window !== 'undefined') 
{
    if(window.web3 !== 'undefined')
    {
        // const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/...');
        const provider = window.ethereum;
        web3 = new Web3(provider);
    }
    else if(window.ethereum !== 'undefined')
    {
        const provider = new Web3(window.ethereum);
        web3 = new Web3(provider);
    }
    else
    {
        web3 = new Web3(window.web3.currentProvider);
    }
} 
else 
{
    // const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/...');
    const provider = window.ethereum;
    web3 = new Web3(provider);
}

const DAI_ABI = [{"inputs": [{"internalType": "string","name": "name","type": "string"},{"internalType": "string","name": "symbol","type": "string"},{"internalType": "uint8","name": "decimals","type": "uint8"}],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "owner","type": "address"},{"indexed": true,"internalType": "address","name": "spender","type": "address"},{"indexed": false,"internalType": "uint256","name": "value","type": "uint256"}],"name": "Approval","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "from","type": "address"},{"indexed": true,"internalType": "address","name": "to","type": "address"},{"indexed": false,"internalType": "uint256","name": "value","type": "uint256"}],"name": "Transfer","type": "event"},{"inputs": [],"name": "DOMAIN_SEPARATOR","outputs": [{"internalType": "bytes32","name": "","type": "bytes32"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "EIP712_REVISION","outputs": [{"internalType": "bytes","name": "","type": "bytes"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "PERMIT_TYPEHASH","outputs": [{"internalType": "bytes32","name": "","type": "bytes32"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "owner","type": "address"},{"internalType": "address","name": "spender","type": "address"}],"name": "allowance","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "spender","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "approve","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "payable","type": "function"},{"inputs": [{"internalType": "address","name": "account","type": "address"}],"name": "balanceOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "decimals","outputs": [{"internalType": "uint8","name": "","type": "uint8"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "spender","type": "address"},{"internalType": "uint256","name": "subtractedValue","type": "uint256"}],"name": "decreaseAllowance","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "spender","type": "address"},{"internalType": "uint256","name": "addedValue","type": "uint256"}],"name": "increaseAllowance","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "account","type": "address"},{"internalType": "uint256","name": "value","type": "uint256"}],"name": "mint","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "value","type": "uint256"}],"name": "mint","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "name","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "owner","type": "address"}],"name": "nonces","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "owner","type": "address"},{"internalType": "address","name": "spender","type": "address"},{"internalType": "uint256","name": "value","type": "uint256"},{"internalType": "uint256","name": "deadline","type": "uint256"},{"internalType": "uint8","name": "v","type": "uint8"},{"internalType": "bytes32","name": "r","type": "bytes32"},{"internalType": "bytes32","name": "s","type": "bytes32"}],"name": "permit","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "symbol","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "totalSupply","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "recipient","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "transfer","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "payable","type": "function"},{"inputs": [{"internalType": "address","name": "sender","type": "address"},{"internalType": "address","name": "recipient","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "transferFrom","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "payable","type": "function"} ];
const MY_CONTRACT_ABI = [{"inputs": [{"internalType": "uint256","name": "_amount","type": "uint256"}],"name": "deposit","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "_daiAddress","type": "address"},{"internalType": "address[3]","name": "_feeReceivers","type": "address[3]"}],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": false,"internalType": "address","name": "user","type": "address"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "Deposit","type": "event"},{"inputs": [{"internalType": "uint256","name": "_amount","type": "uint256"}],"name": "depositBySplit","outputs": [],"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": false,"internalType": "address","name": "user","type": "address"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "DepositBySplit","type": "event"},{"inputs": [],"name": "distributePoolRewards","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "_referral","type": "address"}],"name": "register","outputs": [],"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": false,"internalType": "address","name": "user","type": "address"},{"indexed": false,"internalType": "address","name": "referral","type": "address"}],"name": "Register","type": "event"},{"inputs": [{"internalType": "address","name": "_receiver","type": "address"},{"internalType": "uint256","name": "_amount","type": "uint256"}],"name": "transferBySplit","outputs": [],"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": false,"internalType": "address","name": "user","type": "address"},{"indexed": false,"internalType": "address","name": "receiver","type": "address"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "TransferBySplit","type": "event"},{"inputs": [],"name": "withdraw","outputs": [],"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": false,"internalType": "address","name": "user","type": "address"},{"indexed": false,"internalType": "uint256","name": "withdrawable","type": "uint256"}],"name": "Withdraw","type": "event"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "balStatus","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "dai","outputs": [{"internalType": "contract IERC20","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"},{"internalType": "uint256","name": "","type": "uint256"}],"name": "dayTopUsers","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "defaultRefer","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "depositors","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "feeReceivers","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "getContractBalance","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "getCurDay","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "_user","type": "address"}],"name": "getCurSplit","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "getDepositorsLength","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "_user","type": "address"}],"name": "getMaxFreezing","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "_user","type": "address"}],"name": "getOrderLength","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "_user","type": "address"}],"name": "getTeamDeposit","outputs": [{"internalType": "uint256","name": "","type": "uint256"},{"internalType": "uint256","name": "","type": "uint256"},{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "_user","type": "address"},{"internalType": "uint256","name": "_layer","type": "uint256"}],"name": "getTeamUsersLength","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "isFreezeReward","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "lastDistribute","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "level4Users","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "","type": "address"},{"internalType": "uint256","name": "","type": "uint256"}],"name": "orderInfos","outputs": [{"internalType": "uint256","name": "amount","type": "uint256"},{"internalType": "uint256","name": "start","type": "uint256"},{"internalType": "uint256","name": "unfreeze","type": "uint256"},{"internalType": "bool","name": "isUnfreezed","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "","type": "address"}],"name": "rewardInfo","outputs": [{"internalType": "uint256","name": "capitals","type": "uint256"},{"internalType": "uint256","name": "statics","type": "uint256"},{"internalType": "uint256","name": "directs","type": "uint256"},{"internalType": "uint256","name": "level4Freezed","type": "uint256"},{"internalType": "uint256","name": "level4Released","type": "uint256"},{"internalType": "uint256","name": "level5Left","type": "uint256"},{"internalType": "uint256","name": "level5Freezed","type": "uint256"},{"internalType": "uint256","name": "level5Released","type": "uint256"},{"internalType": "uint256","name": "star","type": "uint256"},{"internalType": "uint256","name": "top","type": "uint256"},{"internalType": "uint256","name": "split","type": "uint256"},{"internalType": "uint256","name": "splitDebt","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "starPool","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "startTime","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "","type": "address"},{"internalType": "uint256","name": "","type": "uint256"},{"internalType": "uint256","name": "","type": "uint256"}],"name": "teamUsers","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "topPool","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "totalUser","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "","type": "address"}],"name": "userInfo","outputs": [{"internalType": "address","name": "referrer","type": "address"},{"internalType": "uint256","name": "start","type": "uint256"},{"internalType": "uint256","name": "level","type": "uint256"},{"internalType": "uint256","name": "maxDeposit","type": "uint256"},{"internalType": "uint256","name": "totalDeposit","type": "uint256"},{"internalType": "uint256","name": "teamNum","type": "uint256"},{"internalType": "uint256","name": "maxDirectDeposit","type": "uint256"},{"internalType": "uint256","name": "teamTotalDeposit","type": "uint256"},{"internalType": "uint256","name": "totalFreezed","type": "uint256"},{"internalType": "uint256","name": "totalRevenue","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"},{"internalType": "address","name": "","type": "address"}],"name": "userLayer1DayDeposit","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"} ];
const DAI_CONTRACT_ADDRESS = '0xC87385b5E62099f92d490750Fcd6C901a524BBcA';
const MY_CONTRACT_ADDRESS = '0xf073cB5ed04172A3008Bbff4722c88caa678508C';
const MY_CONTRACT = new web3.eth.Contract(MY_CONTRACT_ABI, MY_CONTRACT_ADDRESS);
const DAI_CONTRACT = new web3.eth.Contract(DAI_ABI, DAI_CONTRACT_ADDRESS);

const walletConnect = async () => {
    var accounts = [];
    var userAddr;
    var short_user_address;
    var matic_wei_account_balance = 0;
    var matic_format_account_balance = 0;
    var daiBalance = 0;
    if (window.ethereum) 
    {
        try
        {
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddr = accounts[0];
            short_user_address = userAddr.substring(0, 8) + "..." + userAddr.substring(MY_CONTRACT_ADDRESS.length - 8);
            matic_wei_account_balance = await web3.eth.getBalance(userAddr);
            matic_format_account_balance = web3.utils.fromWei(matic_wei_account_balance, 'ether');
            daiBalance = await DAI_CONTRACT.methods.balanceOf(userAddr).call();
            daiBalance = web3.utils.fromWei(daiBalance, 'ether');
            daiBalance = parseFloat(daiBalance).toFixed(2);
            window.ethereum.on('chainChanged', function (accounts) {
                window.location.reload();
                console.log(`account changed ${accounts}`);
            });
            return [
                userAddr,
                short_user_address,
                matic_wei_account_balance,
                matic_format_account_balance,
                daiBalance
            ];
        }
        catch(error)
        {
            console.log(`User can rejected request, Metamask say ${error.message}`);
        }
    }
    else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
    }
    else
    {
        console.error(`Provider of window ethereum node not found.`);
    }
}

const formatDate = (startTime, endTime) => {
    var day;
    var formatTime;
    if(startTime < endTime){
        var perDay = 24 * 60 * 60 * 1000; 
        var perHour = 60 * 60 * 1000;
        var perMinute = 60 * 1000;
        var compareTime = endTime - startTime;
        day = Math.floor(compareTime / perDay);
        var hours =Math.floor(compareTime % perDay / perHour);
        var miniutes = Math.floor(compareTime % perDay % perHour / perMinute);
        if(day < 10){
            day = "0" + day
        }

        if(hours < 10){
            hours = "0" + hours
        }

        if(miniutes < 10){
            miniutes = "0" + miniutes
        }
        formatTime = day + ":" + hours + ":" + miniutes;
    }else{
        formatTime = "00:00:00";
    }
    return formatTime;
}

const getDate = (timstamp) => {
    var date = new Date(timstamp);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var forMatDate = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    return forMatDate
}

const exportedObject = {
    walletConnect,
    formatDate,
    getDate,
    MY_CONTRACT,
    DAI_CONTRACT,
    DAI_CONTRACT_ADDRESS,
    MY_CONTRACT_ADDRESS,
    web3
};

export default exportedObject;