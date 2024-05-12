import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging.js";

function initializeFirebase() {

  const firebaseConfig = {
      apiKey: "AIzaSyAX2FRz3eHgNv2DAUdVfio82CCZalxVYCk",
      authDomain: "cooknote-57a97.firebaseapp.com",
      projectId: "cooknote-57a97",
      storageBucket: "cooknote-57a97.appspot.com",
      messagingSenderId: "1073449674999",
      appId: "1:1073449674999:web:1bc2aae67138591276cbf2",
      measurementId: "G-473RY4JRVK"
  };

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);


  function requestPermissionAndGetToken() {
      Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
              new Notification('Welcome to Cooknote', { body: '👨‍🍳 Stay tuned for daily cooking tips and exclusive recipe drops!' });

              // this token helps firebase send messages to this specific user
              getToken(messaging, { vapidKey: 'BOxokoPZE2q0b0xaJMuKep0lbq_fZwL1IY0-OGZjE81SYrMp71nPQm6JlevfOHR-o_w7Uip_nC-PA3PVGJDJjyo' }).then((token) => {
                  if (token) {
                      //Log this help you to copy the token and test it in the Firebase Console
                      console.log('Token:', token);
                  } else {
                      console.log('No registration token available. Request permission to generate one.');
                  }
              }).catch((err) => {
                  console.log('An error occurred while retrieving token. ', err);
              });

          } else {
              // In case accidentially the user denied the permission
              requestPermissionAndGetToken();
          }
      });
  }

  requestPermissionAndGetToken();

  onMessage(messaging, (payload) => {
      new Notification(payload.notification.title, payload.notification);
  })
}

export default initializeFirebase;