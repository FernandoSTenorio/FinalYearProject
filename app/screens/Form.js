import React from 'react';
import {StyleSheet, Text, View, Image, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView} from 'react-native';
import Headers from '../components/Headers';
import Button from '../components/Button';
import {database} from '../../config/config.js'
import Input from '../components/Input';
import Colors from '../components/constants/colors';
// import FilePickerManager from '..react-native-file-picker'
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { async } from 'q';


class Form extends React.Component{

    constructor(props){
        super(props)
        this.state={
            name:'',
            email:'',
            phone:'',
            eventId:'',
            text: [],
            recipient:'',
            subject:'',
            text:'',
            sender:'fsantost.050793@gmail.com',
            description:'',
            documentSelected:'',
            document:'',
            type:'',
            size:'',
            uri:''
        }
    }
    componentDidMount(){
        var that = this;
        that.checkParam()
    }

    /**
     * Check for event parameters, in order to get the right id
     */
    checkParam = () => {
        //checkes for the navigation props screen
        var params = this.props.navigation.state.params;
        if(params){//checks if parameters exists
            if(params.eventId){//checks if eventId exists
                this.setState({
                    eventId: params.eventId
                });
                this.getEmail(params.eventId);
            }
        }

    }
    
    /**
     * This function fetchs the events information to get the poster's email and the event title
     * @param {Getn event ID} eventId 
     */
    getEmail(eventId){
        var that = this;
        //fetch event data from database
        database.ref('events').child(eventId).child('recipient').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null);
            if(exists) data = snapshot.val();//check if data exists
            that.setState({recipient:data});
        }).catch(error => console.log(error));
        database.ref('events').child(eventId).child('subject').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null);
            if(exists) data = snapshot.val();
            that.setState({subject:data});
        }).catch(error => console.log(error));
        
        // console.log(this.state.userEmail);
    }

    /**
     * This function creates the email that will be sending collected information from the form
     * and sends it to the event provider
     */
    sendEmail = async () => {
        try{

            //initiates HTTP Request
            var http = new XMLHttpRequest();
            //Open the local server, that is running the SendGrid API
            http.open('GET', 'http://192.168.0.88:4000/send-email?recipient='+this.state.recipient+'&sender='+this.state.sender+'&topic=Event: '+this.state.subject+
            '&text= Contact Email: '+this.state.email+ ' Contact Name: ' + this.state.name+
            ' Contact Number: ' + this.state.phone+ ' Description: ' + this.state.description+ ' Document: ' + this.state.document+ ' Document Name: '+ this.state.documentName+'');
            http.send();
            http.onreadystatechange = (e) => {
                var response = http.responseText;
                console.log('Success', response);
                
            };
            console.log(this.state.recipient)
            

        }catch (error) {
            console.error(error);
        }
        
    }

    /**
     * This function selects a document from users directory, with information about (s)he
     */
    pickDocument = async () => {

        //check if the document picker is opened up
        //variable that is assigned to the document picked 
        let result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
            type: '*/*',
            
        });

        //check if canceled is false, then continue picking the image
        if(!result.cancelled){

            let dcmt = {
                type: result.type,
                size: result.size,
                uri: result.uri,
                document: result.name
            };
            try{
                //Download the file selected, to anble other users to read it
                const downloadFile = FileSystem.downloadAsync(
                    result.uri, FileSystem.documentDirectory + result.name
                ).then(({ uri }) => {
                    console.log('File Downloaded to ', uri);//check the path where the file was downloaded
                    FileSystem.readAsStringAsync(uri).then(async fileResponse=> {
                        console.log('The document read is ',fileResponse);
                        this.setState({
                            documentSelected: true,
                            type: result.type,
                            size: result.size,
                            uri: downloadFile,
                            documentName: result.name,
                            document: fileResponse,
            
                        });
                    })
                    
                }).catch(error => {
                    console.log(error);
                })
                console.log(dcmt);

            }catch(error){
                console.log(error)
            } 

            

            

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
            
            <KeyboardAvoidingView behavior="padding" enabled  style={styles.keyboarContainer}>
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
                    onChangeText={(text) => this.setState({email:text})}
                    value={this.state.email}
                    style={styles.inputText}/>

                <Input
                    editable={true}
                    placeholder={'Please Enter Your Mobile Number...'}
                    keyboardType={'phone-pad'}
                    maxLenght={50}
                    autoCorrect={true}
                    multiline={false}
                    numberOfLines={1}
                    onChangeText={(text) => this.setState({phone: text})}
                    value={this.state.phone}
                    style={styles.inputText}/>

                <Input
                    editable={true}
                    placeholder={'Please Write or paste here a description about you...'}
                    maxLenght={50}
                    autoCorrect={true}
                    multiline={true}
                    numberOfLines={5}
                    onChangeText={(text) => this.setState({description: text})}
                    value={this.state.description}
                    style={{...styles.inputText, height:70}}/>
                
                <Text style={styles.documentText}>Or</Text>
                
                <View style={styles.documentContainer}>
                <Button message={'Select a document'} onPress={() => this.pickDocument()}></Button>
                    <Text style={styles.documentText}>{this.state.documentName}</Text>
                </View>

                {/* <Input
                    editable={true}
                    placeholder={'Please Enter Your name...'}
                    maxLenght={50}
                    autoCorrect={true}
                    multiline={false}
                    numberOfLines={1}
                    style={styles.inputText}/>  */}
                    
                    <Button message={'Apply'} style={styles.button} onPress={() => this.sendEmail()}></Button>                    
                </ScrollView>
            </KeyboardAvoidingView>
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
    keyboarContainer:{
        flex:1, 
        backgroundColor:'white', 
        flexGrow:1
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