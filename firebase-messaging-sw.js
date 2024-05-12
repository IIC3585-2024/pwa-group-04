importScripts('https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js');


const firebaseConfig = {
    apiKey: "AIzaSyAX2FRz3eHgNv2DAUdVfio82CCZalxVYCk",
    authDomain: "cooknote-57a97.firebaseapp.com",
    projectId: "cooknote-57a97",
    storageBucket: "cooknote-57a97.appspot.com",
    messagingSenderId: "1073449674999",
    appId: "1:1073449674999:web:1bc2aae67138591276cbf2",
    measurementId: "G-473RY4JRVK"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage(function(payload) {
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});