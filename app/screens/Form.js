import React from 'react';
import {StyleSheet, Text, View, Image, ScrollView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import Headers from '../components/Headers';
import Button from '../components/Button';
import Input from '../components/Input';
import Colors from '../components/constants/colors';
// import FilePickerManager from '..react-native-file-picker'
import * as DocumentPicker from 'expo-document-picker';


class Form extends React.Component{

    constructor(props){
        super(props)
        this.state={
            name:'',
            email:'',
            phone:'',
            text: [],
            recipient:'fsantost.050793@gmail.com',
            subject:'Testing SendGrid',
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

    sendEmail = async () => {

        try{

            var http = new XMLHttpRequest();
            http.open('GET', 'http://192.168.0.88:4000/send-email?recipient='+this.state.recipient+'&sender='+this.state.sender+'&topic='+this.state.subject+
            '&text= Contact Email: '+this.state.email+ ' Contact Name: ' + this.state.name+
            ' Contact Number: ' + this.state.phone+ ' Description: ' + this.state.description+ ' Document: ' + this.state.document+'');
            http.send();
            http.onreadystatechange = (e) => {
                var response = http.responseText;
                console.log('Success', response);
            };

        }catch (error) {
            console.error(error);
        }
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
                    <Text style={styles.documentText}>{this.state.document}</Text>
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