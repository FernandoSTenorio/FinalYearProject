const express = require('express');
const cors = require('cors');
const sendGrid = require('@sendgrid/mail');

const app = express();

sendGrid.setApiKey('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');

app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to SendGrid!!!!');
});

app.get('/send-email', (req, res) => {
    
    try{
        const { recipient, sender, topic, text } = req.query;

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

})

app.listen(4000, () => console.log('running server at 4000'));