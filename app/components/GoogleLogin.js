import React from 'react';
import {f, database} from '../../config/config.js';
import * as Google from 'expo-google-app-auth';
import {TouchableHighlight, View} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const GoogleLogin = () => {


      //check if google account already exists
    isGoogleUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
          var providerData = firebaseUser;
          console.log(googleUser);
          for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === f.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
                  console.log(googleUser)
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
    }

    signInWithGoogle = async ()  => {
        try {
            const result = await Google.logInAsync({

            androidClientId: '757044393965-2mqjhdgan6mpiqjokmnbjdk64ejgdjp4.apps.googleusercontent.com',
            iosClientId: '757044393965-nn3c3helssngojencdh2q5g9d73g8o43.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
            });

        if (result.type === 'success') {
            const { idToken, accessToken } = result;
            const credential = f.auth.GoogleAuthProvider.credential(idToken, accessToken);
            f.auth()
              .signInWithCredential(credential)
              .then(res => {
                // console.log(res.user.providerData.Ol.uid);
                if(!this.isGoogleUserEqual(credential, res)){
                    f.auth.GoogleAuthProvider.credential(
                      
                      googleUser.getAuthResponse().id_token);
                }
                //get json response and create user
                var uObj = {
                    displayName: res.additionalUserInfo.profile.given_name,
                    username: res.additionalUserInfo.profile.name,
                    photoURL: res.additionalUserInfo.profile.picture,
                    email: res.additionalUserInfo.profile.email,
                    userType: 'Volunteer'
                };
                console.log(uObj);
                database.ref('users').child(res.user.uid).set(uObj);
                
              })
              .catch(error => {
                console.log("firebase cred err:", error);
              });
            return result.accessToken;
        }else {
            return { cancelled: true };
        }
        }catch (e) {
        return { error: true };
        }
    }

    return (

        <View>
            <TouchableHighlight onPress={() => this.signInWithGoogle()}>
                <AntDesign
                    name='google'
                    size={60}/>
            </TouchableHighlight>
        </View>

    );
};

export default GoogleLogin;