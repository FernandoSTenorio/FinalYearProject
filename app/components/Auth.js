import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View, Image, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {f, auth, database, storage} from '../../config/config.js';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import FacebookLogin from '../components/FacebookLogin.js';
import GoogleLogin from '../components/GoogleLogin.js';
import LoginInput from '../components/LoginInput';
import Colors from '../components/constants/colors';
import Button from '../components/Button';
import {_checkPermission} from '../helpers/Helpers';
import {CheckBox} from 'native-base';



class UserAuth extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            authStep: 0,
            email: '',
            pass: '',
            displayName:'',
            selected:0,
            username:'',
            moveScreen: false,
            currentUser: '',
            user: '',
            photoURL: '',
            isOrganisation: false,
            imageSelected: false,
            webSite:'',
            uploading: false
        }
        
    }

    /**
     * This function opens the mobile galery to select a picture
     */
    findNewImage = async () => {
        _checkPermission();

        //check if the image picker is opened up
        //variable that is assigned to the image picked 
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            quality: 1
        });

        console.log(result);
         //check if canceled is false, then continue picking the image
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

    /**
     * This function collects the Inputs and Photo selected creates
     * the user object, and add it to the Firebase Users
     */
    userObject = (userObj, displayName, username, photoURL, email) => {

        if(this.state.selected===1){//check if user is an Event Provider, it user is an Oraginasion, add user as an Event Provider
            var uObj = {
                email: email,
                username:username,
                displayName: displayName,
                photoURL: photoURL,
                userType: 'EventProvider',
                webSite: this.state.webSite
            };
            database.ref('users').child(userObj.uid).set(uObj);//add user Object to Firebase.
        }else{//if not, add user as a volunteer
            var uObj = {
                email: email,
                username:username,
                displayName: displayName,
                photoURL: photoURL,
                userType: 'Volunteer'
            };
            database.ref('users').child(userObj.uid).set(uObj);
        }

    }

    /**
     * This function creates a path to Firebase Storage, to add user profile image
     */
    createUserObj = async (userObj, email, displayName, username, photoURL) => {
        var that = this;
        //set Extension of the file, look for sequance of Characters that matches the last.
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

        //fetch information from storage
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


    /**
     * This is the Sign up function, used to create new users
     */
    signUp = async() => {

        var email = this.state.email;
        var pass = this.state.pass;
        var displayName = this.state.displayName;
        var username = this.state.username;
        var photoURL = this.state.photoURL;
        var webSite = this.state.webSite;

        if(email == ''){//check if email is empty
            alert('Email is empy!!');
        }else if(pass == ''){//check if password is empty
            alert('Password empty!!');
        }else if(displayName == ''){//check if Name is empty
            alert('No Name Identified');
        }else if(username == ''){//check if username is empty
            alert('Username is empty!!');
        }else if(photoURL == ''){//check if photoURL is empty
            alert('Please Select a Photo');
        }else{
            try{
           
                //creates User with the email and password
                let user = await auth.createUserWithEmailAndPassword(email, pass)
                .then((userObj) => {//call the user object that is created in the function called
                    
                    //check if it is current user
                    var currentUser = f.auth().currentUser;
                    currentUser.updateProfile({//update firebase current user information
                        displayName: displayName,
                        photoURL: photoURL
                    }).then(() => { 
                        //parse all the user information into de database   
                        this.createUserObj(userObj.user, email, userObj.user.displayName, username, userObj.user.photoURL);
                        this.reloadPage();//reload the page after the sign up button is pressed
                        this.setState({authStep: 1});//back to login page after sign up is completed 
                        this.navigation.navigate("Profile");
                    }).catch((error) => (error));
                       
                }).catch((error) => alert(error));
              }catch(error){
                console.log(error);
                alert(error);
            }  
        }  
    }

    /**
     * Login int user
     */
    login = async() => {
        var email = this.state.email;
        var pass = this.state.pass;
        if(email != '' && pass !=''){//check if both password and email are empty
            try{
                //Sign in user with email and password credentials
                let user = await auth.signInWithEmailAndPassword(email, pass);
                this.navigation.navigate("Profile");
              }catch(error){
                console.log(error);
                alert(error);
              }
            }else{
                alert('email or password is empty');
            }     
    }

    /**
     * Reload all variable after sign up is completed
     */
    reloadPage = () => {
        this.setState({
            email: '',
            pass: '',
            displayName:'',
            username:'',
            currentUser: '',
            user: '',
            photoURL: '',
            imageSelected: false,
            moveScreen: true,
            webSite:''
        });
       
    }
        
  
    componentDidMount = () => {

        if(this.props.moveScreen == true){
            this.setState({moveScreen: true});
        }
        
    }

    /**
     * This function is responsible for sending the user to the profile log in 
     * in case of setting an account from comments page
     */
    showLogin = () => {
        if(this.state.moveScreen == true){
            this.props.navigation.navigate('Profile');
            return false;
        }
        this.setState({authStep: 1});
    }

    /**
     * This function is responsible for sending the user to the profile sign up in in case of setting an 
     * account from comments page
     */
    showSignUP = () => {
        if(this.state.moveScreen == true){
            this.props.navigation.navigate('Profile');
            return false;
        }
        this.setState({authStep: 2});
    }
    
    render()
    {
        return(
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Image source={require('../images/splashScreen.png')}/>
                    <Text>{this.props.message}</Text>
                    {/* If condition is equal to 0 display Welcome Page */}
                    { this.state.authStep == 0 ? (
                        <View style={{marginVertical: 20, width:'70%'}}>
                            <Button onPress={() => this.showLogin()} message={'Login'}/>
                            <Button onPress={() => this.showSignUP()} message={'Join now'} />
                        </View>
                    ) : (
                        <KeyboardAvoidingView behavior="padding" enabled style={{flex:1,width: '90%'}}>
                        <View style={{flex:1,width: '90%'}}>
                            {/* If condition is equal to on, display login screen */}
                            {this.state.authStep == 1 ? (
                                //Loging
                                <TouchableWithoutFeedback onPress={() =>Keyboard.dismiss()}>
                                    
                                        <ScrollView overScrollMode='auto'>
                                            
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
                                            value={this.state.email}/>

                                            <Text>Password:</Text>
                                            <LoginInput
                                            editable={true}
                                            secureTextEntry={true}
                                            placeholder={'Password'}
                                            onChangeText={(text) => this.setState({pass: text})}
                                            value={this.state.pass}/>
                                            
                                            <Button
                                                onPress={() => this.login()}
                                                style={styles.accessButton} message={'Login'}>
                                            
                                            </Button>

                                            <Text style={styles.orText}>or</Text>

                                            <View style={{flexDirection:'row',marginLeft:'30%'}}>
                                                <FacebookLogin/>
                                                <GoogleLogin/>
                                            </View>
                                        </ScrollView>
                                </TouchableWithoutFeedback>
                            ) : (
                                //Sign up if condition is equal to 2
                                <ScrollView overScrollMode='auto'>
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
                                            <Text>Are you an Organisation/Entity?</Text>
                                            <View style={{flexDirection: 'row'}}>
                                                <Text style={{color:this.state.selectedLang===1?"#fc5185":"gray",fontWeight:this.state.selectedLang===1? "bold" :"normal"}}>Yes</Text>
                                                <CheckBox style={{marginRight: '5%'}} checked={this.state.selected===1} onPress={() => this.setState({selected:1})}/>
                                                
                                            </View>
                                            <View style={{flexDirection: 'row', paddingTop: 3}}>
                                                <Text style={{marginRight:'1.5%', color:this.state.selectedLang===2?"#fc5185":"gray",fontWeight:this.state.selectedLang===2? "bold" :"normal"}}>No</Text>
                                                <CheckBox checked={this.state.selected===2} onPress={() => this.setState({selected:2})}/>
                                            </View>
                                            <View>

                                                {this.state.selected == 1 ? (
                                                    <View>
                                                        <Text>If you are an Event Provider Pleaser type or paste your Web site or A Blog URL for evaluation</Text>
                                                        <LoginInput
                                                        editable={true}
                                                        placeholder={'Web Site'}
                                                        onChangeText={(text) => this.setState({webSite: text})}
                                                        value={this.state.webSite}/>
                                                    </View>
                                                ) : (
                                                    <View></View>
                                                )}
                                                
                                            </View>
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
                                            <Button 
                                                onPress={() => this.signUp()}
                                                style={styles.accessButton} message={'Sign UP'}>
                                                
                                            </Button>

                                            <Text style={styles.orText}>or</Text>
                                            
                                            <View style={styles.apiButton}>
                                                    <FacebookLogin/>
                                                    <GoogleLogin/>
                                            </View>
                                            
                                </ScrollView>
                                    
                            )}
                        
                        </View>
                        </KeyboardAvoidingView>
                    )}
                </ScrollView>
           
        );
    }
}

const styles = StyleSheet.create({
    accessButton:{
        width:'100%',
        textAlign:'center'
    },
    orText:{
        marginVertical: 10, 
        textAlign: 'center', 
        fontWeight: 'bold'
    },
    contentContainer:{
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor:Colors.firstText
    },
    cancel:{
        borderBottomWidth: 1, 
        paddingVertical: 5, 
        marginBottom: 10,
        width:'100%'
    },
    text:{
        color: Colors.firstText
    },
    apiButton:{
        flexDirection:'row', 
        justifyContent:'center'
    }
});

export default UserAuth;