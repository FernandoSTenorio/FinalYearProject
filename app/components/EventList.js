import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image} from 'react-native';
import {f, auth, database, storage} from '../../config/config.js';
import timeConverter from '../components/TimerConverter';
import SearchBar from 'react-native-searchbar';

class EventList extends React.Component{

    constructor(props){
        super(props);
        this.state ={
            event_list: [],
            refresh: false,
            loading: true,
            empty: false,
            isEventProvider: false
        }
    }

    /**
     * Checks whether the event exists
     */
    componentDidMount = () => {

        const { isEvent, eventId} = this.props;

        if(isEvent == true){//checks is this is the selected event 
            //Profile
            //userid
            this.loadFeed(eventId);//load the selected event 
        }else{
            this.loadFeed('')
        }
    }

    /**
     * Add events to the FlastList
     */
    addToFlatList = (event_list, data, event) => {
        var that = this;
        var eventObj = data[event];
                    //Fetch the data from database
                    database.ref('users').child(eventObj.author).child('username').once('value').then(function(snapshot){
                        const exists = (snapshot.val() !== null);
                        if(exists) data =snapshot.val();//checks if data evend exists
                        event_list.push({//use the data collected and add to the FlatList
                            id: event,
                            eventPhoto: eventObj.eventPhoto,
                            title: eventObj.title,
                            posted: eventObj.posted,
                            author: data,
                            photoURL: eventObj.photoURL,
                            authorId: eventObj.author,
                            eventId: eventObj.eventId,
                            label: eventObj.label,
                            timeLabel: eventObj.timeLabel,
                            type: eventObj.type,
                            description:eventObj.description,
                            location: eventObj.location
                        });
                        console.log(eventObj.author);
                        
                        that.setState({
                            refresh:false,
                            loading:false
                        });
                    
                    }).catch(error => console.log(error));


    }


    _handleResults = (results) => {
        database.ref('events').orderByChild('title').equalTo(results).once('value').then(snapshot => {
            snapshot.forEach(data => {
                this.setState({results: data.key});
            })
        })
        
    }

    /**
     * Fetch the events published into the Firebase by getting the user id
     */
    loadFeed = (eventId = '') => {
        this.setState({
            refresh:true,
            event_list: []
        });

        var that = this;

        //Start to get the events reference
        var loadRef = database.ref('events');
        if(eventId != ''){//checks if the eventId is not empty
            //Fetch the data
            var loadRef = database.ref('events').child(eventId);
        }

        loadRef.orderByChild('description').once('value').then(function(snapshot) {

            const exists = (snapshot.val() !== null);
            if(exists){ data =snapshot.val();//checks if the data exists
                var event_list = that.state.event_list;

                //Loop through the data, check for each element found and return it as photo
                for(var event in data){
                    
                    that.setState({empty: false});
                    ////if data is found, add to flat list
                    that.addToFlatList(event_list,data, event);
                    
                }
            }else{
                that.setState({empty: true})
            }
        }).catch(error => console.log(error));
        
    }
    
    /**
     * 
     */
    loadNew = () => {

        this.loadFeed();
    }

    render(){
        return(
            <View style={{flex:1}}>

                { this.state.loading == true ? (
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        {this.state.empty === true ? (
                            <Text>No Events has being posted lately...</Text>
                        ) : (
                            <Text>Loading....</Text>
                        )}
                       
                    </View>
                ) : (

                    <FlatList 
                    refreshing={this.state.refresh}
                    onRefresh={this.loadNew}
                    data={this.state.event_list}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    style={{flex:10}}
                    renderItem={({item, index}) => (
                     <TouchableOpacity onPress={() => this.props.navigation.navigate('EventInfo', 
                        {eventId: item.eventId})} key={index} style={styles.eventContainer}>
                        <View >
                            {/* <SearchBar 
                                ref={(ref) => this.searchBar = ref}
                                data={item}
                                handleResults={this.handleResults}
                                showOnLoad/> */}
                            <View style={styles.posterConainter}>
                                <View style={{width:'100%'}}>
                                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                        <Image source={{ url: item.photoURL}} style={styles.profilePicture}></Image>
                                        <Text style={styles.timeText}>{timeConverter(item.posted)}</Text>
                                    </View>
                                    <Text style={styles.bodyText}>{item.author}</Text>
                                </View>
                            </View>
                            <View style={{}}>
                                <Text style={styles.bodyText}>{item.title}</Text>
                                <Image source={{url: item.eventPhoto }}
                                    style={{width: 160, height: 180}}/>
                            </View>
                        </View>
                    </TouchableOpacity>

                    )}
                    /> 

                )}

            </View>
        );
    }

}

const styles = StyleSheet.create({
    eventContainer:{ 
        paddingVertical:20, 
        paddingHorizontal:20, 
        width:'46%',
        maxWidth:'80%',
        marginLeft:11,
        marginTop:20,
        alignItems:'center', 
        shadowColor:'black',
        shadowOffset: {width:1, height:5},
        shadowRadius:7,
        shadowOpacity: 0.26,
        elevation: 5,
        backgroundColor:'white',
        borderRadius:10
    },
    posterContainer:{
        width:185, 
        flexDirection:'row', 
        justifyContent:'space-evenly', 
        flexDirection:'row-reverse'
        
    },
    profilePicture:{
        marginLeft:10, 
        width: 50, 
        height: 50, 
        borderRadius: 25
    },
    bodyText:{
        fontSize:13,
        fontWeight:'bold'
    },
    timeText:{
        paddingLeft: 5, 
        color: "#838899", 
        fontSize:12
    }

});

export default EventList;