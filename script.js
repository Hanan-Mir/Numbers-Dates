'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
/////////////////////////////////////////////////
/////////////////////////////////////////////////
containerMovements.innerHTML='';
//--------------FUNCTION FOR DISPLAYING THE MOVEMENTS FOR OUR APPLICATION----------------------------------
const displayMovements=function(movement){
  containerMovements.innerHTML='';
movement.forEach(function(value,index,mov){

  let type=value>0?"deposit":"withdrawal";
  const transactionElement=`<div class="movements__row">
  <div class="movements__type movements__type--${type}">${index+1} ${type}</div>
  <div class="movements__date">3 days ago</div>
  <div class="movements__value">${value}</div>
</div>
  `
  containerMovements.insertAdjacentHTML('afterbegin',transactionElement);
})

}
//displayMovements(account1.movements);
//------------------------------------COMPUTE USER NAMES----------------------
let calcUserName=function(acc){
  acc.forEach(function(value){
    value.UserName=value.owner.toLowerCase().split(' ').map(el=>el[0]).join('');
  })
}
calcUserName(accounts);
//------------------------------------TOTAL AMOUNT----------------------------
// let totalMovementSum=function(acc){
// acc.accountBalance=acc.forEach(function(value){
//   let sum=0;
//   value.movements.reduce(function(accum,el,index,arr){
//   sum=accum+el;
//   return sum;
// },0)
// labelBalance.textContent=`${value.accountBalance}EUR`;
// })

// }
let totalMovementSum=function(acc){
 acc.balance=acc.movements.reduce((accu,value,index,arr)=>{ return accu+value;
},0)
labelBalance.textContent=`${acc.balance} EUR`;
}

//totalMovementSum(account1);
//-----------------calculate summary----------------------------
const calcSummary=function(acc){
  const deposits=acc.movements.filter(amount=>amount>0).reduce((acc,curVal)=>acc+curVal,0);
  labelSumIn.textContent=`${deposits}`;
  const withdrawls=acc.movements.filter(amount=>amount<0).reduce((acc,currVal)=>acc+currVal,0);
  labelSumOut.textContent=`${withdrawls}`;
  const intrests=acc.movements.filter(amount=>amount>0).map(val=>(val*acc.interestRate)/100).filter(el=>el>=1).reduce((acc,curVal)=>acc+curVal,0);
  labelSumInterest.textContent=`${intrests}`;
}
//calcSummary(account1.movements);
//--------------------------update UI---------------------------
let updateUI=function(acc){
calcSummary(acc);
totalMovementSum(acc);
displayMovements(acc.movements);
}





//-------------------------------------------------------LOGIN FUNCTION----------------------------------
let currentUser;
btnLogin.addEventListener('click',function(e){
  e.preventDefault();
currentUser=accounts.find((acc)=>acc.UserName===inputLoginUsername.value)
if(currentUser?.pin===Number(inputLoginPin.value)){
  //change opacity
  containerApp.style.opacity=1;
  //display user Name
  labelWelcome.textContent=`Welcome back ,${currentUser.owner.split(' ')[0]}`
  // remove the login and pin 
  inputLoginPin.value=inputLoginUsername.value='';
  inputLoginPin.blur();
//display movements;
displayMovements(currentUser.movements);
//display summary
calcSummary(currentUser);
//display total movements sum
totalMovementSum(currentUser);
//get array dynamically 
let myArray=Array.from(document.querySelectorAll('.movements__value'),(el)=>Number(el.textContent));
console.log(myArray)
}
})
//----------------------------transfer function-------------------------
btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  let amount=Number(inputTransferAmount.value);
  let transferTo=accounts.find(acc=>acc.UserName===inputTransferTo.value);
if(transferTo && currentUser.balance>amount &&transferTo!==currentUser.UserName &&amount >0){
  transferTo.movements.push(amount);
  currentUser.movements.push(amount);
  updateUI(currentUser);
  
}
inputTransferAmount.value=inputTransferTo.value=' ';
})
//--------------------------------delete account---------------
btnClose.addEventListener('click',function(e){
e.preventDefault();
const userPin=Number(inputClosePin.value);
const userCloseName=inputCloseUsername.value;
if(userCloseName===currentUser.UserName && userPin===currentUser.pin){
  let getIndex=accounts.findIndex((acc)=>acc.UserName===userCloseName)
  accounts.splice(getIndex,1);
  containerApp.style.opacity=0;
  
}
inputClosePin.value=inputCloseUsername.value='';
})
//-----------------------------------loan request------------------------------
btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  console.log('loan passed');
  const loanAmount=Number(inputLoanAmount.value);
  let checkEligbility=currentUser.movements.some(el=>el>=loanAmount*0.1);
  if(checkEligbility){
    currentUser.movements.push(loanAmount);
    updateUI(currentUser);
  }
})
//--------------------------------sort movements---------------------------------
let sorted=false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  //console.log('sort clicked');
  if(sorted===false){
    currentUser.movements.sort((a,b)=>a-b);
displayMovements(currentUser.movements);
sorted=true;
  }
  else{
    sorted=false;
    currentUser.movements.sort((a,b)=>b-a);
    displayMovements(currentUser.movements); 
  }
})
// LECTURES
