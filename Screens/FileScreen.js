import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import Header from "../Components/Header";
import Colors from "../Components/Colors";
import PlusMenu from "../Components/PlusMenu";

export default function FileScreen(){
    return(
        <View style={{backgroundColor: Colors.background,flex: 1}}>
            <SafeAreaView style={styles.container}>
                <Header>File</Header>
                <View style={styles.containerTest}>
                    <Text style={styles.text}>File</Text>
                    <PlusMenu pageType="file" />
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