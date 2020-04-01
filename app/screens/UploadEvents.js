import React from 'react';
import {TextInput, ActivityIndicator, TouchableOpacity, StyleSheet, Text, View, Image, ScrollView, YellowBox, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {f, auth, database, storage} from '../../config/config.js'
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import UserAuth from '../components/Auth.js'
import Calendar from '../components/Calendar.js';
import GooglePlacesInput from '../components/GooglePlacesInput';
import { MaterialIcons } from '@expo/vector-icons';
import SelectBox  from 'react-native-multi-selectbox';
import { ThemeProvider } from 'styled-components';
import Input from '../components/Input';
import Headers from '../components/Headers';
import Colors from '../components/constants/colors';

YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']);
class UploadEvents extends React.Component{
    constructor(props){
        super(props);
        this._handleChange = this._handleChange.bind(this);
    }

    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function(user){
            if(user){
                //Logged in 
                that.setState({
                    loggedin: true
                });
            }else{
                //logged out
                that.setState({
                    loggedin: false
                });
            }
        });
    }

    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16).substring(1);
    }

    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() +'-' +
        this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4();
    }
    checkDate = () => {
        const today = new Date();
        const date = today;
        const outputDate = date.getDay() + " / " + (date.getMonth() + 1) + " / " + date.getFullYear();
        this.setState({
            outputDate: outputDate
        });

        return outputDate;
    }
    checkTime = () => {
        const today = new Date();

        const date = today;

        const outputTime = date.getHours() + ":" + date.getMinutes();

        this.setState({
            outputTime: outputTime
        });
        return outputTime;
    }

    state ={
        loggedin: false,
        eventId: this.uniqueId(),
        imageSelected: false,
        uploading: false,
        title: '',
        description:'',
        progress: 0,
        eventPhoto: '',
        vetting: [ 
            {item: 'Yes', id:'Yes'},
            {item: 'No', id: 'No'}
        ],
        selectedValues: [],
        outputTime: this.checkTime(),
        outputDate: this.checkDate(),
        type: '',
        location: ''
    
    }
    
    //Check the the user has permissions to access either camera and the camera roll
    _checkPermission = async () =>{
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({camera:status});
        const {statusRoll} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({cameraRoll:statusRoll});

    }

    //return a sequence of random letters and numbers, to allow us to get a completly random string

    finfNewImage = async () => {
        this._checkPermission();

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            quality: 1
        });

        console.log(result);

        if(!result.cancelled){

            console.log('upload image');
            this.setState({
                imageSelected: true,
                eventId: this.uniqueId(),
                eventPhoto: result.uri
            });

        }else{
            console.log('cancel');
            this.setState({
                imageSelected: false
            });
        }
    }

    //create the Objects that will be uploeaded to firebase
    processUpload = (eventPhoto) => {
        var that = this;
    
        //set needed objects
        var eventId = this.state.eventId
        var userId = f.auth().currentUser.uid;
        var photoURL = f.auth().currentUser.photoURL;
        var title = this.state.title;
        var description = this.state.description;
        var vetting = this.state.selectedValues;
        var outputTime = this.state.outputTime; 
        var outputDate = this.state.outputDate;
        var type = this.state.type;
        var location = this.state.location;
        var dateTime = Date.now();
        var timestamp = Math.floor(dateTime / 1000);
        
        //Build Photo Object
        //author, caption, posted, url
        var eventObj = {
            author: userId,
            title: title,
            eventId: eventId,
            description: description,
            vetting: vetting,
            outputTime: outputTime,
            outputDate: outputDate,
            type: type,
            location:location,
            posted: timestamp,
            eventPhoto: eventPhoto,
            photoURL: photoURL
        };

        //Update database
        //Add to feed
        database.ref('/events/'+eventId).set(eventObj);

        //Set user photo objects
        database.ref('/users/'+userId+'/events/'+eventId).set(eventObj);

        alert('Image Uploaded');
        this.setState({
            uploading: false,
            imageSelected: false,
            title: '',
            description:'',
            vetting:'',
            outputDate: '',
            outputTime: '', 
            type:'',
            location:'',
            eventPhoto: '',
        });
       

    }

    _handleChange(currentDate){

    let outputDate = currentDate.getDate() + " / " + (currentDate.getMonth()+1) + " / " + (currentDate.getFullYear());
    let outputTime = currentDate.getHours() + ":" + currentDate.getMinutes();
        this.setState({outputDate,
        outputTime})
        
    }

    uploadImage = async (eventPhoto) => {

        var that = this;
        var userId = f.auth().currentUser.uid;
        var eventId = this.state.eventId;

        //set Extension of the file, look for sequance of Characters that matches the last .
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(eventPhoto)[1];
        this.setState({
            currentFileType: ext,
            uploading: true
        });
        //create a fetch call to the image uri
        const response = await fetch(eventPhoto)
        //return the response into a blob
        const blob = await response.blob();
        var FilePath = eventId+'.'+that.state.currentFileType;

        const uploadTask = storage.ref('users/'+userId+'/events').child(FilePath).put(blob);

        uploadTask.on('state_changed', (snapshot) => {
            var progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
            console.log('Upload is ' +progress+'% comlete');
            that.setState({
                progress: progress
            });
        }, function(error){
            console.log('error with upload - ' +error);
        }, function(){
             that.setState({progress: 100});
             uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
                console.log(downloadURL);
                that.processUpload(downloadURL);
             });
        });
    }
    

    uploadPublish = () => {
        //check if the caption text is empty
        if(this.state.caption !== ''){
            this.uploadImage(this.state.eventPhoto);
            //check if the Upload buttom has already being pressed
            if(this.state.uploading === true){
            }else{
                console.log('Button tap is already uploading');
            }
        }else{
            alert('Please enter a caption...')
        }
        
    }

    render(){
        
        return(
            <TouchableWithoutFeedback onPress={()=>
                Keyboard.dismiss()}>
                <View style={{flex: 1}}>
                    { this.state.loggedin == true ? (
                        //logged in
                        <ScrollView style={{flex: 1}}>
                            <Headers onPress={() => this.props.navigation.goBack()} back='back'>
                                <View style={{flex:1, justifyContent:'center'}}>
                                    <Text style={{textAlign:'center', fontWeight:'bold', fontSize:18, paddingRight:'10%', color:Colors.firstText}}>Post Event</Text>
                                </View>
                            </Headers>
                            <View>
                                <TouchableOpacity onPress={() => this.finfNewImage()}
                                        style={{borderRadius: 5, borderRadius: 5, height: 150, justifyContent:'center', alignContent:'center'}}>
                                        {this.state.imageSelected === false ? (
                                            <View style={{alignContent:'center', paddingLeft:'40%'}}>
                                                <MaterialIcons 
                                                name='add-a-photo'
                                                size={80}
                                                />
                                            </View>
                                        ) : (
                                            <Image source={{url: this.state.eventPhoto}} style={{marginTop: 10, resizeMode: 'cover', width: '100%', height: 200}}></Image>
                                        )}
                                    </TouchableOpacity>
                                        <Text >Date {this.state.outputDate}</Text>
                                        <Text >Time {this.state.outputTime}</Text>
                                    <Input 
                                    editable={true}
                                    placeholder={'Event Title...'}
                                    maxLenght={50}
                                    autoCorrect={true}
                                    onChangeText={(text) => this.setState({title: text})}
                                    style={{height:40}}/>

                                    <Input
                                    editable={true}
                                    placeholder={'Event type...'}
                                    maxLength={50}
                                    autoCorrect={true}
                                    multiline={false}
                                    numberOfLines={1}
                                    onChangeText={(text) => this.setState({type: text})}
                                    style={{height:40}}/>

                                    <Input
                                    editable={true}
                                    placeholder={'Location...'}
                                    maxLength={100}
                                    autoCorrect={true}
                                    multiline={false}
                                    numberOfLines={1}
                                    onChangeText={(text) => this.setState({location: text})}
                                    style={{height: 40}}/>

                                    <Input
                                    editable={true}
                                    placeholder={'Event Description...'}
                                    maxLength={200}
                                    multiline={true}
                                    autoCorrect={true}
                                    numberOfLines={3}
                                    onChangeText={(text) => this.setState({description: text})}
                                    style={{height: 100}}/>
                                    
                                    {/* <GooglePlacesInput/> */}
                                    
                                    <Calendar 
                                        onChange={this._handleChange}
                                        />

                                    <View style={{flexDirection:'row', paddingLeft: '8%', paddingTop: 20}}>
                                        <Text style={{ fontSize: 20, paddingRight: 10}}>Is Vetting Required?</Text>
                                        <ThemeProvider theme={Colors1}>
                                            <SelectBox
                                                label={'Select'}
                                                options={this.state.vetting}
                                                value={this.state.selectedValues[0]}
                                                onChange={val => this.setState({ selectedValues: [val] })}
                                                hideInputFilter={false}
                                                viewMargin="0 0 20px 0"
                                                style={{paddingLeft: 15}}
                                                />
                                        </ThemeProvider> 
                                    </View>
                                    

                                    <TouchableOpacity onPress={ () => this.uploadPublish()}
                                    style={{alignSelf:'center', width: 170, marginHorizontal:'auto', backgroundColor:'purple', borderRadius: 5, paddingVertical: 10, paddingHorizontal: 20}}>
                                        <Text style={{textAlign:'center', color:'white'}}>Upload & Publish</Text>
                                    </TouchableOpacity>
                                    { this.state.uploading == true ? (
                                        <View style={{margintTop: 10}}>
                                            <Text>{this.state.progress}%</Text>
                                            { this.state.progress != 100 ?(
                                                <ActivityIndicator size='small' color='blue' />
                                                
                                            ) : (
                                            <Text>Processing</Text>
                                                
                                            )}
                                        </View>
                                    ) : (
                                        <View></View>
                                    )}
                                </View>
                            </ScrollView>
                    ) : (
                        //logged out
                        <UserAuth message={'Please login to post an event...'}></UserAuth>
                    )}
                </View>
            </TouchableWithoutFeedback>

        );
    }

}
const Colors1 = {
    primary: '#078489',
    secondary: '#124b5f',
    tertiary: '#f7f1e3'
  }

export default UploadEvents;