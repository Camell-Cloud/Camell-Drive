import { Pressable, StyleSheet, Text, View } from "react-native";
import IconI from "react-native-vector-icons/Ionicons"
import Colors from "./Colors";

export default function ModalHeader({ children, closeModal }) {
    return (
        <View style={styles.container}>
            <Pressable onPress={closeModal}>
                <IconI name="chevron-back-outline" size={35} color='black'/>
            </Pressable>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>{children}</Text>
            <Pressable>
                <IconI name="person-circle-outline" size={35} color='black'/>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        justifyContent: 'space-between',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: Colors.background
    },
});
