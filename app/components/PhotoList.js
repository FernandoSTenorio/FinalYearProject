import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image} from 'react-native';
import {f, auth, database, storage} from '../../config/config.js';
import timeConverter from '../components/TimerConverter.js';
import {FontAwesome, AntDesign} from '@expo/vector-icons';
import Colors from '../components/constants/colors';
import Likes from '../components/Likes';
import {uniqueId} from '../helpers/Helpers'

class PhotoList extends React.Component{
    
    constructor(props){
        super(props);
        this.state ={
            photo_feed: [],
            refresh: false,
            loading: true,
            empty: false,
            comments: 0,
            photoId:'',
            refreshLike: false
        }
    }

    /**
     * Checks for photos parameters
     */
    checkParams = () => {

        //checkes for the navigation props screen
        var params = this.props.navigation.state.params;
        if(params){//checks if parameters exists
            if(params.photoId){//checks if photoId exists
                this.setState({
                    photoId: params.photoId,
                });
            }
        }
    }

    /**
     * Check s if use looged in
     */
    checkUserIsLogged = () => {
        var that = this;
        f.auth().onAuthStateChanged(function(user){
            if(user){//checks if user exists
                //user is looged in
                that.setState({
                    loggedin: true
                });
                
            }else{
                //user is looged ou
                that.setState({
                    loggedin: false
                });
            }
        });
    }

    /**
     * Function used to check if the users exists
     */
    componentDidMount = () => {

        const { isUser, userId } = this.props;

        if(isUser == true){//checks if exists
            //Profile
            //userid
            this.loadFeed(userId);
            
            
        }else{
            this.loadFeed('')
        }
        this.checkUserIsLogged()
         
    }

    /**
     * Add data from Firebase to the FlatList
     */
    addToFlatList = (photo_feed, data, photo) => {
        var that = this;
        var photoObj = data[photo];
                    //Fetch the data from Firebase
                    database.ref('users').child(photoObj.author).child('username').once('value').then(function(snapshot){
        
                        const exists = (snapshot.val() !== null);
                        if(exists) data =snapshot.val();//check if the data existis
                        //use the photo_feed array to push the data to the FlatList 
                        photo_feed.push({
                            id: photo,
                            url: photoObj.url,
                            caption: photoObj.caption,
                            posted: photoObj.posted,
                            author: data,
                            photoURL: photoObj.photoURL,
                            authorId: photoObj.author,
                            comments: photoObj.comments,
                            likes: photoObj.likes
                        });
                        that.setState({
                            refresh:false,
                            loading:false
                        });
                        
                    
                    }).catch(error => console.log(error));


    }

    /**
     * Checks if users has already liked a post
     */
    checkForUser = (imageId, likeId, userId) => {
        let rootRef = f.database().ref('likes');
        //Fetch into firebase to find user id
        rootRef.child(imageId).child(likeId).orderByChild('author').equalTo(userId)
        .once('value').then(snapshot => {
            if(snapshot.exists()){//checks if data exists
                let userId = snapshot.val();
                console.log('You have already liked it', userId)
                alert(userId);
                return userId;
            }
        })
    }

    /**
     * This function is used to Like a photo
     */
    postLike = (photoId) => {

        //checks if photoId is not empty
        if(photoId!= ''){
            var userId = f.auth().currentUser.uid;
            var likeId = uniqueId();
            
            //creates a like object
            var likeObj = {
                author: userId,
                imageId: photoId
            };

            //fetch likes in the database
            var ref = f.database().ref('likes');

            ref.once('value')
            .then(snapshot => {
                var userid = snapshot.child(photoId).child(userId).exists()//fist checks if users has liket the photo
                if(userid){//checks if user Id exists

                    //Fetch the users information
                    let ref = database.ref('/likes/'+'/'+photoId+'/'+userId);
                    //remove the like from database
                    ref.remove();

                    //decreases the amount of like to -1
                    f.database().ref('photos').child(photoId).child('likes').transaction((likes) => {
                        return (likes -1);
                    })
                    this.reloadPage();
                }else{//if users has not liked the photo yet 

                    //Creates a like object
                    database.ref('/likes/'+'/'+photoId+'/'+userId+'/'+likeId).set(likeObj);

                    //increase the number of likes to +1
                    f.database().ref('photos').child(photoId).child('likes').transaction((likes) => {
                        return (likes || 0) +1;
                    })
                    this.reloadPage();
                }
                console.log(userid);
            });


            
        }

    }

