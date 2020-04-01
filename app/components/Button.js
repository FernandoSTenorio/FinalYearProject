import React from 'react';
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import Colors from '../components/constants/colors'

const Button = props => {
    return(
        <TouchableOpacity {...props} style={{...styles.facebookLokingButton, ...props.style}}>
        <Text  style={{...styles.text, ...props.style }}>{props.message}</Text>  
        {props.children}           
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    facebookLokingButton: { 
        backgroundColor:Colors.primary, 
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        borderColor: 'grey', 
        borderRadius: 20,
        marginTop:10,
        alignItems:'center'

    },
    text:{
        color:'white'
    }
});

export default Button;