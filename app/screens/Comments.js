import React from 'react';
import {TouchableOpacity, KeyboardAvoidingView, FlatList, StyleSheet, Text, View, } from 'react-native';
import {f, database} from '../../config/config.js'
import UserAuth from '../components/Auth.js'
import timeConverter from '../components/TimerConverter';
import {uniqueId} from '../helpers/Helpers';
import Button from '../components/Button';
import Input from '../components/Input';
import Headers from '../components/Headers';
import Colors from '../components/constants/colors';

class Comments extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            loggedin: false,
            comments_list: [],
            commentCount:0
        }
    }

    /**
     * Check the parameters, to check what data is going to be parsed to the comment screen
     *  */ 
    checkParams = () => {

        //checkes for the navigation props screen
        var params = this.props.navigation.state.params;
        if(params){//checks if parameters exists
            if(params.photoId){//checks if the photoId exists
                this.setState({
                    photoId: params.photoId
                });
                this.fectchComments(params.photoId);
            }
        }
    }

    /**
     * Add comments to the FlatList
     */
    addComments = (comments_list, data, comment) => {

        var that = this;
        var commentObj = data[comment];
        
        //Fetch users from database
        database.ref('users').child(commentObj.author).child('username').once('value').then(function(snapshot){

            
            const exists = (snapshot.val() !== null);
            if(exists) data = snapshot.val();//check if user exists
            
            comments_list.push({//push comments existent to the FlatList
                id: comment,
                comment: commentObj.comment,
                posted: commentObj.posted,
                author: data,
                authorId: commentObj.author
            });
            that.setState({
                refresh: false,
                loading: false
            });
            
            

        }).catch(error => console.log(error));

    }

    /**
     * Fetch Comments from databse 
     */
    fectchComments = (photoId) => {
        var that = this;
        //Fetch comments by its referenc and photoId
        database.ref('comments').child(photoId).orderByChild('posted').once('value').then(function(snapshot){

            const exists = (snapshot.val() !== null);
            if(exists){//check if comments exists
                //add comments to list
                data = snapshot.val();
                var comments_list = that.state.comments_list;

                for(var comment in data){//Loop trough the comments data and replace it with the variabels
                    that.addComments(comments_list, data, comment);
                    
                }
            }else{
                //the are no comments
                that.setState({
                    comments_list: []
                });
            }

        }).catch(error => console.log(error));
     }

     /**
      * Checks whether the user is logged in or not
      */
    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function(user){//Checks for users current state
            if(user){//checks is users exists
                //Logged in 
                that.setState({
                    loggedin: true
                });
            }else{
                //logged out
                that.setState({
                    loggedin: false
                });
            }
        });

        this.checkParams();
    }

    /**
     * Function used to post comment to database
     */
    postComment = () => {
        //post comment according to userId

        var comment = this.state.comment;
        if(comment != ''){//checks is comment is empty
            //process the comment
            var imageId = this.state.photoId;
            var userId = f.auth().currentUser.uid;
            var commentId = uniqueId();
            var dateTime = Date.now();
            var timeStamp = Math.floor(dateTime / 1000);

            this.setState({
                comment: ''
            });

            //creates comment object
            var commentObj = {
                posted: timeStamp,
                author: userId,
                comment: comment,
                photoId: imageId
            }
            
            //add comment to the database
            database.ref('/comments/'+imageId+'/'+commentId).set(commentObj);

            //Fetch photos and increase the amount of comments to +1
            f.database().ref('photos').child(imageId).child('comments').transaction((comments) => {
                return (comments || 0) +1;
            })

            //reload the comment
            this.reloadComment();
        }else{
            alert('Please enter a comment before posting...')
        }
    }

    /**
     * Reload the page eveery time after user posts a comment
     */
    reloadComment = () => {
        this.setState({
            comments_list: []
        });
        this.fectchComments(this.state.photoId)
    }

    render()
    {
        return(
            <View style={{flex: 1}}>
                <Headers onPress={()=> this.props.navigation.goBack()} back='back' >
                    <View style={{flex:1, justifyContent:'center'}}>
                        <Text style={styles.title}>Comments</Text>
                    </View>
                </Headers>

                {/* Checks whethere there are comment or not */}
                {this.state.comments_list.length == 0 ? (
                    //is the lengh is 0, no comments tho be shown
                    <Text>No comments found...</Text>
                ) : (

                    <FlatList
                        resfreshing={this.state.refresh}
                        data={this.state.comments_list}
                        keyExtractor={(item, index) => index.toString()}
                        style={{flex:1, backgroundColor: '#eee'}}
                        renderItem={({item, index}) => (
                            <View key={index} style={styles.commentContainer}>
                                <View style={styles.userProfile}>
                                    <Text style={styles.timestamp}>{timeConverter(item.posted)}</Text>
                                    <TouchableOpacity
                                        onPress={ () => this.props.navigation.navigate('User', {userId: item.authorId})}>
                                        <Text style={styles.postComment}>{item.author}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.commentView}>
                                    <Text style={styles.postComment}>{item.comment}</Text>
                                </View>
                            </View>
                        )}
                    />
                )}
                {/* Checks if the loading is true */}
                { this.state.loggedin == true ? (
                    //logged in
                    
                    <KeyboardAvoidingView behavior="padding" enabled style={styles.postContainer}>
                        <Text style={styles.postComment}>Post Comment</Text>
                        <View>
                        <Input
                            editable={true}
                            placeholder={'Please Enter Your Comment...'}
                            maxLenght={50}
                            autoCorrect={true}
                            multiline={false}
                            numberOfLines={1}
                            onChangeText={text => this.setState({comment:text})}
                            value={this.state.comment}
                            style={styles.inputText}/>
                        </View>
                        <Button message={'Post Comment'} onPress={() => this.postComment()}/>
                    </KeyboardAvoidingView>
                    
                    
                ) : (

                    //logged out
                    <UserAuth message={'Please login to post a comment'} moveScreen={true} navigation={this.props.navigation}/>

                )}
                

            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputText:{
        width: '90%',
        height:40, 
        alignSelf:'center'
    },
    postComment:{
        fontSize: 15,
        fontWeight: "500",
        color: "#454D65"
    },
    postContainer:{
        borderTopColor: 'grey', 
        borderTopWidth: 1, 
        padding: 10, 
        marginBottom: 15
    },
    title:{
        textAlign:'center', 
        fontWeight:'bold', 
        color: Colors.firstText, 
        fontSize:18, 
        paddingRight:'10%'
    },
    commentContainer:{
        width: '100%', 
        overflow: 'hidden', 
        marginBottom: 5, 
        justifyContent: 'space-between',
        borderBottomWidth: 1, 
        borderColor: 'grey'
    },
    userProfile:{
        padding: 5, 
        width: '100%', 
        flexDirection:'row', 
        justifyContent: 'space-between'
    },
    timestamp: {
        fontSize: 11,
        color: "#454D65",
        marginTop: 4
    },
    commentView:{
        backgroundColor:'#C4C6CE',
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        borderColor: 'grey', 
        borderRadius: 20,
        marginTop:10,
        alignSelf:'flex-start'
    }
})

export default Comments;