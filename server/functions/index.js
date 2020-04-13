const functions = require('firebase-functions');
const fetch = require('node-fetch');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.sendPushNotifications = functions.database.ref('contacts/{id}')
.onCreate(event => {
    const root = event.data.ref
    var messages = [];

    //return the main promise
    return root.child('/users').once('value').then((snapshot) => {
        snapshot.forEach(childSnapshot => {
            var expoToken = childSnapshot.val().expoToken;

            if(expoToken){
                messages.push({
                    "to": expoToken,
                    "body": "New Note Added"
                })
            }
        });

        return Promise.all(messages);
    }).then(messages => {
        fetch('https://exp.host/--/api/v2/push/send',{
            method: 'POST',
            headers: {
                "Accept" : "application/json",
                "Content-Type" : "application.json"
            },
            body: JSON.stringify(messages)
        });
        return;
    })
})