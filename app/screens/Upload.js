import React from 'react';
import {TextInput, ActivityIndicator, TouchableOpacity, StyleSheet, Text, View, Image, ScrollView, Modal} from 'react-native';
import {f, auth, database, storage} from '../../config/config.js'
import * as ImagePicker from 'expo-image-picker';
import UserAuth from '../components/Auth.js'
import { MaterialIcons } from '@expo/vector-icons';
import Headers from '../components/Headers';
import Button from '../components/Button';
import Colors from '../components/constants/colors';
import {_checkPermission, uniqueId} from '../helpers/Helpers';
class Upload extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            loggedin: false,
            imageId: uniqueId(),
            imageSelected: false,
            uploading: false,
            caption: '',
            progress: 0,
            photoURL: '',
            modalVisible: false
        }
        
    }

    /**
     * This function sets whether the modal is visible or not
     */
    setModalVisible = (modalVisible) => {
        this.setState({
            modalVisible: modalVisible
        })
    }

    /**
     * This functions opens the user camera in order to take picture
     */
    takePhoto = async () => {
        _checkPermission();

        //check if the image picker is opened up
        //variable that is assigned to the image picked 
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            quality: 1
        });

        //check if canceled is false, then continue picking the image
        if(!result.cancelled){
            this.setState({
                imageSelected: true,
                imageId: uniqueId(),
                uri: result.uri
            });
        }else{
            this.setState({
                imageSelected: false
            })
        }
        
    }

    /**
     * This function opens the mobile galery to select a picture
     */
    findNewImage = async () => {
        _checkPermission();

        //check if the image picker is opened up
        //variable that is assigned to the image picked 
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            quality: 1
        });

        console.log(result);

        //check if canceled is false, then continue picking the image
        if(!result.cancelled){

            console.log('upload image');
            this.setState({
                imageSelected: true,
                imageId: uniqueId(),
                uri: result.uri
            });

        }else{
            console.log('cancel');
            this.setState({
                imageSelected: false
            });
        }
    }

    /**
     * Async function used to upload the image to Firebase Storage
     */
    uploadImage = async (uri) => {
        var that = this;
        var userId = f.auth().currentUser.uid;
        var imageId = this.state.imageId;

        //set Extension of the file, look for sequance of Characters that matches the last .
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(uri)[1];//eg.image.pgn
        this.setState({
            currentFileType: ext,
            uploading: true
        });
        //create a fetch call to the image uri
        const response = await fetch(uri)
        //return the response into a blob used to upload into Firebase Storage
        const blob = await response.blob();
        var FilePath = imageId+'.'+that.state.currentFileType;

        //create a reference to sorage
        const uploadTask = storage.ref('users/'+userId+'/img').child(FilePath).put(blob);

        //fetch information from storage
        uploadTask.on('state_changed', (snapshot) => {
            //check how many bytes are being uploaded
            var progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
            console.log('Upload is ' +progress+'% comlete');
            that.setState({
                progress: progress
            });
        }, function(error){
            console.log('error with upload - ' +error);
        }, function(){
             that.setState({progress: 100});
             uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
                console.log(downloadURL);
                that.processUpload(downloadURL);
             });
        });
    }

    uploadPublish = () => {
        //check if the caption text is empty
        if(this.state.caption !== ''){
            this.uploadImage(this.state.uri);
            //check if the Upload buttom has already being pressed
            if(this.state.uploading === true){
            }else{
                console.log('Button tap is already uploading');
            }
        }else{
            alert('Please enter a caption...')
        }
        
    }

    /**
     * create the Objects that will be uploeaded to firebase
     */
    processUpload = async (imageURL) => {
        var that = this;
    
        //set needed objects
        var imageId = this.state.imageId;
        var userId = f.auth().currentUser.uid;
        var photoURL = f.auth().currentUser.photoURL;
        var caption = this.state.caption;
        var dateTime = Date.now();
        var timestamp = Math.floor(dateTime / 1000);
        
        //create a photo objects
        var photoObjs = {
            author: userId,
            caption: caption,
            posted: timestamp,
            url: imageURL,
            photoURL: photoURL
        };

        //Add to feed
        database.ref('/photos/' +imageId).set(photoObjs);

        //Set user photo objects
        database.ref('/users/'+userId+'/photos/' +imageId).set(photoObjs);
 
        alert('Image Uploaded');

        this.setState({
            uploading: false,
            imageSelected: false,
            caption: '',
            uri: '',
        });
       

    }

    /**
     * Checks whether the user is logged in or not
     */
    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function(user){
            if(user){
                
                that.setState({
                    loggedin: true
                });
                
            }else{
                that.setState({
                    loggedin: false
                });
            }
        });
    }
    

    render()
    {
        
        return(
            <View style={{flex: 1}}>
                { this.state.loggedin == true ? (
                    //logged in
                    <ScrollView>
                    
                        <ScrollView >
                            <Headers onPress={()=> this.props.navigation.goBack()} back='back' >
                                <View style={{flex:1, justifyContent:'center'}}>
                                    <Text style={styles.title}>Upload</Text>
                                </View>
                            </Headers>
                             <ScrollView >
                                 
                                <Modal
                                  animationType='slide'
                                  transparent={true}
                                  visible={this.state.modalVisible}
                                  onRequestClose={() => { 
                                   alert('Modal has been closed')}}>
                                    <View style={styles.centeredView}>
                                        <View style={styles.modalView}>
                                            <Text style={styles.modalText}>Testing modal</Text>
                                            <Button onPress={() => this.takePhoto()} message={'Take Picture'}/>
                                            <Button onPress={() => this.findNewImage()} message={'Select Picture'}/>
                                            <Button onPress={() => this.setModalVisible(!this.state.modalVisible)} message={'Hide it'}/>
                                            
                                        </View>
                                    </View>   
                                </Modal>
                                
                                <TouchableOpacity
                                    onPress={() => this.setModalVisible(true)}
                                    style={{paddingVertical: 10,height: 200, paddingHorizontal: 20, borderRadius: 5}}>
                                    {this.state.imageSelected === false ? (
                                        <View style={styles.iconContainer}>
                                            <MaterialIcons 
                                            name='add-a-photo'
                                            size={80}/>
                                        </View>
                                    ) : (
                                        <Image
                                        source={{uri: this.state.uri}}
                                        style={styles.imageSelected}></Image>
        
                                    )}
                                </TouchableOpacity>
                                <TextInput 
                                editable={true}
                                placeholder={'Place your caption...'}
                                maxLenght={150}
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={(text) => this.setState({caption: text})}
                                style={styles.caption}/>
                                
                                <View style={styles.buttonContainer}>
                                    <Button onPress={() => this.uploadPublish()} message={'Post'}/>
                                </View>
                                {/* Checks if the uploading is true, if it is, displays on the screen */}
                                { this.state.uploading == true ? (
                                    <View style={{margintTop: 10}}>
                                        <Text>{this.state.progress}%</Text>
                                        { this.state.progress != 100 ?(
                                            //Check the process activity loadding 
                                            <ActivityIndicator size='small' color='blue' />
                                        ) : (
                                            <Text>Processing</Text>
                                        )}
                                    </View>
                                ) : (
                                    <View></View>
                                )}
                                </ScrollView>
                                
                             </ScrollView>
                        </ScrollView>
                    
                ) : (
                    //logged out
                    <UserAuth message={'Please login to upload a picture'}></UserAuth>

                )}
                

            </View>
        );
    }

}

const styles = StyleSheet.create({
    title:{
        textAlign:'center', 
        fontWeight:'bold', 
        color: Colors.firstText, 
        fontSize:18, 
        paddingRight:'10%'
    },
    buttonContainer:{
        alignSelf:'center',
        width:'70%'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
    caption:{
        marginVertical: 10, 
        height: 100, 
        padding: 5,
        paddingTop: 20, 
        borderColor: 'grey', 
        borderStartWidth: 1, 
        borderRadius: 3, 
        backgroundColor: 'white', 
        color: 'black'
    },
    iconContainer:{
        alignContent:'center', 
        paddingLeft:'40%', 
        paddingTop:'10%'
    },
    imageSelected:{
        marginTop: 10, 
        resizeMode: 'cover', 
        width: '100%', 
        height: 250
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
});

export default Upload;
