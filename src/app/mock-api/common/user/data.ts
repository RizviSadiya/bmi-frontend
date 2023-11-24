/* eslint-disable */
export const user = {
    id    : (JSON.parse(localStorage.getItem('userDetails')) ? JSON.parse(localStorage.getItem('userDetails')).id : null),
    name  : (JSON.parse(localStorage.getItem('userDetails')) ? JSON.parse(localStorage.getItem('userDetails')).fullname : null),
    email : (JSON.parse(localStorage.getItem('userDetails')) ? JSON.parse(localStorage.getItem('userDetails')).email : null),
    avatar: 'assets/images/avatars/brian-hughes.jpg',
    status: 'online',
    userType: (JSON.parse(localStorage.getItem('userDetails')) ? JSON.parse(localStorage.getItem('userDetails')).userType : null),
    wallet_balance: (JSON.parse(localStorage.getItem('userDetails')) ? JSON.parse(localStorage.getItem('userDetails')).wallet_balance : 0),
};
