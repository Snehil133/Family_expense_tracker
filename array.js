'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Snehil Gupta',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-12-20T17:01:17.194Z',
    '2022-12-25T23:36:17.929Z',
    '2022-12-28T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'hi-IN', // de-DE
};

const account2 = {
  owner: 'Kavita Snehil Gupta',
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

const account3 = {
  owner: 'Aayushi Gupta',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Aaryan Kavita Gupta',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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


const formatMovementDate = function(date, locale) {
  const calcDaysPassed = (date1, date2) =>Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24))

  const daysPassed = calcDaysPassed (new Date(), date)
  // console.log(daysPassed)

  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <= 7) return `${daysPassed} days ago`

  //   const day = `${date.getDate()}`.padStart(2, 0)
  // const month = `${date.getMonth() + 1}`.padStart(2, 0)
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`

  return new Intl.DateTimeFormat(locale).format(date)
}

const formatCurrency = function(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value)
}

const displayMovements = function(acc, sort = false){

  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a,b) => a - b) : acc.movements;

  movs.forEach(function(mov, i){

    const type = mov > 0 ? 'deposite':'withdrawal'

    const date =  new Date(acc.movementsDates[i])
    const displayDate = formatMovementDate(date, acc.locale)

    const formatedmov = formatCurrency(mov, acc.locale, acc.currency)

    const html =`
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formatedmov}</div>
  </div>`

  containerMovements.insertAdjacentHTML('afterbegin', html)
  })
}


const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCurrency(acc.balance, acc.locale, acc.currency)
};


const calcDisplaySummary = function(acc){
  const income = acc.movements.filter(mov => mov >0).reduce((acc, mov) => acc + mov,0)
  labelSumIn.textContent = formatCurrency(income, acc.locale, acc.currency)

  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  labelSumOut.textContent = formatCurrency(Math.abs(out), acc.locale, acc.currency)
  

  const interest =acc.movements.filter(mov => mov >0).map(deposit => (deposit * acc.interestRate)/100).filter((int, i, arr) =>{
    // console.log(arr);
    return int >= 1;
  }).reduce((acc, int) => acc + int,0)
  labelSumInterest.textContent = formatCurrency(interest, acc.locale, acc.currency)
  
}



const createUserName = function(accs){
  accs.forEach(function(acc){
   acc.userName = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('')
  })
}

createUserName(accounts)

const updateUI = function(acc){
   //Display movements
   displayMovements(acc)

   //Display balance
   calcDisplayBalance(acc)
 
   //Display summary
   calcDisplaySummary(acc)
}

const startLogOutTimer = function(){

  const tick = function(){
    const min = String(Math.trunc(time / 60)).padStart(2,0);
    const sec = String(Math.trunc(time % 60)).padStart(2,0);
    // In each call back, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    

    // When 0 second, user should log out
    if(time === 0){
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    // decrease one second
    time--
  }
  // setting the time to 5 min
  let time = 300;

  // call timer every second
  tick()
 const timer = setInterval(tick,1000)

 return timer;

}

//Event handlers
let currentAccount, timer;

//Fake always logged in
// currentAccount = account1;
// updateUI(currentAccount)
// containerApp.style.opacity = 100;




btnLogin.addEventListener('click', function(e) {
  e.preventDefault();

 currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value)


 if(currentAccount?.pin === +(inputLoginPin.value)){

  //Display UI and message
  labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
  containerApp.style.opacity = 100;

  //Create Date and time
  //API experiment
  const now = new Date();
  const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  weekday: 'long',
}


labelDate.textContent = Intl.DateTimeFormat(currentAccount.locale, options).format(now)

  // const day = `${now.getDate()}`.padStart(2, 0)
  // const month = `${now.getMonth() + 1}`.padStart(2, 0)
  // const year = now.getFullYear();
  // const hour = `${now.getHours()}`.padStart(2, 0)
  // const minute = `${now.getMinutes()}`.padStart(2, 0)
  // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`
  
  //Clear input field
  inputLoginUsername.value = inputLoginPin.value = ''
  inputLoginPin.blur()

  //Timer
  if(timer) clearInterval(timer)

  timer = startLogOutTimer()
  //update UI
 updateUI(currentAccount)
 }
 else{
   containerApp.style.opacity = 0;
   containerApp(alert('Invalid user!'));  
 }
});

btnTransfer.addEventListener('click', function(e){
e.preventDefault();
 const amount = +inputTransferAmount.value;
 const receiverAcc = accounts.find(acc => acc.userName === inputTransferTo.value)
 inputTransferAmount.value = inputTransferTo.value = ''

 if(amount > 0 && 
  receiverAcc && 
  currentAccount.balance >= amount && receiverAcc?.userName !== currentAccount.userName){

  //Doing the transfer
  currentAccount.movements.push(-amount)
  receiverAcc.movements.push(amount)

  // Add transfer Date
  currentAccount.movementsDates.push(new Date().toISOString());
  receiverAcc.movementsDates.push(new Date().toISOString());

   //update UI
   updateUI(currentAccount)

   //Reset timer
   clearInterval(timer)
   timer = startLogOutTimer();
 }
})

// Loan Amount

btnLoan.addEventListener('click', function(e) {
  e.preventDefault()


const amount = Math.floor(inputLoanAmount.value)

if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
  setTimeout(function() {
    // Add movements
  currentAccount.movements.push(amount)

  // Add loan Date
  currentAccount.movementsDates.push(new Date().toISOString());

  // Update UI
  updateUI(currentAccount)

    //Reset timer
    clearInterval(timer)
    timer = startLogOutTimer();

}, 2500)
}
inputLoanAmount.value = '';
});

//Closing Account
btnClose.addEventListener('click', function(e){
  e.preventDefault()

  if(inputCloseUsername.value === currentAccount.userName && +(inputClosePin.value) === currentAccount.pin){
    const index = accounts.findIndex(acc => acc.userName === currentAccount.userName) 
    console.log(index);

    //Delete account
    accounts.splice(index, 1)

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = ''
});

let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})



