import React from 'react';
import {View, TouchableOpacity, Text, TextInput, Image, ScrollView} from 'react-native';
import {f, auth, database, storage} from '../../config/config.js'
import EventList from '../components/EventList.js';
import timeConverter from '../components/TimerConverter';

class EventInfo extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loaded: false
        }
    }

    checkParam = () => {

        var params = this.props.navigation.state.params;
        if(params){
            if(params.eventId){
                this.setState({
                    eventId: params.eventId
                });
                this.fecthEventInfo(params.eventId);
            }
        }

    }

    fecthEventInfo = (eventId) => {
        var that = this;

        database.ref('events').child(eventId).child('author').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null);
            if(exists) data = snapshot.val();
            that.setState({author:data});
        }).catch(error => console.log(error));
         database.ref('events').child(eventId).child('photoURL').once('value').then(function (snapshot) {
             const exists = (snapshot.val() !==null);
             if(exists) data = snapshot.val();
             that.setState({photoURL:data});
         }).catch(error => console.log(error));
         database.ref('events').child(eventId).child('title').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !==null);
            if(exists) data = snapshot.val();
            that.setState({title:data});
        }).catch(error => console.log(error));
        database.ref('events').child(eventId).child('description').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !==null);
            if(exists) data = snapshot.val();
            that.setState({description:data});
        }).catch(error => console.log(error));
        database.ref('events').child(eventId).child('posted').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !==null);
            if(exists) data = snapshot.val();
            that.setState({posted:data});
        }).catch(error => console.log(error));
        database.ref('events').child(eventId).child('eventPhoto').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !==null);
            if(exists) data = snapshot.val();
            that.setState({eventPhoto:data});
        }).catch(error => console.log(error));
        database.ref('events').child(eventId).child('type').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !==null);
            if(exists) data = snapshot.val();
            that.setState({type:data});
        }).catch(error => console.log(error));
        database.ref('events').child(eventId).child('vetting').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !==null);
            if(exists) data = snapshot.val();
            that.setState({vetting:data});
        }).catch(error => console.log(error));
        database.ref('events').child(eventId).child('location').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !==null);
            if(exists) data = snapshot.val();
            that.setState({location:data});
        }).catch(error => console.log(error));
        database.ref('events').child(eventId).child('outputTime').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !==null);
            if(exists) data = snapshot.val();
            that.setState({outputTime:data});
        }).catch(error => console.log(error));
        database.ref('events').child(eventId).child('outputDate').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !==null);
            if(exists) data = snapshot.val();
            that.setState({outputDate:data});
        }).catch(error => console.log(error));

         

    }

    componentDidMount = () => {
        this.checkParam();
    }
    

    render() {
        return(
            <ScrollView>
                <View style={{flex: 1}}>
                    {this.state.loadded == false ? (
                        <View>
                            <Text>Loading...</Text>
                        </View>
                    ) : (
                        <View style={{flex: 1}}>
                            <View style={{flexDirection:'row', height: 70, paddingTop: 30, backgroundColor: 'white', borderColor: 'lightgrey', borderBottomWidh: 1.0, justifyContent: 'center', justifyContent: 'space-between',alignItems: 'center'}}>
                                <TouchableOpacity
                                style={{width:100}} 
                                onPress={() => this.props.navigation.goBack()}>
                                    <Text style={{fontSize: 12, fontWeight: 'bold', paddingLeft: 10}}>Back</Text>
                                </TouchableOpacity>
                                <Text>Event Info</Text>
                                <Text style={{width:100}}></Text>
                            </View>
                            <View style={{paddingLeft: 15, paddingVertical: 10}}>
                                <Image source={{ url:this.state.photoURL}} style={{width: 100, height: 100, borderRadius: 50}}></Image>
                                <View>
                                    <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                                        <Text>{this.state.title}</Text>
                                    <Text>{timeConverter(this.state.posted)}</Text>
                                    </View>
                                    <Text>Description: {this.state.description}</Text>
                                    <Text>Date: {this.state.outputDate}</Text>
                                    <Text>Time: {this.state.outputTime}</Text>
                                    <Image source={{url: this.state.eventPhoto}} 
                                    style={{resizeMode: 'cover', width: '100%', height: 275}}/>
                                    <Text>Event Type: {this.state.type}</Text>
                                    <Text>Vetting Required: {this.state.vetting}</Text>
                                    <Text>Location: {this.state.location}</Text>
                                </View>

                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        );
    }

}

export default EventInfo;
