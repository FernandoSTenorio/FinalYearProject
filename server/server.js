const express = require('express');
const cors = require('cors');
const sendGrid = require('@sendgrid/mail');
const SENDGRID_API_KEY = require('SENDGRID_API_KEY');


sendGrid.setApiKey('SENDGRID_API_KEY');
const app = express();
app.use(cors());

/**
 * This functions creates a welcome page;
 */
app.get('/', (req, res) => {
    res.send('Welcome to SendGrid!!!!');
});

/**
 * Connects to server, and send the email through the API
 */
app.get('/send-email', (req, res) => {
    
    try{
        //start the query
        const { recipient, sender, topic, text } = req.query;

        //create a message to to send through SendGrid
        const msg = {
            to: recipient,
            from: sender,
            subject: topic,
            text: text
        }
        //Send Email
        sendGrid.send(msg)
        .then((msg) => console.log(text));
    }catch(error){
        console.error(error);
    }

});

app.listen(4000, () => console.log('running server at 4000'));