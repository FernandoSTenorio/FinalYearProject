import React from 'react';
import {f, auth, database, storage} from '../../config/config.js';
import * as Facebook from 'expo-facebook';
import {TouchableHighlight, View} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { async } from 'q';


var response = null;

const FacebookLogin = props => {


     //check if facebook account already exists 
     const isFacebookUserEqual = ( facebookAuthResponse, firebaseUser) => {
        if (firebaseUser) {
          var providerData = firebaseUser;
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
       
    

        //Sign up and Login with Facebook
    const loggingWithFacebook = async() => {
            try{
                
                //initialize the app by giving the given App id from facebook
                await Facebook.initializeAsync('2436101476507934');
                const { type, token } = await Facebook.logInWithReadPermissionsAsync({ 
                    permissions: ['email','public_profile'] 
                    });
            
                if(type === 'success'){
                var credentials = f.auth.FacebookAuthProvider.credential(token);
                f.auth()
                .signInWithCredential(credentials)
                .then(async (currentUser) => {
                    // console.log('Facebook User' , JSON.stringify(currentUser));
                    // JSON.stringify(currentUser);
                    console.log(currentUser.user);
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
                        email: currentUser.user.email,
                        userType: 'Volunteer'
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