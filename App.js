import React from 'react';
import { createStackNavigator, createBottomTabNavigator} from 'react-navigation'
import Feed from './app/screens/Feed.js';
import Profile from './app/screens/Profile.js';
import Events from './app/screens/Events.js';
import Upload from './app/screens/Upload.js';
import userProfile from './app/screens/userProfile.js';
import Comments from './app/screens/Comments.js';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import Headers from './app/components/Headers.js';
import UploadEvents from './app/screens/UploadEvents.js';
import EventInfo from './app/screens/EventInfo.js';
import Form from './app/screens/Form';
import Articles from './app/screens/Articles';


/**
 * Create a Bottom Stack navigator, that will be shown at the bottom of the application
 */
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
    Articles : {screen: Articles,
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Entypo
            name='news'
            size={35}
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

/**
 * Create a Stck navigator and add all the screens
 */
const MainStack = createStackNavigator(
  {
    Home: { screen: TabStack },
    User: { screen: userProfile },
    Comments: { screen: Comments },
    UploadEvents: { screen: UploadEvents},
    EventInfo: {screen: EventInfo},
    Header: {screen: Headers},
    Form: {screen: Form}
  },
  {
    //Set initial route
    initialRouteName: 'Home',
    mode: 'modal',
    headerMode: ' none'

  }
)

export default class App extends React.Component {

  
  constructor(props){
    super(props);
    this.state = {
      loggedin: false
    
    }
  }


  // registerPushNotificationAsync = async (user) => {

  //   if (Constants.isDevice) {
  //     const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== 'granted') {
  //       const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== 'granted') {
  //       alert('Failed to get push token for push notification!');
  //       return;
  //     }
  //     token = await Notifications.getExpoPushTokenAsync();
  //     console.log(token);
  //     this.setState({ expoPushToken: token });

  //     var updates = {};
  //     updates['/expoToken']  = token
  //     f.database().ref('users').child(user.uid).update(updates);

  //   } else {
  //     alert('Must use physical device for Push Notifications');
  //   }

  //   if (Platform.OS === 'android') {
  //     Notifications.createChannelAndroidAsync('default', {
  //       name: 'default',
  //       sound: true,
  //       priority: 'max',
  //       vibrate: [0, 250, 250, 250],
  //     });
  //   }

  // }
  render() {
    return (
      
      <MainStack/>
    );
  } 
}

