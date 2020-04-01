import React from 'react';
import {TextInput, StyleSheet} from 'react-native';

const LoginInput = props => {
    return <TextInput {...props} style={{...styles.input, ...props.style}}/>
};

const styles = StyleSheet.create({
    input: {
        width: 250, 
        marginVertical: 10, 
        padding: 5,
        borderWidth:1, 
        borderRadius: 10
    }
});

export default LoginInput;