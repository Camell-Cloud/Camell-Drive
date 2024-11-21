import { Pressable, SafeAreaView, StyleSheet, Text,View} from "react-native";
import { useNavigation } from '@react-navigation/native';
import IconI from 'react-native-vector-icons/Ionicons'
import Colors from "./Colors";

export default function Header({children}){
    const navigation = useNavigation();

    return(
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Pressable onPress={() => navigation.openDrawer()}>
                        <IconI name="menu-sharp" size={35} color='black'/>
                    </Pressable>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{children}</Text>
                    <Pressable>
                        <IconI name="person-circle-outline" size={35} color='black'/>
                    </Pressable>
                </View>
            </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    
    container: {
        justifyContent: 'space-between',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',   
        paddingHorizontal: 10,
        height: 50,
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: Colors.background
    }
});