import React from 'react';
import { Text, StyleSheet, SafeAreaView, View, StatusBar } from 'react-native';
import ModalHeader from '../../Components/ModalHeader';
import Colors from '../../Components/Colors';

export default function HelpModal({ closeModal }) {
    return (
        <View style={{backgroundColor: Colors.background,flex: 1}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'white'}/>
            <SafeAreaView style={styles.modalContainer}>
                <ModalHeader closeModal={closeModal}>Help</ModalHeader>
                <View style={styles.rootContainer}>
                    <Text style={styles.modalText}>Help Modal</Text>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.background
    },
    rootContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});
