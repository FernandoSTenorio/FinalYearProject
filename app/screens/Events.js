import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image} from 'react-native';
import EventList from '../components/EventList.js';
import Headers from '../components/Headers';
import {AntDesign} from '@expo/vector-icons';
import Colors from '../components/constants/colors'

class Events extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            event_list: [],
            refresh: false,
            loading:true
        }
    }

    componentDidMount = () => {

    }

    render()
    {
        return(
            <View style={{flex:1}}>
                <Headers onPress={() => this.props.navigation.goBack()} back='back'>
                    <Text style={styles.title}>Events</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('UploadEvents')}
                        style={{paddingRight: 10}}>
                        <AntDesign
                            name='plus'
                            size={30}
                            color={Colors.firstText}/>
                    </TouchableOpacity>
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