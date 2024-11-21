import { Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import Header from "../Components/Header";
import Colors from "../Components/Colors";

export default function HomeScreen(){

    return(
        <View style={{backgroundColor: Colors.background,flex: 1}}>
            <SafeAreaView style={styles.container}>
                <Header>Home</Header>
                <View style={styles.containerTest}>
                    <Text style={styles.text}>Home</Text>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight+3 : 0,
    },
    containerTest: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold'
    }
});