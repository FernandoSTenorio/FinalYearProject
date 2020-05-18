import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image} from 'react-native';
import EventList from '../components/EventList.js';
import Headers from '../components/Headers';
import {AntDesign} from '@expo/vector-icons';
import Colors from '../components/constants/colors';
import {f, auth, database, storage} from '../../config/config.js';


class Events extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            event_list: [],
            refresh: false,
            loading:true,
            isEventProvider: false
        }
    }
    

    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function(user){
            if(user){
                that.checkUserType(user.uid);
            }else{
                //logged out
                that.setState({
                    loggedin: false
                });
            }
        });

    }

    checkUserType = (userID) => {
        var that = this;
        database.ref('users').child(userID).child('userType').once('value').then(snap => {
            var exists = (snap.val() !== null);
            if(exists) data = snap.val();
            that.setState({userType:data})
            if(that.state.userType === "EventProvider"){
                that.setState({
                    isEventProvider:true
                });
            }else{
                that.setState({
                    isEventProvider:false
                })
            }
            console.log(that.state.userType);
        })
    }

    render()
    {
        return(
            <View style={{flex:1}}>
                <Headers onPress={() => this.props.navigation.goBack()} back='back'>
                    <Text style={styles.title}>Events</Text>
                    {this.state.isEventProvider === false ? (
                        <View></View>
                    ) : (
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('UploadEvents')}
                        style={{paddingRight: 10}}>
                        <AntDesign
                            name='plus'
                            size={30}
                            color={Colors.firstText}/>
                    </TouchableOpacity>
                    )}
                    
                </Headers>
                <EventList isEvent={false} navigation={this.props.navigation}></EventList>    
            </View>
        )
    }
    
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight:'bold',
        color: Colors.firstText
    }
});

export default Events;