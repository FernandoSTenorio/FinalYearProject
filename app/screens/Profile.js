import React from 'react';
import { TextInput, TouchableOpacity, Flatlist, StyleShee, Text, View, Image} from 'react-native';
import {f, auth, database, storage} from '../../config/config.js'
import PhotoList from '../components/PhotoList.js';
import UserAuth from '../components/Auth.js';
import Headers from '../components/Headers';
import Colors from '../components/constants/colors'

class Profile extends React.Component{

    constructor(props){
        super(props);
        this.state ={
            loggedin: false
        }
    }

    fetchUserInfo = (userId) => {
        var that = this;
        database.ref('users').child(userId).once('value').then(function(snapshot){

            const exists = (snapshot.val() !==null);
            if(exists) data = snapshot.val();
                that.setState({
                    username: data.username,
                    displayName: data.displayName,
                    photoURL: data.photoURL,
                    loggedin: true,
                    userId: userId

                    
                });
                

        });

    }
    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function(user){
            if(user){
                //Logged in 
                that.fetchUserInfo(user.uid)
              
            }else{
                //logged out
                that.setState({
                    loggedin: false
                });
            }
        });
    }

    saveProfile = () => {

        var displayName = this.state.displayName;
        var username = this.state.username;

        if(displayName !== ''){
            database.ref('users').child(this.state.userId).child('displayName').set(displayName);
        }
        if(username !== ''){
            database.ref('users').child(this.state.userId).child('username').set(username);
        }
        this.setState({editingProfile: false});
    }

    logoutUser = () => {
        f.auth().signOut();
        alert('Logout...')
    }

    editProfile = () => {
        this.setState({editingProfile: true})
    }


    render()
    {
        return(
            <View style={{flex: 1}}>
                { this.state.loggedin == true ? (
                    //logged in
                    <View style={{flex: 1}}>
                        <Headers title='Profile' style={{fontWeight: 'bold', color: Colors.firstText}}>
                            <View style={{flex:1, justifyContent:'center'}}>
                                <Text style={{textAlign:'center', fontWeight:'bold', color: Colors.firstText, fontSize:18}}>Profile</Text>
                            </View>
                        </Headers>
                        <View style={{alignItems: 'center', flexDirection: 'row', paddingVertical: 10}}>
                            <Image source={{ url: this.state.photoURL}} style={{marginLeft:10, width: 100, height: 100, borderRadius: 50}}></Image>
                            <View style={{marginRight: 10, paddingLeft: 10}}>
                                <Text>{this.state.displayName}</Text>
                                <Text>{this.state.username}</Text>
                            </View>
                        </View>
                        { this.state.editingProfile == true ? (
                            <View style={{alignItems:'center',justifyContent: 'center', paddingBottom: 20, borderBottomWidh: 1}}>
                                <TouchableOpacity onPress={ () => this.setState({editingProfile: false})}>
                                    <Text style={{fontWeight:'bold'}}>Cancel Editing</Text>
                                </TouchableOpacity>
                                
                                <Text>Name</Text>
                                <TextInput 
                                    editable={true}
                                    placeholder={'Enter your name'}
                                    onChangeText={(text) => this.setState({displayName: text})}
                                    value={this.state.displayName}
                                    style={{width: 250, marginVertical: 10, padding :5, borderColor: 'grey', borderWidth: 1}}
                                />

                                <Text>Username</Text>
                                <TextInput 
                                    editable={true}
                                    placeholder={'Enter your new username'}
                                    onChangeText={(text) => this.setState({username: text})}
                                    value={this.state.username}
                                    style={{width: 250, marginVertical: 10, padding :5, borderColor: 'grey', borderWidth: 1}}
                                />
                                <TouchableOpacity
                                    style={{backgroundColor: 'grey', padding: 10}} 
                                    onPress={ () => this.saveProfile()}>
                                    <Text style={{fontWeight:'bold'}}>Save Changes</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={{paddingBottom: 20, borderBottomWidh: 1}}>
                                <TouchableOpacity 
                                onPress={() => this.logoutUser()}
                                style={{marginTop: 10, marginHorizontal: 40, paddingVertical:15, borderRadius: 20, borderColor: 'grey', borderWidth: 1.5}}>
                                    <Text style={{textAlign: 'center', color: 'grey'}}>Logout</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                onPress={() => this.editProfile()}
                                style={{marginTop: 10, marginHorizontal: 40, paddingVertical:15, borderRadius: 20, borderColor: 'grey', borderWidth: 1.5}}>
                                    <Text style={{textAlign: 'center', color: 'grey'}}>Edit Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                onPress={() => this.props.navigation.navigate('Upload')}
                                style={{marginTop: 10, marginHorizontal: 40,paddingVertical:15, borderRadius: 20, borderColor: 'grey', borderWidth: 1.5}}>
                                    <Text style={{textAlign: 'center', color: 'grey'}}>Upload New</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        <PhotoList isUser={true} userId={this.state.userId} navigation={this.props.navigation}></PhotoList>
                    </View>
                ) : (
                    //logged out
                    <UserAuth message={'Please login to view your profile'}></UserAuth>
                )}
                
            </View>
        );
    }

}

export default Profile;