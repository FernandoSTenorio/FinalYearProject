import React from 'react';
import {TouchableOpacity, TextInput, KeyboardAvoidingView, FlatList, StyleSheet, Text, View, Image} from 'react-native';
import {f, auth, database, storage} from '../../config/config.js'
import UserAuth from '../components/Auth.js'
import timeConverter from '../components/TimerConverter';

class Comments extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            loggedin: false,
            comments_list: [],
            commentCount:0
        }
    }

    //
    checkParams = () => {

        var params = this.props.navigation.state.params;
        if(params){
            if(params.photoId){
                this.setState({
                    photoId: params.photoId
                });
                this.fectchComments(params.photoId);
            }
        }
    }
    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16).substring(1)
    }

    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() +'-' +
        this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4();
    }
    
    addComments = (comments_list, data, comment) => {

        var that = this;
        var commentObj = data[comment];

        database.ref('users').child(commentObj.author).child('username').once('value').then(function(snapshot){

            
            const exists = (snapshot.val() !== null);
            if(exists) data = snapshot.val();
            
            comments_list.push({
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

    fectchComments = (photoId) => {
        var that = this;
        database.ref('comments').child(photoId).orderByChild('posted').once('value').then(function(snapshot){

            const exists = (snapshot.val() !== null);
            if(exists){
                //add comments to list
                data = snapshot.val();
                var comments_list = that.state.comments_list;

                for(var comment in data){
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

    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function(user){
            if(user){
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

    postComment = () => {
        //post comment according to userId

        var comment = this.state.comment;
        if(comment != ''){
            //process the comment
            var imageId = this.state.photoId;
            var userId = f.auth().currentUser.uid;
            var commentId = this.uniqueId();
            var dateTime = Date.now();
            var timeStamp = Math.floor(dateTime / 1000);

            this.setState({
                comment: ''
            });

            var commentObj = {
                posted: timeStamp,
                author: userId,
                comment: comment,
                photoId: imageId
            }

            // database.ref('/photos/'+imageId + '/comments/' + commentId).set(commentObj);

            database.ref('/comments/'+imageId+'/'+commentId).set(commentObj);

            // const increment = f.firestore.FieldValue.increment(1);
            // const stoyryRef = f.firestore().collection('comments').doc(`${Math.random()}`);
            // const statsRef = f.firestore().collection('comments').doc(imageId);
            // const batch = f.firestore().batch();
            // batch.set(stoyryRef, {title: comment});
            // batch.set(statsRef, {comments: increment} , {merge:true});
            // batch.commit();

            f.database().ref('photos').child(imageId).child('comments').transaction((comments) => {
                return (comments || 0) +1;
            })

            //reload the comment
            this.reloadComment();
        }else{
            alert('Please enter a comment before posting...')
        }
    }

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
            <View style={{flexDirection:'row', height: 70, paddingTop: 30, backgroundColor: 'white', borderColor: 'lightgrey', borderBottomWidh: 1.0, justifyContent: 'center', justifyContent: 'space-between',alignItems: 'center'}}>
                <TouchableOpacity
                style={{width:100}} 
                onPress={() => this.props.navigation.goBack()}>
                    <Text style={{fontSize: 12, fontWeight: 'bold', paddingLeft: 10}}>Back</Text>
                </TouchableOpacity>
                <Text>Comments</Text>
                <Text style={{width:100}}></Text>
            </View>

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
                            <View key={index} style={{width: '100%', overflow: 'hidden', marginBottom: 5, justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'grey'}}>
                                <View style={{padding: 5, width: '100%', flexDirection:'row', justifyContent: 'space-between'}}>
                                    <Text>{timeConverter(item.posted)}</Text>
                                    <TouchableOpacity
                                        onPress={ () => this.props.navigation.navigate('User', {userId: item.authorId})}>
                                        <Text>{item.author}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{padding: 5}}>
                                    <Text>{item.comment}</Text>
                                </View>
                            </View>
                        )}

                    />

                )}
                { this.state.loggedin == true ? (
                    //logged in
                    <KeyboardAvoidingView behavior="padding" enabled style={{borderTopColor: 'grey', borderTopWidth: 1, padding: 10, marginBottom: 15}}>
                        <Text style={{fontWeight: 'bold'}}>Post Comment</Text>
                        <View>
                            <TextInput editable={true}
                            placeholder={'enter your comment...'}
                            onChangeText={(text) => this.setState({comment: text})}
                            value={this.state.comment}
                            style={{marginVertical: 10, height: 50, padding: 5, borderColor: 'grey', borderRadius: 3, backgroundColor: 'white', padding: 10, marginBottom: 15}}>

                            </TextInput>
                        </View>
                        <TouchableOpacity
                            style={{paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'blue', borderRadius: 5}}
                            onPress={() => this.postComment()}>
                            <Text style={{color:'white'}}>Post</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                    
                    
                ) : (

                    //logged out
                    <UserAuth message={'Please login to post a comment'} moveScreen={true} navigation={this.props.navigation}/>

                )}
                

            </View>
        );
    }
}

export default Comments;