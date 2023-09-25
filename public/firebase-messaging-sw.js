importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-messaging.js');

// const firebaseConfig = {};

const firebaseConfig = {
    apiKey: "AIzaSyBz7rI9K7VGMmO1GbRX7pstXOZgv5-z__E",
    authDomain: "ncmedianewsportal-v2.firebaseapp.com",
    projectId: "ncmedianewsportal-v2",
    storageBucket: "ncmedianewsportal-v2.appspot.com",
    messagingSenderId: "1090074501186",
    appId: "1:1090074501186:web:2a7fc30151dc7530be0ddb",
    measurementId: "G-9F8X1GRERE"
};



firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();



messaging.onBackgroundMessage((payload) => {

    console.log(

        "[firebase-messaging-sw.js] Received background message ",

        payload

    );

    const notificationTitle = payload.notification.title;

    const notificationOptions = {

        body: payload.notification.body,

        icon: payload.notification.image,

    };



    self.registration.showNotification(notificationTitle, notificationOptions);

});