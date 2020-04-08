import React, {useState} from 'react';
import { TextInput, TouchableOpacity, Flatlist, StyleShee, Text, View, Image} from 'react-native';
import {f, auth, database, storage} from '../../config/config.js'
import PhotoList from '../components/PhotoList.js';
import UserAuth from '../components/Auth.js';
import Headers from '../components/Headers';
import Colors from '../components/constants/colors'

const Profile = props => {

    // constructor(props){
    //     super(props);
    //     this.state ={
    //         loggedin: false
    //     }
    // }

    
    
    const [loggedin, isLoggedin] = useState(componentDidMount)
    const [username, getUsername] = useState("");
    const [displayName, getName] = useState("");
    const [photoURL, getURL] = useState("");
    const [userId, getUserId] = useState("");
    const [edProfile, editingProfile] = useState(false);

    const fetchUserInfo = (userId) => {
        
        database.ref('users').child(userId).once('value').then(function(snapshot){

            const exists = (snapshot.val() !==null);
            if(exists) data = snapshot.val();
                    getUsername(data.username);
                    getName(data.displayName);
                    getURL(data.photoURL)
                    isLoggedin(true)
                    getUserId(userId)
        });

    }


    const componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function(user){
            if(user){
                //Logged in 
                fetchUserInfo(user.uid)
            }else{
                //logged out
                isLoggedin(false);
            }
        });

    }

    const checkLog = componentDidMount();
    

    const saveProfile = () => {

        var displayName = displayName;
        var username = username;

        if(displayName !== ''){
            database.ref('users').child(userId).child('displayName').set(displayName);
        }
        if(username !== ''){
            database.ref('users').child(userId).child('username').set(username);
        }
        editingProfile(false);
    }

    const logoutUser = () => {
        f.auth().signOut();
        alert('Logout...')
    }

    const editProfile = () => {
        editingProfile(true);
    }

        return(
            <View style={{flex: 1}}>
                { checkLog == true ? (
                    //logged in
                    <View style={{flex: 1}}>
                        <Headers title='Profile' style={{fontWeight: 'bold', color: Colors.firstText}}>
                            <View style={{flex:1, justifyContent:'center'}}>
                                <Text style={{textAlign:'center', fontWeight:'bold', color: Colors.firstText, fontSize:18}}>Profile</Text>
                            </View>
                        </Headers>
                        <View style={{alignItems: 'center', flexDirection: 'row', paddingVertical: 10}}>
                            <Image source={{ url: photoURL}} style={{marginLeft:10, width: 100, height: 100, borderRadius: 50}}></Image>
                            <View style={{marginRight: 10, paddingLeft: 10}}>
                                <Text>{displayName}</Text>
                                <Text>{username}</Text>
                            </View>
                        </View>
                        { edProfile == true ? (
                            <View style={{alignItems:'center',justifyContent: 'center', paddingBottom: 20, borderBottomWidh: 1}}>
                                <TouchableOpacity onPress={ () => editingProfile(false)}>
                                    <Text style={{fontWeight:'bold'}}>Cancel Editing</Text>
                                </TouchableOpacity>
                                
                                <Text>Name</Text>
                                <TextInput 
                                    editable={true}
                                    placeholder={'Enter your name'}
                                    onChangeText={text => getName(text)}
                                    value={displayName}
                                    style={{width: 250, marginVertical: 10, padding :5, borderColor: 'grey', borderWidth: 1}}
                                />

                                <Text>Username</Text>
                                <TextInput 
                                    editable={true}
                                    placeholder={'Enter your new username'}
                                    onChangeText={text => getUsername(text)}
                                    value={username}
                                    style={{width: 250, marginVertical: 10, padding :5, borderColor: 'grey', borderWidth: 1}}
                                />
                                <TouchableOpacity
                                    style={{backgroundColor: 'grey', padding: 10}} 
                                    onPress={ () => saveProfile()}>
                                    <Text style={{fontWeight:'bold'}}>Save Changes</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={{paddingBottom: 20, borderBottomWidh: 1}}>
                                <TouchableOpacity 
                                onPress={() => logoutUser()}
                                style={{marginTop: 10, marginHorizontal: 40, paddingVertical:15, borderRadius: 20, borderColor: 'grey', borderWidth: 1.5}}>
                                    <Text style={{textAlign: 'center', color: 'grey'}}>Logout</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                onPress={() => editProfile()}
                                style={{marginTop: 10, marginHorizontal: 40, paddingVertical:15, borderRadius: 20, borderColor: 'grey', borderWidth: 1.5}}>
                                    <Text style={{textAlign: 'center', color: 'grey'}}>Edit Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                onPress={() => props.navigation.navigate('Upload')}
                                style={{marginTop: 10, marginHorizontal: 40,paddingVertical:15, borderRadius: 20, borderColor: 'grey', borderWidth: 1.5}}>
                                    <Text style={{textAlign: 'center', color: 'grey'}}>Upload New</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        <PhotoList isUser={true} userId={userId} navigation={props.navigation}></PhotoList>
                    </View>
                ) : (
                    //logged out
                    <UserAuth message={'Please login to view your profile'}></UserAuth>
                )}
                
            </View>
        );
}

export default Profile;