import React, { useState } from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image} from 'react-native';
import {f, auth, database, storage} from '../../config/config.js'
import PhotoList from '../components/PhotoList.js';
import Headers from '../components/Headers';
import Colors from '../components/constants/colors'
import {AntDesign} from '@expo/vector-icons';

const Feed  = props =>{

    const refresh = useState(false);
    const photo_feed = useState([])
    const loading = useState(true);

    const componentDidMount = () => {

    }

    
        return(
            <View style={{flex: 1}}>
                <Headers  style={{fontWeight: 'bold', color: Colors.firstText}}>
                    <View style={{flex:1, justifyContent:'center'}}>
                        <Text style={{marginLeft:'10%' ,textAlign:'center', fontWeight:'bold', color: Colors.firstText, fontSize:18}}>Feed</Text>
                    </View>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Upload')}
                        style={{paddingRight: 10}}>
                        <AntDesign
                            name='plus'
                            size={30}
                            color={Colors.firstText}/>
                    </TouchableOpacity>
                </Headers>
                <PhotoList isUser={false} navigation={props.navigation}></PhotoList>
                    
            </View>
        )
    

}

export default Feed;