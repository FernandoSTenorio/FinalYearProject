import React from 'react';
import { TouchableOpacity, Flatlist, StyleShee, Text, View, Image} from 'react-native';
import {f, auth, database, storage, messaging} from '../../config/config.js'
import PhotoList from '../components/PhotoList.js';
import Headers from '../components/Headers';
import Button from '../components/Button';
import {Entypo, MaterialIcons, FontAwesome5} from '@expo/vector-icons';
import {uniqueId} from '../helpers/Helpers'

class userProfile extends React.Component{

    constructor(props){
        super(props);
        this.state ={
            loadded: false,
            isFriend: false,
            requestSent:false,
            requestId: uniqueId(),
            senderUser: f.auth().currentUser.uid,
            requestReceived: false
        }
    }

    /**
     * check the user profile parameters, and sees what data is being processed 
     */
    checkParam = () => {

        //checkes for the navigation props set on Feed screen
        var params = this.props.navigation.state.params;
        if(params){//checks if the params exister
            if(params.userId){//checkes if the userId exists
                this.setState({
                    userId: params.userId
                });
                this.fectchUserInfo(params.userId);
                this.checkUserRequest(params.userId);
                this.checkIfUsersAreFriends();
                
            }
        }
    }

    /**
     * Checks for a user friend requests
     */
    checkUserRequest = (userId) => {
        var  senderId= this.state.senderUser;
        //start fetching the request
        var ref = f.database().ref('frienRequest');
        ref.once('value').then(snap => {
            var checkUserRequest = snap.child(userId).child(senderId).exists();
            if(checkUserRequest){//checks if the request exists, if it does set the requestSent to true
                
                this.setState({
                    requestSent: true
                });
            }else if(userId == senderId) {//checks if currents user if equal to the friend request sender
                this.setState({
                    isUser: true
                });
            }else{

            }
        })
        //Fetch database to checke if the receiver has received the friend request
        f.database().ref('frienRequest').child(userId).child(senderId).orderByChild('request_type').equalTo('received')
        .once('value').then(snapshot => {
            //console.log(snapshot.val());
            //Loop for each request till find the correct friend request
            snapshot.forEach((data) =>{
                console.log(data.val());
                this.setState({
                    requestReceived:true
                });
            });

        })
    }

    /**
     * Function used to send Friend requests
     */
    sendFriendRequest = (userId) => {

        var receiverId = userId;
        if(receiverId){//checks if the received user ID exists

            var senderId = this.state.senderUser;
            var requestId = this.state.requestId;

            var requestSent = {//set an object to set the request as sent
                request_type: 'sent'
            };
            var requestReceived ={//set an object to set the request as received
                request_type: 'received'
            }

            //Fetcj database
            var ref = f.database().ref('frienRequest');

            //Before sending the request, checks if it already existis 
            ref.once('value').then(snapshot => {

                var checkUserRequest = snapshot.child(receiverId).child(senderId).exists();
                if(checkUserRequest){//check for user requests has been already sent
                    console.log(checkUserRequest);
                    this.setState({
                        requestSent: true
                    })
                }else{//if request does not exists, set a new friend request
                    database.ref('/frienRequest/'+ '/' + receiverId + '/' + senderId + '/' + requestId).set(requestSent);
                    database.ref('/frienRequest/'+ '/' + senderId  + '/' + receiverId+ '/' + requestId).set(requestReceived);
                    this.setState({
                        requestSent: true
                    })
                }
            })
            this.sendPushNotifications(userId, senderId);

            
        }       
    }

    sendPushNotifications = (userId,senderUser ) => {
        f.database().ref('frienRequest/' + userId + '/' + senderUser);
            var messages = [];

        //return the main promise
        f.database().ref('/users/').child('expoToken').once('value').then((snapshot) => {
            snapshot.forEach(childSnapshot => {
                var expoToken = childSnapshot.val().expoToken;

                if(expoToken){
                    messages.push({
                        "to": expoToken,
                        "body": "New Note Added"
                    })
                }
            });

            return Promise.all(messages);
        }).then(messages => {
            fetch('https://exp.host/--/api/v2/push/send',{
                method: 'POST',
                headers: {
                    "Accept" : "application/json",
                    "Content-Type" : "application.json"
                },
                body: JSON.stringify(messages)
            });
            return messages;
        });
    }

    /**
     * Function used to accepet Friend request
     */
    accecptRequest = (currentUser) => {
        var senderId = this.state.senderUser;
        var  date = new Date();
        let outputTime = date.getDate() + " / " + (date.getMonth()+1) + " / " + (date.getFullYear());
        //Fetch the databse to set a new Friends Object
        database.ref('/friends/'+ '/' + senderId + '/' + currentUser+ '/' + 'date').set(outputTime)
        .then(() => {
            //Set a new Friend Object
            database.ref('/friends/'+ '/' + currentUser + '/' + senderId + '/' +'date').set(outputTime)
            .then(() => {
                this.setState({
                    isFriend: true
                })
                //Once the request has beend accepted, delet the friend request.
                this.cancelRequest();
            })
        });

        //Fetch users object to set the number of Friend to +1 for both users.
        f.database().ref('users').child(currentUser).child('friends').transaction((friends) => {
            return (friends || 0) +1;
        });
        f.database().ref('users').child(senderId).child('friends').transaction((friends) => {
            return (friends || 0) +1;
        });

        
        
    }

    /**
     * Check if users are Friends
     */
    checkIfUsersAreFriends = () => {

        //start fetching the database
        var friendRef = f.database().ref('friends');
        friendRef.once('value').then(snapshot => {
            //Checks if friendship exists at both users object
            var checkFriends = snapshot.child(this.state.senderUser).child(this.state.userId).exists();
            var checkFriends1 = snapshot.child(this.state.userId).child(this.state.senderUser).exists();

            if(checkFriends && checkFriends1){//check if friends relationship are the same
                this.setState({
                    isFriend: true
                })
            }
        });
    }

    /**
     * Function used to cancel Friend request once the friend ahas accpeted a request
     * or if the users does not want to accpet request
     */
    cancelRequest = () => {
        var senderUser  = this.state.senderUser
        //Fetch for friend request
        let ref = database.ref('frienRequest' + '/' + this.state.userId + '/' + senderUser);
        let ref1 = database.ref('frienRequest' + '/' + senderUser + '/' + this.state.userId);
        //Remove data from firebase
        ref.remove();
        ref1.remove();
        this.setState({requestSent: false});
    } 

    /**
     * Fetch the user information by getting the userId
     */
    fectchUserInfo = (userId) => {
        var that = this;
        //Fecth databse
        database.ref('users').child(userId).child('username').once('value').then(function(snapshot){
            const exists = (snapshot.val() !== null);
            if(exists) data = snapshot.val();//checks if data exists for all the disired information
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

        database.ref('users').child(userId).child('friends').once('value').then(function(snapshot){
            const exists = (snapshot.val() !== null);
            if(exists) {
                data = snapshot.val();
                that.setState({friends:data});
            }else{
                that.setState({friends:''});
            }

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
                                <View style={{marginTop: 20, flexDirection: 'row'}}>
                                    <FontAwesome5
                                        name={'user-friends'}
                                        size={25}/>
                                    <Text>{this.state.friends}</Text>    
                                </View>
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