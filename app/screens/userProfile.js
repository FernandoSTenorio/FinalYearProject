import React from 'react';
import { TouchableOpacity, Flatlist, StyleShee, Text, View, Image} from 'react-native';
import {f, auth, database, storage} from '../../config/config.js'
import PhotoList from '../components/PhotoList.js';
import Headers from '../components/Headers';
import Button from '../components/Button';
import {Entypo, MaterialIcons} from '@expo/vector-icons';

class userProfile extends React.Component{

    constructor(props){
        super(props);
        this.state ={
            loadded: false,
            isFriend: false,
            requestSent:false,
            requestId: this.uniqueId(),
            senderUser: f.auth().currentUser.uid,
            requestReceived: false
        }
    }

    checkParam = () => {

        var params = this.props.navigation.state.params;
        if(params){
            if(params.userId){
                this.setState({
                    userId: params.userId
                });
                this.fectchUserInfo(params.userId);
                this.checkUserRequest(params.userId);
            }
        }
       

    }
    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16).substring(1)
    }

    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() +'-' +
        this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4();
    }

    checkUserRequest = (userId) => {
        var senderId = this.state.senderUser;
        var ref = f.database().ref('frienRequest');
        ref.once('value').then(snap => {
            var checkUserRequest = snap.child(userId).child(senderId).exists();
            if(checkUserRequest){
                
                this.setState({
                    requestSent: true
                });
            }else if(userId == senderId) {
                this.setState({
                    isUser: true
                });
            }
        })
    }

    sendFriendRequest = (userId) => {

        var receiverId = userId;
        if(receiverId){

            var senderId = this.state.senderUser;
            var requestId = this.state.requestId;

            var requestObj = {
                request_type: 'received'
            };

            var ref = f.database().ref('frienRequest');

            ref.once('value').then(snapshot => {
                var checkUserRequest = snapshot.child(receiverId).child(senderId).exists();
                if(checkUserRequest){
                    console.log(checkUserRequest);
                    this.setState({
                        requestSent: true
                    })
                }else{
                    database.ref('/frienRequest/'+ '/' + receiverId + '/' + senderId + '/' + requestId).set(requestObj);

                    this.setState({
                        isFriend: false,
                        requestSent: true
                    })
                }
            })

            
        }       
    }

    accecptRequest = (senderId) => {
        var currentUser = f.auth().currentUser.uid;
        var ref = f.database().ref('frienRequest');
        ref.once('value').then(snap => {
            var checkFriendRequest = snap.child(senderId).child(currentUser).child(this.state.requestId).child('request_type').val();
            
            if(checkFriendRequest){
                this.setState({
                    requestReceived: true
                })
                console.log(checkFriendRequest);
            }
            
        })
    }

    cancelRequest = () => {
        var senderUser  = this.state.senderUser
        let ref = database.ref('frienRequest' + '/' + this.state.userId + '/' + senderUser);
        ref.remove();
        this.setState({requestSent: false});
    } 

    fectchUserInfo = (userId) => {
        var that = this;
        database.ref('users').child(userId).child('username').once('value').then(function(snapshot){
            const exists = (snapshot.val() !== null);
            if(exists) data = snapshot.val();
            that.setState({username:data});
        }).catch(error => console.log(error));

        database.ref('users').child(userId).child('displayName').once('value').then(function(snapshot){
            const exists = (snapshot.val() !== null);
            if(exists) data = snapshot.val();
            that.setState({displayName:data});
        }).catch(error => console.log(error));

        database.ref('users').child(userId).child('photoURL').once('value').then(function(snapshot){
            const exists = (snapshot.val() !== null);
            if(exists) data = snapshot.val();
            that.setState({photoURL:data,
            loadded:true});
        }).catch(error => console.log(error));
        that.setState({
            receiverId: userId
        })
        
   
    }

    componentDidMount = () => {
        this.checkParam();
        
    }

    render()
    {
        return(
            <View style={{flex: 1}}>
                {this.state.loadded == false ? (
                    <View>
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <View style={{flex: 1}}>
                        
                        <Headers title='Profile' onPress={() => this.props.navigation.goBack()} back='back'>
                                
                        </Headers>

                        <View style={{paddingLeft: 15, alignItems: 'center', flexDirection: 'row', paddingVertical: 10}}>
                            <Image source={{ url:this.state.photoURL}} style={{width: 100, height: 100, borderRadius: 50}}></Image>
                            <View style={{marginRight: 50, paddingLeft: 10}}>
                                <Text>{this.state.displayName}</Text>
                                <Text>{this.state.username}</Text>
                            </View>
                            {this.state.isUser == true ? (
                                <View></View>
                            ) : (
                                
                                <View>
                                {this.state.requestReceived === true ? (
                                    <View>
                                        <Button onPress={() => this.accecptRequest(this.state.senderUser)} message={'Accept'}></Button>
                                    </View>
                                ) : (
                                    <View>
                                    {this.state.requestSent == true ? (
                                        <View style={{marginRight:50}}>
                                            <Button onPress={() => this.cancelRequest()} style={{alignItems:'center', alignContent:'center'}}>
                                                <MaterialIcons 
                                                    name={'cancel'}
                                                    size={25}
                                                    color={'white'}/>
                                            </Button>
                                        </View>
                                        
                                    ) : (
                                        <View>
                                            <Button onPress={() => this.sendFriendRequest(this.state.receiverId)} >
                                                <Entypo
                                                    name={'add-user'}
                                                    size={20}
                                                    color={'white'}/>
                                            </Button>
                                        </View>
                                    )}
                                    </View>
                                )}
                                
                                </View>
                            )}
                            
                        </View>
                        <PhotoList isUser={true} userId={this.state.userId} navigation={this.props.navigation}></PhotoList>  
                    </View>
                 )}
            </View>

        );
                }
}

export default userProfile;