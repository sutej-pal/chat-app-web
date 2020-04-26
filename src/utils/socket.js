import socketIOClient from 'socket.io-client';
const apiUrl = process.env.VUE_APP_base_url

// const socket = io({ path: '/bridge' });
const socket = socketIOClient(apiUrl, {
  agent: false,
  origins: '*:*',
  secure: true,
  rememberUpgrade: true,
  transports: ['websocket', 'pooling'],
  rejectUnauthorized: false,
  upgrade: true
});

export default socket;
