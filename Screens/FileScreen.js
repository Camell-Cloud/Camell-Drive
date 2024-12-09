import { FlatList, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import Header from "../Components/Header";
import Colors from "../Components/Colors";
import PlusMenu from "../Components/PlusMenu";
import { DATA } from "./testData";
import IconI from "react-native-vector-icons/Ionicons"
import IconE from "react-native-vector-icons/Entypo"
import { useState } from "react";
import { Pressable } from "react-native";
import MenuModal from "../Components/File/MenuModal";

export default function FileScreen(){
    const [modalVisible, setModalVisible] = useState(false);
    const data = DATA();

    function renderItems({item}){
        return(
            <View style={styles.itemContainer}>
                <View style={{flexDirection: 'row'}}>
                    <View>
                        <IconI name="document" size={30} color={Colors.primary400} style={styles.icon}/>
                    </View>

                    <View style={{marginLeft: 6,}}>
                        <Text style={{fontWeight: '500', fontSize: 16, marginBottom: 3}}>{item.name}</Text>
                        <Text style={{opacity: 0.8}}>{item.size} {item.addedDate}</Text>
                    </View>
                </View>

                <Pressable onPress={() => setModalVisible(true)} style={{padding: 3}}>
                    <IconE name="dots-three-horizontal" color="black" size={20} />
                </Pressable>
            </View>
        );
    }
    return(
        <View style={{backgroundColor: Colors.background,flex: 1}}>
            <SafeAreaView style={styles.container}>
                <Header>File</Header>
                <FlatList 
                    data={data}
                    renderItem={renderItems}
                    keyExtractor={item =>item.id}
                />
            </SafeAreaView>
            <PlusMenu pageType="file" />
            <MenuModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
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
    },
    itemContainer:{
        flexDirection: 'row',
        margin: 4,
        padding: 8,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    icon: {

    }
});