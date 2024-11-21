import React from 'react';
import { Text, StyleSheet, SafeAreaView, View, StatusBar } from 'react-native';
import ModalHeader from '../../Components/ModalHeader';
import Colors from '../../Components/Colors';

export default function PlanModal({ closeModal }) {
    return (
        <View style={{backgroundColor: Colors.background,flex: 1}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'white'}/>
            <SafeAreaView style={styles.modalContainer}>
                <ModalHeader closeModal={closeModal}>Plan</ModalHeader>
                <View style={styles.rootContainer}>
                    <Text style={styles.modalText}>Plan Modal</Text>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
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
