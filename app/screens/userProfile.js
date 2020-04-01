import React from 'react';
import { TouchableOpacity, Flatlist, StyleShee, Text, View, Image} from 'react-native';
import {f, auth, database, storage} from '../../config/config.js'
import PhotoList from '../components/PhotoList.js';
import Headers from '../components/Headers'

class userProfile extends React.Component{

    constructor(props){
        super(props);
        this.state ={
            loadded: false
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
            }
        }

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
                        {/* <TouchableOpacity
                            style={{width:100}} 
                            onPress={() => this.props.navigation.goBack()}>
                                <Text style={{fontSize: 12, fontWeight: 'bold', paddingLeft: 10}}>Back</Text>
                            </TouchableOpacity> */}
                            <Headers title='Profile' onPress={() => this.props.navigation.goBack()} back='back'>
                                
                            </Headers>
                            
                        
                        <View style={{paddingLeft: 15, alignItems: 'center', flexDirection: 'row', paddingVertical: 10}}>
                            <Image source={{ url:this.state.photoURL}} style={{width: 100, height: 100, borderRadius: 50}}></Image>
                            <View style={{marginRight: 50, paddingLeft: 10}}>
                                <Text>{this.state.displayName}</Text>
                                <Text>{this.state.username}</Text>
                            </View>
                        </View>
                        <PhotoList isUser={true} userId={this.state.userId} navigation={this.props.navigation}></PhotoList>  
                    </View>
                 )}
            </View>

        );
                }
}

export default userProfile;