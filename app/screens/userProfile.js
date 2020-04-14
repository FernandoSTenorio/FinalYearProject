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
                this.checkIfUsersAreFriends();
                
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
        var  senderId= this.state.senderUser;
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
            }else{

            }
        })

        f.database().ref('frienRequest').child(userId).child(senderId).orderByChild('request_type').equalTo('received')
        .once('value').then(snapshot => {
            //console.log(snapshot.val());
            snapshot.forEach((data) =>{
                console.log(data.val());
                this.setState({
                    requestReceived:true
                });
            });

        })
    }

    sendFriendRequest = (userId) => {

        var receiverId = userId;
        if(receiverId){

            var senderId = this.state.senderUser;
            var requestId = this.state.requestId;

            var requestSent = {
                request_type: 'sent'
            };
            var requestReceived ={
                request_type: 'received'
            }

            var ref = f.database().ref('frienRequest');

            ref.once('value').then(snapshot => {
                var checkUserRequest = snapshot.child(receiverId).child(senderId).exists();
                if(checkUserRequest){
                    console.log(checkUserRequest);
                    this.setState({
                        requestSent: true
                    })
                }else{
                    database.ref('/frienRequest/'+ '/' + receiverId + '/' + senderId + '/' + requestId).set(requestSent);
                    database.ref('/frienRequest/'+ '/' + senderId  + '/' + receiverId+ '/' + requestId).set(requestReceived);
                    this.setState({
                        requestSent: true
                    })
                }
            })

            
        }       
    }

    accecptRequest = (currentUser) => {
        var senderId = this.state.senderUser;
        var  date = new Date();
        let outputTime = date.getDate() + " / " + (date.getMonth()+1) + " / " + (date.getFullYear());
        database.ref('/friends/'+ '/' + senderId + '/' + currentUser+ '/' + 'date').set(outputTime)
        .then(() => {
            database.ref('/friends/'+ '/' + currentUser + '/' + senderId + '/' +'date').set(outputTime)
            .then(() => {
                this.setState({
                    isFriend: true
                })
                this.cancelRequest();
            })
        });

        // f.database().ref('users').child(currentUser).child('friends').transaction((friends) => {
        //     return (friends || 0) +1;
        // })
        // f.database().ref('users').child(senderId).child('friends').transaction((friends) => {
        //     return (friends || 0) +1;
        // })

        
        
    }

    checkIfUsersAreFriends = () => {

        var friendRef = f.database().ref('friends');
        friendRef.once('value').then(snapshot => {
            var checkFriends = snapshot.child(this.state.senderUser).child(this.state.userId).exists();
            var checkFriends1 = snapshot.child(this.state.userId).child(this.state.senderUser).exists();

            if(checkFriends && checkFriends1){
                this.setState({
                    isFriend: true
                })
            }
        });
    }

    cancelRequest = () => {
        var senderUser  = this.state.senderUser
        let ref = database.ref('frienRequest' + '/' + this.state.userId + '/' + senderUser);
        let ref1 = database.ref('frienRequest' + '/' + senderUser + '/' + this.state.userId);
        ref.remove();
        ref1.remove();
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
                                {this.state.isFriend == true ? (
                                    <View><Text>Friends</Text></View>
                                ) : (

                                    <View>
                                {this.state.requestReceived === true ? (
                                    <View>
                                        <Button onPress={() => this.accecptRequest(this.state.userId)} message={'Accept'}></Button>
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