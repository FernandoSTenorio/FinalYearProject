import React, {useState} from 'react';
import {TouchableOpacity, TextInput, KeyboardAvoidingView, FlatList, StyleSheet, Text, View, Image} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../components/constants/colors';

const Likes = props => {
    const [refresh, isRefreshed] = useState(false);

    return (

        <TouchableOpacity onPress={props.onPress}>
            <View style={{flexDirection:'row'}}>
                <Text>{props.refresh}</Text>
                <AntDesign 
                    name={'like1'}
                    size={25}
                    color={Colors.primary}/>
                <Text style={styles.text}>{props.children}</Text>
                
            </View>
        </TouchableOpacity>
            
    );     
}
const styles = StyleSheet.create({
    text:{
        marginTop:15, 
        textAlign:'center'
    }
})

export default Likes;