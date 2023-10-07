import React, { Component } from 'react';
import { Text, View, Alert, ImageBackground, StyleSheet, SafeAreaView, Platform, StatusBar, FlatList, Image, Dimensions } from 'react-native';
import axios from "axios"
export default class MeteorScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            meteors: {}
        }

    }

    componentDidMount() { this.getMeteors() }


    getMeteors = () => {
        axios
            .get("https://api.nasa.gov/neo/rest/v1/feed?api_key=f4j48cOBtbHUjoGajeKrFWtkiFlxraugDbKmuwth")
            .then(response => {
                this.setState({ meteors: response.data.near_earth_objects })
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }
    renderItem = ({ item }) => {
        let meteor = item
        let bg_Img, speed, size
        if (meteor.threat_score <= 30) {
            bg_Img = require("../assets/meteor_bg1.png")
            speed = require("../assets/meteor_speed3.gif")
            size = 100


        }
        else if (meteor.threat_score <= 75) {
            bg_Img = require("../assets/meteor_bg2.png")
            speed = require("../assets/meteor_speed3.gif")
            size = 150


        }

        else {
            bg_Img = require("../assets/meteor_bg3.png")
            speed = require("../assets/meteor_speed3.gif")
            size = 200


        }
        return (<View>
            <ImageBackground source={bg_img} style={styles.backgroundImage}>
                <View style={styles.gifContainer}>
                    <Image source={speed} style={{ width: size, height: size, alignSelf: "center" }}>


                    </Image>
                    <View>
                        <Text style={[styles.cardTitle, { marginTop: 400, marginLeft: 50 }]}>{item.name}

                        </Text>
                        <Text style={[styles.cardText, { marginTop: 20, marginLeft: 50 }]}>Closest to Earth - {item.close_approach_data[0].close_approach_date_full}</Text>
                        <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>Minimum Diameter (KM) - {item.estimated_diameter.kilometers.estimated_diameter_min}</Text>
                        <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>Maximum Diameter (KM) - {item.estimated_diameter.kilometers.estimated_diameter_max}</Text>
                        <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>Velocity (KM/H) - {item.close_approach_data[0].relative_velocity.kilometers_per_hour}</Text>
                        <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>Missing Earth by (KM) - {item.close_approach_data[0].miss_distance.kilometers}</Text>





                    </View>
                </View>
            </ImageBackground>



        </View>)


    }





    keyExtractor = (item, index) => { index.toString() }
    render() {

        if (Object.keys(this.state.meteors).length === 0) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Text>Loading...</Text>
                </View>
            )
        }

        else {
            let Meteor_aray = Object.keys(this.state.meteors).map(md => { return this.state.meteors[md] })
            let M = [].concat.apply([], Meteor_aray)
            M.forEach(element => {
                let diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + element.estimated_diameter.kilometers.estimated_diameter_max) / 2
                let threatScore = (diameter / element.close_approach_data[0].miss_distance.kilometers) * 1000000000
                element.threat_score = threatScore;
                M.sort(function (a, b) { return b.threat_score - a.threat_score })
                M = M.slice(0, 5)
                return (<View style={styles.container}>
                    <SafeAreaView style={styles.droidSafeArea} />
                    <Flatlist keyExtractor={this.keyExtractor}
                        data={M}
                        renderItem={this.renderItem}
                        horizontal={true}
                    />

                </View>)



            });

        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    titleContainer: {
        flex: 0.1,
        justifyContent: "center",
        alignItems: "center"
    },
    titleText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white"
    },
    mapContainer: {
        flex: 0.7
    },
    map: {
        width: "100%",
        height: "100%"
    },


    infoContainer: {
        flex: 0.2,
        backgroundColor: 'white',
        marginTop: -10,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30
    },

    infoText: {
        fontSize: 15,
        color: "black",
        fontWeight: "bold"
    },
    gifContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    meteorDataContainer: {
        justifyContent: "center",
        alignItems: "center",
    }



})
