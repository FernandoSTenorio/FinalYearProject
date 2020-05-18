import React from 'react';
import {View, TouchableOpacity, Text, TextInput, Image, ScrollView, StyleSheet} from 'react-native';
import {f, auth, database, storage} from '../../config/config.js'
import Button from '../components/Button';
import timeConverter from '../components/TimerConverter';
import Headers from '../components/Headers';
import Colors from '../components/constants/colors';
class EventInfo extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loaded: false
        }
    }

    /**
     * Check the parameters, to check what data is going to be parsed to The event screen
     */
    checkParam = () => {

        //Fetch the user id from that posted the event
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

    /**
     * Fetch user data from Firebase
     */
    fecthEventInfo = (eventId) => {
        var that = this;
        //Fetch data
        database.ref('events').child(eventId).child('author').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null);
            //If event exists in the database , replace the variabel with the returned snapshot
            if(exists) data = snapshot.val();
            //retrieve the data to the application
            that.setState({author:data});
        }).catch(error => console.log(error));
         database.ref('events').child(eventId).child('photoURL').once('value').then(function (snapshot) {
             const exists = (snapshot.val() !==null);
             //If event exists in the database , replace the variabel with the returned snapshot
             if(exists) data = snapshot.val();
             //retrieve the data to the application
             that.setState({photoURL:data});
         }).catch(error => console.log(error));
         database.ref('events').child(eventId).child('subject').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !==null);
            //If event exists in the database , replace the variabel with the returned snapshot
            if(exists) data = snapshot.val();
            //retrieve the data to the application
            that.setState({subject:data});
        }).catch(error => console.log(error));
        database.ref('events').child(eventId).child('description').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !==null);
            //If event exists in the database , replace the variabel with the returned snapshot
            if(exists) data = snapshot.val();
            //retrieve the data to the application
            that.setState({description:data});
        }).catch(error => console.log(error));
        database.ref('events').child(eventId).child('posted').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !==null);
            //If event exists in the database , replace the variabel with the returned snapshot
            if(exists) data = snapshot.val();
            //retrieve the data to the application
            that.setState({posted:data});
        }).catch(error => console.log(error));
        database.ref('events').child(eventId).child('eventPhoto').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !==null);
            //If event exists in the database , replace the variabel with the returned snapshot
            if(exists) data = snapshot.val();
            that.setState({eventPhoto:data});
        }).catch(error => console.log(error));
        database.ref('events').child(eventId).child('type').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !==null);
            //If event exists in the database , replace the variabel with the returned snapshot
            if(exists) data = snapshot.val();
            that.setState({type:data});
        }).catch(error => console.log(error));
        database.ref('events').child(eventId).child('vetting').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !==null);
            //If event exists in the database , replace the variabel with the returned snapshot
            if(exists) data = snapshot.val();
            that.setState({vetting:data});
        }).catch(error => console.log(error));
        database.ref('events').child(eventId).child('location').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !==null);
            //If event exists in the database , replace the variabel with the returned snapshot
            if(exists) data = snapshot.val();
            that.setState({location:data});
        }).catch(error => console.log(error));
        database.ref('events').child(eventId).child('outputTime').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !==null);
            //If event exists in the database , replace the variabel with the returned snapshot
            if(exists) data = snapshot.val();
            that.setState({outputTime:data});
        }).catch(error => console.log(error));
        database.ref('events').child(eventId).child('outputDate').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !==null);
            //If event exists in the database , replace the variabel with the returned snapshot
            if(exists) data = snapshot.val();
            that.setState({outputDate:data});
        }).catch(error => console.log(error));

         

    }

    //
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
                            
                            <Headers onPress={()=> this.props.navigation.goBack()} back='back' >
                                <View style={styles.subContainer}>
                                    <Text style={styles.title}>Event Information</Text>
                                </View>
                            </Headers>
                            <View style={styles.eventContainer}>
                            <View style={{paddingLeft: 15, paddingVertical: 10}}>
                                <Image source={{ url:this.state.photoURL}} style={{width: 100, height: 100, borderRadius: 50}}></Image>
                                <View>
                                    <View style={styles.avatarContainer}>
                                        <Text>{this.state.subject}</Text>
                                    <Text>{timeConverter(this.state.posted)}</Text>
                                    </View>
                                    <Text style={styles.text}>Description: {this.state.description}</Text>
                                    <Text style={styles.text}>Date: {this.state.outputDate}</Text>
                                    <Text style={styles.text}>Time: {this.state.outputTime}</Text>
                                    <Image source={{url: this.state.eventPhoto}} 
                                    style={{resizeMode: 'cover', width: '100%', height: 275}}/>
                                    <Text style={styles.text}>Event Type: {this.state.type}</Text>
                                    <Text style={styles.text}>Vetting Required: {this.state.vetting}</Text>
                                    <Text style={styles.text}>Location: {this.state.location}</Text>
                                </View>

                                <View>
                                    <Button onPress={() => this.props.navigation.navigate('Form', {eventId: this.state.eventId})} message={'Apply'}/>
                                </View>

                            </View>
                        </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    eventContainer:{
        width:'100%',
        marginBottom: 5,
        marginTop: 5,
        shadowColor:'black',
        shadowOffset: {width:1, height:5},
        shadowRadius:5,
        shadowOpacity: 0.26,
        elevation: 5,
        backgroundColor:'white',
        borderRadius:10,
        paddingRight: '5%'
    },
    avatarContainer:{

    },
    subContainer:{
        flex:1, 
        justifyContent:'center'
    },
    title:{
        textAlign:'center', 
        fontWeight:'bold', 
        color: Colors.firstText, 
        fontSize:18, 
        paddingRight:'10%'
    },
    text:{
        
        fontSize: 15,
        fontWeight: "500",
        color: "#454D65",
    }
})

export default EventInfo;
