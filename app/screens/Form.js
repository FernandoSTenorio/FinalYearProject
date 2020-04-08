import React from 'react';
import {StyleSheet, Text, View, Image, ScrollView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import Headers from '../components/Headers';
import Button from '../components/Button';
import Input from '../components/Input';
import Colors from '../components/constants/colors';
// import FilePickerManager from '..react-native-file-picker'
import * as DocumentPicker from 'expo-document-picker';
import { sendGridEmail } from 'react-native-sendgrid'
import functions from '@firebase/functions';


class Form extends React.Component{

    constructor(props){
        super(props)
        this.state={
            name:'',
            email:'',
            phone:'',
            recipient:'',
            subject:'',
            text:'',
            sender:'',
            description:'',
            documentSelected:'',
            document:'',
            type:'',
            size:'',
            uri:''
        }
    }

    sendEmail = () => {
        const {email} = this.state;
        fetch('http://127.0.0.0:4000/send-email?recipient='+email.recipient+'&sender='+email.sender+'&topic='+email.subject+'&text='+email.text+'')
        .catch(error => console.log(error));
    }

    msg =() => {

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'fsantost.050793@gmail.com',
                pass: 'centrodeimagem'
            }
        })

        // const SandGridAPI = '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';
        // const FromEmail = 'fsantost.050793@gmail.com';
        // const ToEmail = 'fsantost.050793@gmail.com';
        // const Subject = 'Sending First Email';

        // // SendGrid.setApiKey(process.env.SENDGRID_API_KEY)
        const text = {
            name: 'Contact Name:' +this.state.name,
            phone: 'Contact Number: ' +this.state.phone,
            description: 'Description' + this.state.description,
            document: this.state.document
        };

        const mailOptions = {
            to: 'fsantost.050793@gmail.com',
            from: this.state,email,
            subject: 'Sending email is Fun',
            text: text,
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
          };

    
          
    }
    
    pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
            type: '*/*',
            
        });

        if(!result.cancelled){

            let dcmt = {
                type: result.type,
                size: result.size,
                uri: result.uri,
                document: result.name
            };

            this.setState({
                documentSelected: true,
                type: result.type,
                size: result.size,
                uri: result.uri,
                document: result.name
            });

            console.log(dcmt);

        }else{
            console.log('cancel');
            this.setState({
                documentSelected:false
            })
            
        }
    }

    render() {

    return(
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <ScrollView style={{flex:1, backgroundColor:'white', flexGrow:1}}>
                <View>
                    <Headers onPress={() => this.props.navigation.goBack()} back='back'>
                        <View style={{flex:1, alignSelf:'center'}}>
                            <Text style={styles.title}>Form</Text>
                        </View>
                    </Headers>
                </View>

                <ScrollView style={{flexGrow: 1}}>
                <Image source={require('../images/splashScreen.png')} style={styles.image}/>
                <Input
                    editable={true}
                    placeholder={'Please Enter Your Name...'}
                    maxLenght={50}
                    autoCorrect={true}
                    multiline={false}
                    numberOfLines={1}
                    onChangeText={text => this.setState({name:text})}
                    value={this.state.name}
                    style={styles.inputText}/>

                <Input
                    editable={true}
                    placeholder={'Please Enter Your Email...'}
                    keyboardType={'email-address'}
                    maxLenght={50}
                    autoCorrect={true}
                    multiline={false}
                    numberOfLines={1}
                    value={this.state.email}
                    onChangeText={(text) => this.setState({email:text})}
                    style={styles.inputText}/>

                <Input
                    editable={true}
                    placeholder={'Please Enter Your Mobile Number...'}
                    keyboardType={'phone-pad'}
                    maxLenght={50}
                    autoCorrect={true}
                    multiline={false}
                    numberOfLines={1}
                    value={this.state.phone}
                    onChangeText={(text) => this.setState({phone: text})}
                    style={styles.inputText}/>

                <Input
                    editable={true}
                    placeholder={'Please Write or paste here a description about you...'}
                    maxLenght={50}
                    autoCorrect={true}
                    multiline={true}
                    numberOfLines={5}
                    value={this.state.description}
                    onChangeText={(text) => this.setState({description: text})}
                    style={{...styles.inputText, height:70}}/>
                
                <Text style={styles.documentText}>Or</Text>
                
                <View style={styles.documentContainer}>
                <Button message={'Select a document'} onPress={() => this.pickDocument()}></Button>
                    <Text style={styles.documentText}>{this.state.document}</Text>
                </View>

                <Input
                    editable={true}
                    placeholder={'Please Enter Your name...'}
                    maxLenght={50}
                    autoCorrect={true}
                    multiline={false}
                    numberOfLines={1}
                    style={styles.inputText}/> 
                    
                    <Button message={'Apply'} style={styles.button} onPress={() => this.sendEmail()}></Button>                    
                </ScrollView>
            </ScrollView>
        </TouchableWithoutFeedback>

    );

    }


}

const styles = StyleSheet.create({
    documentContainer:{
        marginTop: 5,
        width: "90%",
        alignSelf:'center'
    },
    documentText:{
        textAlign:'center',
        marginTop: 10,

    },
    title: {
        textAlign:'center', 
        fontWeight:'bold', 
        fontSize:18, 
        paddingRight:'10%', 
        color:Colors.firstText
    },
    inputText:{
        width: '90%',
        height:40, 
        alignSelf:'center'
    },
    image:{
        alignSelf:'center', 
        height:200, 
        marginTop:20, 
        width:'90%'
    },
    button:{
        width:'90%',
        alignSelf:'center',
        textAlign:'center'
    }
});

export default Form;