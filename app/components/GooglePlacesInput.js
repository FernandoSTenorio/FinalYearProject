import React from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

class GooglePlacesInput extends React.Component{

  render(){

    return (
      <View>
        <GooglePlacesAutocomplete
          placeholder='Search'
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
          listViewDisplayed={false}    // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description}
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            console.log(data, details);
          }}
          getDefaultValue={() => {
            return ''; // text input default value
          }}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'AIzaSyAKcsjo64CJOdqN7s69G-AhSwGy_6SJzJc',
            language: 'en', // language of the results
            types: '(cities)' // default: 'geocode'
          }}
    
          styles={{
            textInputContainer: {
              width: '100%'
            },
            description: {
              fontWeight: 'bold'
            },
            predefinedPlacesDescription: {
              color: '#1faadb'
            }
          }}

          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3',
          ]}
          currentLocation={true}
          ebounce={200}
          
    
        />
      </View>
    );

  }
 
}

export default GooglePlacesInput;
