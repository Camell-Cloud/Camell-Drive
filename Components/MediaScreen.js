import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import Header from "../Components/Header";
import Colors from "../Components/Colors";
import PlusMenu from "../Components/PlusMenu";

export default function MediaScreen(){
    return(
        <View style={{backgroundColor: Colors.background,flex: 1}}>
            <SafeAreaView style={styles.container}>
                <Header>Media</Header>
                <View style={styles.containerTest}>
                    <Text style={styles.text}>Media</Text>
                </View>
            </SafeAreaView>
            <PlusMenu />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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