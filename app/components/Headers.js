import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../components/constants/colors'

const Header = props => {
    return (
        <View {...props} style={{...styles.header,...props.style}}>
            <TouchableOpacity {...props} style={{...props.style}}>
                <Text style={{...styles.backText,...props.style}}>{props.back}</Text>
            </TouchableOpacity>
            {props.children}
        </View>
    );
};

const styles = StyleSheet.create({
    header:{
        flexDirection:'row',
        width: '100%',
        height: 70,
        paddingTop: 40,
        alignItems:"center",
        backgroundColor: Colors.primary,
        justifyContent:'space-between'
    },
    headerTitle:{
        color: 'black',
        fontSize: 18,
        fontWeight:'bold',
        textAlign:'center',
        marginHorizontal:'35%'

    },
    backText:{
        fontSize: 12, 
        fontWeight: 'bold',
        color: Colors.firstText,
        paddingLeft:10
    }
});

export default Header;