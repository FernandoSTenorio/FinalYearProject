import React from 'react';
import {  StyleSheet, Text, View, TouchableHighlight, TextInput } from 'react-native';
import {f, auth, database, storage} from './config/config.js'
import { createStackNavigator, createBottomTabNavigator} from 'react-navigation'

import Feed from './app/screens/Feed.js';
import Profile from './app/screens/Profile.js';
import Events from './app/screens/Events.js';
import Upload from './app/screens/Upload.js';
import userProfile from './app/screens/userProfile.js';
import Comments from './app/screens/Comments.js';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Headers from './app/components/Headers.js';
import UploadEvents from './app/screens/UploadEvents.js';
import EventInfo from './app/screens/EventInfo.js';
import Likes from './app/components/Likes';


const TabStack = createBottomTabNavigator(
  {
    Feed: {screen: Feed,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <Ionicons
            name='ios-home'
            size={28}
            fill={focused ? '#111' : '#939393'}
          />
        )
      }
    },
    Upload: {screen: Upload,
      navigationOptions: {screen: Upload,
        tabBarIcon: ({ focused }) => (
          <Ionicons
            name='ios-cloud-upload'
            size={28}
            fill={focused ? '#111' : '#939393'}
          />
        )
      }
    },
    Profile: {screen: Profile,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <Ionicons
            name='md-list'
            size={28}
            fill={focused ? '#111' : '#939393'}
          />
        )
      }
    },
    Events: {screen: Events,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <MaterialIcons
            name='event'
            size={28}
            fill={focused ? '#111' : '#939393'}
          />
        )
      }
    }
  }
)

const MainStack = createStackNavigator(
  {
    Home: { screen: TabStack },
    User: { screen: userProfile },
    Comments: { screen: Comments },
    UploadEvents: { screen: UploadEvents},
    EventInfo: {screen: EventInfo},
    Header: {screen: Headers},
    Likes: {screen: Likes}
  },
  {
    initialRouteName: 'Home',
    mode: 'modal',
    headerMode: ' none'

  }
)

export default class App extends React.Component {

  
  constructor(props)
  {
    super(props);
    this.state = {
      loggedin: false
    
    }
    //this.registerUser('fernando@gmail.com', 'fernando');
    var that = this;
    f.auth().onAuthStateChanged(function(user){
      if(user){
        //Logged in
      
        that.setState({
          loggedin: true
        });
        console.log('Logged in', user);

      }else{
        //Logged out

        that.setState({
          loggedin: false
        });
        console.log('Logged out', user);

      }
    });
  }





  render() {
    return (
      <MainStack/>
    );
  } 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

