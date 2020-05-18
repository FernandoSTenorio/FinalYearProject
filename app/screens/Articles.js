import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import Button from '../components/Button';
import Headers from '../components/Headers';
import Colors from '../components/constants/colors';

class Articles extends React.Component {

    constructor(props){
        super(props);
        this.state={
            selectedArticle:0
        }
    }

    render() {
        return(
            <View style={{flex:1}} >
                <Headers onPress={()=> this.props.navigation.goBack()} back='back' >
                    <View style={{flex:1, justifyContent:'center'}}>
                        <Text style={styles.title}>Articles</Text>
                    </View>
                 </Headers>
                 {/* If the condition is equal to 0 displays List of buttons */}
                {this.state.selectedArticle === 0 ? (
                    <View>
                    <Text style={styles.articleTitle}>Learn more about Volunteering</Text>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} message={'Care of the Elderly'} onPress={()=> this.setState({selectedArticle:1})}/>
                        <Button style={styles.button} message={'Storyteller'} onPress={()=> this.setState({selectedArticle:2})}/>
                        <Button style={styles.button} message={'Combating violence against women'} onPress={()=> this.setState({selectedArticle:3})}/>
                        <Button style={styles.button} message={'Environment Protection'} onPress={()=> this.setState({selectedArticle:4})}/>
                        <Button style={styles.button} message={'Chemical Dependent People'} onPress={()=> this.setState({selectedArticle:5})}/>
                        <Button style={styles.button} message={'Aid to the homeless'} onPress={()=> this.setState({selectedArticle:6})}/>
                        <Button style={styles.button} message={'VolunteeringinIreland'} onPress={()=> this.setState({selectedArticle:7})}/>
                    </View>
                </View>
                    ): (
                        <View></View>
                    )}
                
                {/* If condition is equal to 1, display the elderyl care article */}
                {this.state.selectedArticle === 1 ? (
                    <ScrollView contentContainerStyle={styles.textContainer}>
                        <Text style={styles.articleTitle}>Care of the Elderly</Text>
                        <Text style={styles.text}>Helping elderly can involve several aspects, from simpler tasks, such as accompanying them on walks in city square and parks, to helping with personal hygiene and the organisations such as Nursing Homes and Home Cares. Sometimes it can also involve, simple conversation with the elderly in nursing home and helping these people to fill a life with joy.</Text>
                        <Button  style={styles.backButton} onPress={() => this.setState({selectedArticle:0})} message={'Back to List of Articles'}></Button>
                    </ScrollView>
                ) : (
                    <View></View>
                )}
                {/* If condition is equal to 2, display the storyteller article */}
                {this.state.selectedArticle === 2 ? (
                    <ScrollView contentContainerStyle={styles.textContainer}>
                        <Text style={styles.articleTitle}>Storyteller</Text>
                        <Text style={styles.text}>In addition to the elderly, several other people in difficulty, in hospitals and orphanages, for example, may want to have volunteers to come over to tell story to them. Several projects work by recruiting volunteers for storytelling. These people can take books or, if even create their own “story”.</Text>
                        <Button  style={styles.backButton} onPress={() => this.setState({selectedArticle:0})} message={'Back to List of Articles'}></Button>
                    </ScrollView>
                ) : (
                    <View>
                    </View>
                )}
                {/* If condition is equal to 3, display the women article */}
                {this.state.selectedArticle === 3 ? (
                    <ScrollView contentContainerStyle={styles.textContainer}>
                        <Text style={styles.articleTitle}>Combating violence against women</Text>
                        <Text style={styles.text}>In relation to gender issues, many groups and institutions have been working to help women victims of violence – mostly physical, and committed to the domestic environment.
The activities involve communication work (showing society that domestic violence exists and cannot be tolerated), sensitizing the victims to seek psychological and health support, and welcoming these women.</Text>
                        <Button  style={styles.backButton} onPress={() => this.setState({selectedArticle:0})} message={'Back to List of Articles'}></Button>
                    </ScrollView>
                ) : (
                    <View>
                    </View>
                )}
                {/* If condition is equal to 4, display the environment article */}
                {this.state.selectedArticle === 4 ? (
                    <ScrollView scontentContainerStyle={styles.textContainer}>
                        <Text style={styles.articleTitle}>Environment Protection</Text>
                        <Text style={styles.text}>For many, the environment issue, is perhaps the most significant banner to gain space in the world public debate in the last hundred years, since it involves the continuity of the life of the planet and of the human beings that inhabit it - THAT IS FOR ALL OF US. 
                        These jobs and project involve everything from the adequate collection of solid waste in cities, to the selective collection or separation of recyclable waste by paper collectors, through care in the maintenance of green areas, and recovery of forests.</Text>
                        <Button  style={styles.backButton} onPress={() => this.setState({selectedArticle:0})} message={'Back to List of Articles'}></Button>
                    </ScrollView>
                ) : (
                    <View>
                    </View>
                )}
                {/* If condition is equal to 5, display the chemical dependent people article */}
                {this.state.selectedArticle === 5 ? (
                    <ScrollView contentContainerStyle={styles.textContainer}>
                        <Text style={styles.articleTitle}>Chemical Dependent People</Text>
                        <Text style={styles.text}>Another social problem that affects all social classes is chemical dependency. Support for recovery requires strict technical monitoring, but treatment spaces often need people to work in reception areas, collect food and clothes for treatment of dependents.</Text>
                        <Button  style={styles.backButton} onPress={() => this.setState({selectedArticle:0})} message={'Back to List of Articles'}></Button>
                    </ScrollView>
                ) : (
                    <View>
                    </View>
                )}
                {/* If condition is equal to 6, display the homeless article */}
                {this.state.selectedArticle === 6 ? (
                    <ScrollView contentContainerStyle={styles.textContainer}>
                        <Text style={styles.articleTitle}>Aid to the homeless</Text>
                        <Text style={styles.text}>Homeless people are among the most vulnerable group of the population, after all, they do not have a roof or protection and they often end up living on street due to families problems, chemical dependence or alcohol consumption. 
                        Many simply have had no opportunities in life or are victims of psychiatric disorders.</Text>
                        <Button  style={styles.backButton} onPress={() => this.setState({selectedArticle:0})} message={'Back to List of Articles'}></Button>
                    </ScrollView>
                ) : (
                    <View>
                    </View>
                )}  
                {/* If condition is equal to 7, display the volunteer article */}
                {this.state.selectedArticle === 7 ? (
                    <ScrollView contentContainerStyle={styles.textContainer}>
                        <Text style={styles.articleTitle}>Volunteering in Ireland</Text>
                        <Text style={styles.text}>In Ireland, there are many options for volunteer work. The most common are jobs in thrift stores, which allocate their income to some cause or institution. These places are known as charity shops.
                        It is worth remembering that in addition to contributing to local society, volunteer work can also serve as a professional experience in the country in the future, counting points for possible real work opportunities in the country.
                        </Text>
                        <Button  style={styles.backButton} onPress={() => this.setState({selectedArticle:0})} message={'Back to List of Articles'}></Button>
                    </ScrollView>
                ) : (
                    <View>
                    </View>
                )}  
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex:{
        flex:1,
        justifyContent: 'center'
    },
    button:{
        width:'80%',
        height: 50,
        alignSelf:'center',
        textAlign:'center',
    },
    backButton:{
        width:'80%',
        alignSelf:'center',
        textAlign:'center',
        
    },
    buttonContainer:{
        marginTop:50
    },
    title:{
        textAlign:'center', 
        fontWeight:'bold', 
        color: Colors.firstText, 
        fontSize:18, 
        paddingRight:'10%'
    },
    textContainer:{
        alignSelf:'center',
        justifyContent:'center',
        width:'90%',
        alignItems:'center'
    },
    articleTitle:{
        alignSelf:'center',
        fontSize: 40,
        fontWeight: "500",
        color: "#454D65",
        textAlign:'center',
        marginTop: '15%',
    },
    text:{
        alignSelf:'center',
        fontSize: 20,
        fontWeight: "500",
        color: "#454D65",
        textAlign:'center',
        marginTop: '10%',
        lineHeight:35
    }
})

export default Articles;