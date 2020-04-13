import React from 'react';
import {f, auth, database, storage} from '../../config/config.js';
import * as Facebook from 'expo-facebook';
import {TouchableOpacity, TextInput, TouchableHighlight, KeyboardAvoidingView, StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';

const FacebookLogin = props => {


       

        //Sign up and Login with Facebook
    const loggingWithFacebook = async() => {
            try{
                //initialize the app by giving the given App id from facebook
                await Facebook.initializeAsync('2436101476507934');
                const { type, token } = await Facebook.logInWithReadPermissionsAsync({ 
                    permissions: ['email','public_profile'] 
                    });
            
                if(type === 'success'){
                const credentials = f.auth.FacebookAuthProvider.credential(token);
                f.auth().signInWithCredential(credentials)
                .then(currentUser => {
                    console.log('Facebook User' , JSON.stringify(currentUser));
                    JSON.stringify(currentUser);
    
                    // Check if user is already signed-in.
                    if(!isFacebookUserEqual(credentials, currentUser)){
                        // Build Firebase credential with the Facebook auth token.
                        f.auth.FacebookAuthProvider.credential(
                            event.authResponse.accessToken);
                    }
                    //get json response and create user
                    var uObj = {
                        displayName: currentUser.additionalUserInfo.profile.first_name,
                        username: currentUser.user.displayName,
                        photoURL: currentUser.user.photoURL,
                        email: currentUser.user.email
                    };
                    console.log(uObj);
    
                    //parse the user object to firebase after collecting the data from successfully Facebook sign up
                    database.ref('users').child(currentUser.user.uid).set(uObj);
            
                }).catch((error) => {console.log('Error Logging In...', error);})
                }
                }catch ({ message }) {
                    alert(`Facebook Login Error: ${message}`);
                }
            
          }
    //check if facebook account already exists 
    const isFacebookUserEqual = ( facebookAuthResponse, firebaseUser) => {
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === f.auth.FacebookAuthProvider.PROVIDER_ID &&
                providerData[i].uid === facebookAuthResponse.userID) {
              // We don't need to re-auth the Firebase connection.
              return true;
            }
          }
        }
        return false;
      }

    return (

        <View>
            <TouchableHighlight onPress={() => loggingWithFacebook()}>
            <AntDesign
                name='facebook-square'
                size={60}/>
            </TouchableHighlight>
        </View>
    );

};

export default FacebookLogin;