import React from 'react';
import { Text, StyleSheet, SafeAreaView, View ,StatusBar} from 'react-native';
import ModalHeader from '../../Components/ModalHeader';
import Colors from '../../Components/Colors';

export default function ChartModal({ closeModal }) {
    return (

        <View style={{backgroundColor: Colors.background,flex: 1}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'white'}/>
            <SafeAreaView style={styles.modalContainer}>
                <ModalHeader closeModal={closeModal}>Wallet</ModalHeader>
                <View style={styles.rootContainer}>
                    <Text style={styles.modalText}>Chart Modal</Text>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
    },
    rootContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background
    },
    modalText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});
