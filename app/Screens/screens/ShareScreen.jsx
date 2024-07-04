import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../Utils/colors';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function ShareScreen({ navigation }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: Colors.background,
  },
  mainContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
  },


});