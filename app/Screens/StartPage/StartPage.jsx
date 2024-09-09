import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Clipboard } from 'react-native';  
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function StartPage({ navigation }) {
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      console.log("Status", isLoggedIn)
      if (isLoggedIn === 'true') {
        navigation.navigate('Drawer');
      }
    };

    checkLoginStatus();
  }, []);

  const pasteFromClipboard = async () => {
    const clipboardContent = await Clipboard.getString();
    setText(clipboardContent);
  };

  const checkPrivateKey = async () => {
    try {
      const response = await fetch('http://13.124.248.7:1212/check-private-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          private_key: text,
        }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        await AsyncStorage.setItem('privateKey', text);  
        await AsyncStorage.setItem('username', result.username);
        await AsyncStorage.setItem('isLoggedIn', 'true');
        navigation.navigate('Drawer');
      } else {
        setErrorMessage('Invalid private key');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Server request failed');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.top}>
        <Image
          source={require('../../../assets/images/camell_logo.png')}
          style={styles.logo}
        />

        <Text style={styles.Title}>Welcome to Camell Drive</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.login}>
          <TouchableOpacity
            style={styles.signin}
            onPress={() => navigation.navigate('Sigin')}
          >
            <Text style={styles.signinText}>Create private key</Text>
          </TouchableOpacity>

          <View style={{ width: '100%' }}>
            <Text style={styles.loginText}>Already registered?</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {text === '' && (
              <Text style={styles.placeholder}>Login using private key</Text>
            )}
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholderTextColor="transparent"
            />
            <TouchableOpacity style={styles.iconContainer} onPress={pasteFromClipboard}>
              <Icon name="content-paste" size={18} color="gray" />
            </TouchableOpacity>
          </View>
          
          {errorMessage !== '' && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          <TouchableOpacity style={styles.enter} onPress={checkPrivateKey}>
            <Text style={styles.enterText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
    backgroundColor: '#f4ecf0',
    flex: 1,
  },
  Title: {
    color: '#E45E7E',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    margin: 20,
  },
  top: {
    alignItems: 'center',
    flex: 0.7,
    justifyContent: 'center',
  },
  bottom: {
    flex: 1.5,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  login: {
    width: '80%',
    alignItems: 'center',
    margin: 10,
  },
  input: {
    fontSize: 12,
    width: '100%',
    height: 40,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  loginText: {
    fontSize: 12,
    color: 'gray',
    marginVertical: 10,
  },
  signin: {
    borderColor: '#E45E7E',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    padding: 10,
    backgroundColor: '#f1e5e9',
  },
  signinText: {
    color: '#E45E7E',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  enterText: {
    color: 'black',
    margin: 10,
    padding: 10,
  },
  iconContainer: {
    position: 'absolute',
    right: 0,
    padding: 10,
  },
  placeholder: {
    position: 'absolute',
    left: 10,
    top: 10,
    fontSize: 12,
    color: 'gray',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});
