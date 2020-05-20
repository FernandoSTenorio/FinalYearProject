import firebase from 'firebase';
//Firebase API Details
const firebaseConfig = {
        apiKey: "AIzaSyC4wkdOkcjb6HMVAN2tJPzB0xEAg34qDyM",
        authDomain: "myblogapp-9547e.firebaseapp.com",
        databaseURL: "https://myblogapp-9547e.firebaseio.com",
        projectId: "myblogapp-9547e",
        storageBucket: "gs://myblogapp-9547e.appspot.com",
        messagingSenderId: "757044393965",
        appId: "1:757044393965:web:d3a9686fb92cbb249259e4",
        measurementId: "G-PNTLK7S074"
};

//Initialize the App in Firebase
firebase.initializeApp(firebaseConfig);


//Connect each of the Firebase Features to Different Variable 
export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
