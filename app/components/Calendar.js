import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome, Ionicons } from "@expo/vector-icons";


const Calendar = props => {
    const {onChange} = props;

    const today = new Date();
    const [date, setDate] = useState(today);
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState('date');
    let outputDate = date.getDate() + " / " + (date.getMonth()+1) + " / " + (date.getFullYear());
    let outputTime = date.getHours() + ":" + date.getMinutes();
    
    
    
    const isShow = () => {
        setShow(true);
    }

    const onChange_old = (event, selectedDate) => {
        const currentDate = selectedDate || date; //in case the user hits 'cancel', the date default will be stored
        //setShow(false);
        
        setDate(currentDate);
        onChange(currentDate);
        setShow(Platform.OS === 'ios' ? true : false); //according to Marco Terzolo "iOS dateTimePicker is a component that can be put and kept open side the view while android is more like a pop up so it has to be closed and opened only during user actions on its trigger". source: https://stackoverflow.com/questions/59901157/react-native-datetimepicker-question-in-this-code-why-platform-os-iostrue
        if(selectedDate < today){
            alert('The event cannot be bosted...');
          }
    }
    const showMode = currentMode => {
      setShow(true);
      setMode(currentMode);
      
    }
    const showDatepicker = () => {
      showMode('date');
      
    };
    const showTime = () => {
      showMode('time');
      
    }

    return (
        <ScrollView>
            <TouchableOpacity style={styles.container} onPress={() => showDatepicker()}>
                <View style={styles.outputContainer}>
                    <Text style={styles.output}>{outputDate}</Text>
                </View>
                <View style={styles.icon}>
                    <FontAwesome
                        name="calendar"
                        size={40}
                        color={'grey'}/>
                </View>
            </TouchableOpacity>
            <Text></Text>
            <TouchableOpacity style={styles.container} onPress={() => showTime()}>
                <View style={styles.outputContainer}>
                  <Text style={styles.output}>{outputTime}</Text>
                </View>
              <View style={styles.icon}>
                  <Ionicons
                    name="md-clock"
                    size={40}
                    color={'grey'}/>
              </View>
            </TouchableOpacity>

            {show && <DateTimePicker
                testID="dateTimePicker"
                value={date}
                display="spinner"
                is24Hour={true}
                mode={mode}
                timeZoneOffsetInMinutes={0}
                maximumDate={new Date(today.getFullYear() + today.getFullYear() , today.getMonth(), today.getDate())}
                onChange={onChange_old}
            />}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    label: {
        fontSize: 15,
        fontWeight: "bold",
        paddingBottom: 5,
    },
    outputContainer: {
        flexDirection: "column",
        width: "80%",
        paddingLeft:'5%'
    },
    output: {
        fontSize: 16,
        textAlign: "center",
        textAlignVertical: "center",
        height: 40,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 10,
    },
    icon: {
        justifyContent: "flex-end",
        paddingRight: '5%'
    }
});

export default Calendar