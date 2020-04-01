import React from 'react';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import {TouchableOpacity, TextInput, TouchableHighlight, KeyboardAvoidingView, StyleSheet, Text, View, Image, ScrollView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {f, auth, database, storage} from '../../config/config.js';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import FacebookLogin from '../components/FacebookLogin.js';
import GoogleLogin from '../components/GoogleLogin.js';
import LoginInput from '../components/LoginInput';
import Colors from '../components/constants/colors';
import Button from '../components/Button';
class UserAuth extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            authStep: 0,
            email: '',
            pass: '',
            displayName:'',
            username:'',
            moveScreen: false,
            currentUser: '',
            user: '',
            photoURL: '',
            imageSelected: false,
            uploading: false
        }
        
    }

    //Check the the user has permissions to access either camera and the camera roll
    _checkPermission = async () =>{
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({camera:status});
        const {statusRoll} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({cameraRoll:statusRoll});
    }

    //
    findNewImage = async () => {
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
                photoURL: result.uri
            });

        }else{
            console.log('cancel');
            this.setState({
                imageSelected: false
            });
        }
    }


    userObject = (userObj, displayName, username, photoURL, email) => {

        var uObj = {
            email: email,
            emailVerified: false,
            username:username,
            displayName: displayName,
            photoURL: photoURL
        };

        database.ref('users').child(userObj.uid).set(uObj);

    }

    createUserObj = async (userObj, email, displayName, username, photoURL) => {
        var that = this;
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(photoURL)[1];
        this.setState({
            currentFileType: ext,
            uploading: true
        });
        //create a fetch call to the image uri
        const response = await fetch(photoURL)
        //return the response into a blob
        const blob = await response.blob();
        var FilePath = that.state.currentFileType;

        const uploadTask = storage.ref('users/'+userObj.uid+'/profilePicture').child(FilePath).put(blob);

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
             });
        });

        this.userObject(userObj, displayName, username, photoURL, email);
       

    }
    
    signUp = async() => {
        var email = this.state.email;
        var pass = this.state.pass;
        var displayName = this.state.displayName;
        var username = this.state.username;
        var photoURL = this.state.photoURL;

        if(email != '' && pass !=''){
            try{
                let user = await auth.createUserWithEmailAndPassword(email, pass)
                .then((userObj) => this.createUserObj(userObj.user, email, displayName, username, photoURL))
                .catch((error) => alert(error));
              }catch(error){
                console.log(error);
                alert(error);
              }
            }else{
                alert('email or password is empty');
            }
    }

    login = async() => {

        var email = this.state.email;
        var pass = this.state.pass;
        if(email != '' && pass !=''){
            try{
                let user = await auth.signInWithEmailAndPassword(email, pass);
              }catch(error){
                console.log(error);
                alert(error);
              }
            }else{
                alert('email or password is empty');
            }
        }
        
  
    componentDidMount = () => {

        if(this.props.moveScreen == true){
            this.setState({moveScreen: true});
        }
        
    }

    //This function is responsible for sending the user to the profile log in in case of setting an account from comments page
    showLogin = () => {
        if(this.state.moveScreen == true){
            this.props.navigation.navigate('Profile');
            return false;
        }
        this.setState({authStep: 1})
    }

     //This function is responsible for sending the user to the profile sign up in in case of setting an account from comments page
    showSignUP = () => {
        if(this.state.moveScreen == true){
            this.props.navigation.navigate('Profile');
            return false;
        }
        this.setState({authStep: 2})
    }
    
    render()
    {
        return(
            
            
                <ScrollView contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.firstText}}>
                <Image source={require('../images/splashScreen.png')}/>
                <Text>{this.props.message}</Text>
                { this.state.authStep == 0 ? (
                    <View style={{marginVertical: 20, width:'70%'}}>
                        <Button onPress={() => this.showLogin()} message={'Login'}/>
                        <Button onPress={() => this.showSignUP()} message={'Join now'} />
                    </View>
                ) : (
                    <View>
                        {this.state.authStep == 1 ? (
                            //Loging
                            <TouchableWithoutFeedback onPress={() =>Keyboard.dismiss()}>
                            <View>
                                {/* <Image source={require('../images/appLogo.png')}/> */}
                                <TouchableOpacity
                                    onPress={() => this.setState({authStep: 0})} 
                                    style={styles.cancel}>
                                    <Text style={{fontWeight:'bold'}}>Cancel</Text>
                                </TouchableOpacity>
                                <Text>Email:</Text>
                                <LoginInput
                                editable={true}
                                keyboardType={'email-address'}
                                placeholder={'Email'}
                                onChangeText={(text) => this.setState({email: text})}
                                value={this.state.email}
                                
                                    />

                                <Text>Password:</Text>
                                <LoginInput
                                editable={true}
                                secureTextEntry={true}
                                placeholder={'Password'}
                                onChangeText={(text) => this.setState({pass: text})}
                                value={this.state.pass}/>
                                <TouchableOpacity 
                                onPress={() => this.login()}
                                style={styles.accessButton}>
                                    <Text>Login</Text>
                                </TouchableOpacity>

                                <Text style={{marginVertical: 10, textAlign: 'center', fontWeight: 'bold'}}>or</Text>

                                <View style={{flexDirection:'row',marginLeft:'30%'}}>
                                    <FacebookLogin/>
                                    <GoogleLogin/>
                                </View>
                            </View>
                            </TouchableWithoutFeedback>
                        ) : (
                            //Sign up
                            <TouchableWithoutFeedback onPress={() =>Keyboard.dismiss()}>
                                <ScrollView
                                overScrollMode='auto'>
                                    <TouchableOpacity
                                        onPress={() => this.setState({authStep: 0})} 
                                        style={styles.cancel}>
                                        <Text style={{fontWeight:'bold'}}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.findNewImage()}>
                                        {this.state.imageSelected ===false ? (
                                            <AntDesign
                                            name='adduser'
                                            size={80}/>
                                        ) : (
                                            <Image source={{url:this.state.photoURL}} style={{marginLeft:10, width: 80, height: 80, borderRadius: 40}}></Image>
                                        )}   
                                    </TouchableOpacity>
                                    <Text>Name:</Text>
                                    <LoginInput
                                        editable={true}
                                        placeholder={'Name'}
                                        onChangeText={(text) => this.setState({displayName: text})}
                                        value={this.state.displayName}/>

                                    <Text>Username:</Text>
                                    <LoginInput
                                        editable={true}
                                        keyboardType={'email-address'}
                                        placeholder={'Username'}
                                        onChangeText={(text) => this.setState({username: text})}
                                        value={this.state.username}/>

                                    <Text>Email:</Text>
                                    <LoginInput
                                        editable={true}
                                        keyboardType={'email-address'}
                                        placeholder={'Email'}
                                        onChangeText={(text) => this.setState({email: text})}
                                        value={this.state.email}/>

                                    <Text>Password:</Text>
                                    <LoginInput
                                        editable={true}
                                        secureTextEntry={true}
                                        placeholder={'Password'}
                                        onChangeText={(text) => this.setState({pass: text})}
                                        value={this.state.pass}/>
                                    <TouchableOpacity 
                                        onPress={() => this.signUp()}
                                        style={styles.accessButton}>
                                        <Text>Sign Up</Text>
                                    </TouchableOpacity>

                                    <Text style={{marginVertical: 10, textAlign: 'center', fontWeight: 'bold'}}>or</Text>
                                    
                                    <View style={{flexDirection:'row', marginLeft:'25%'}}>
                                    <FacebookLogin/>
                                    <GoogleLogin/>
                                    </View>
                                </ScrollView>
                        </TouchableWithoutFeedback>
                        )}

                    </View>
                )}
                </ScrollView>
           
        );
    }
}

const styles = StyleSheet.create({
    accessButton:{
        width:250,  
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        borderColor: 'grey', 
        borderRadius: 10
    },
    cancel:{
        borderBottomWidth: 1, 
        paddingVertical: 5, 
        marginBottom: 10,
        width:250
    },
    text:{
        color: Colors.firstText
    }
});

export default UserAuth;