    /**
     * Fetch the photos published into the Firebase by getting the user id
     */
    loadFeed = (userId = '') => {
        this.setState({
            refresh:true,
            photo_feed: []
        });
        var that = this;

        //Start to get the photo reference
        var loadRef = database.ref('photos');
        if(userId != ''){//Check if user ID is not null
            //fetch data
            loadRef = database.ref('users').child(userId).child('photos');
        }
        loadRef.orderByChild('posted').once('value').then(function(snapshot) {

            const exists = (snapshot.val() !== null);
            if(exists){ data =snapshot.val();//check if the data exists
                var photo_feed = that.state.photo_feed;

                //Loop through the data, check for each element found and return it as photo
                for(var photo in data){
                    
                    that.setState({empty: false})
                    //if data is found, add to flat list
                    that.addToFlatList(photo_feed,data, photo);
                    
                }
            }else{
                that.setState({empty: true})
            }
        }).catch(error => console.log(error));
        
    }

    /**
     * Reload the page when a user like a photo
     */
    reloadPage = () => {
        this.setState({
            photo_feed: []
        });
        this.loadFeed(this.state.userId);

    }
    
    loadNew = () => {

        this.loadFeed();
        
    }

    render()
    {
        return(
            <View style={styles.container}>
                {/* Checks if page is loadin */}
                { this.state.loading == true ? (
                    <View style={styles.header}>
                        {this.state.empty == true ? (
                            <Text>You have no photos...</Text>
                        ) : (
                            <Text>Loading....</Text>
                        )}
                       
                    </View>
                ) : (
                <FlatList 
                    refreshing={this.state.refresh}
                    onRefresh={this.loadNew}
                    data={this.state.photo_feed}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.feed}
                    renderItem={({item, index}) => (
                    <View key={index}>
                        <View style={styles.listContainer}>
                            <View style={styles.feedItem}>
                                {this.state.loggedin === true ? (
                                    <TouchableOpacity
                                    onPress={ () => this.props.navigation.navigate('User', {userId: item.authorId})}>
                                        <Image source={{ url: item.photoURL}} style={styles.avatar}></Image>
                                        <Text style={styles.name}>{item.author}</Text>
                                        <Text style={styles.timestamp}>{timeConverter(item.posted)}</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View>
                                        <Image source={{ url: item.photoURL}} style={styles.avatar}></Image>
                                        <Text style={styles.name}>{item.author}</Text>
                                        <Text style={styles.timestamp}>{timeConverter(item.posted)}</Text>
                                    </View>
                                )}
                                
                                
                            </View>
                            <View>
                                <Text style={styles.post}>{item.caption}</Text>
                                <Image source={{url: item.url }}style={styles.postImage}/>
                                <TouchableOpacity
                                onPress={ () => this.props.navigation.navigate('Comments', {photoId: item.id})}>
                                    <View style={styles.likeContainer}>
                                    <View>
                                        <Likes onPress={() => this.postLike(item.id)} refresh={this.state.refreshLike}>

                                            {item.likes}
                                             
                                        </Likes>
                                    </View>
                                        <FontAwesome 
                                            name={'comments'}
                                            size={25}/>
                                        <Text style={{marginTop:15, textAlign:'center'}} >{item.comments}</Text>
                                    </View>

                                </TouchableOpacity>
                                
                            </View>
                        </View>
                    </View>

                    )}
                    /> 
                    )} 
            </View>
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EBECF4"
    },
    listContainer:{
        width:'100%',
        marginBottom: 5,
        marginTop: 5,
        shadowColor:'black',
        shadowOffset: {width:1, height:5},
        shadowRadius:5,
        shadowOpacity: 0.26,
        elevation: 5,
        backgroundColor:'white',
        borderRadius:10
    },
    header: {
        paddingTop: 64,
        paddingBottom: 16,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EBECF4",
        shadowColor: "#454D65",
        shadowOffset: { height: 5 },
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "500"
    },
    feed: {
        marginHorizontal: 10
    },
    feedItem: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        marginVertical: 8
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 16
    },
    name: {
        fontSize: 15,
        fontWeight: "500",
        color: "#454D65"
    },
    timestamp: {
        fontSize: 11,
        color: "#C4C6CE",
        marginTop: 4
    },
    post: {
        marginTop: 16,
        fontSize: 14,
        color: "#838899"
    },
    postImage: {
        width: undefined,
        height: 200,
        borderRadius: 5,
        marginVertical: 16
    },
    likeContainer:{
        flexDirection:'row', 
        alignContent:'center', 
        paddingLeft: 10
    }
});

export default PhotoList;