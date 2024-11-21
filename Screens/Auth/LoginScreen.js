
import { View, Text, StyleSheet, TextInput,Pressable, Image, SafeAreaView, Platform } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../Components/Colors';


export default function Login({ navigation, setIsAuthenticated }) {
    const [userName, setUserName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [privateKeyModalvisible, setPrivateKeyModalVisible] = useState(false);
    

  return (
      <Pressable
      style={styles.enter}
      onPress={() => {
        setIsAuthenticated(true);
      }}
    >
      <Text style={styles.enterText}>Login</Text>
    </Pressable>
  );
}