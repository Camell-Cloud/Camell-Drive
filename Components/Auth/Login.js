
import { View, Text, StyleSheet, TextInput,Pressable } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../Components/Colors';


export default function Login({ navigation, setIsAuthenticated }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    
    async function login(){
        const response = await fetch("http://13.124.248.7:3000/auth/login/privatekey", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ privateKey }),
        }).then(response => response.json() )
        console.log(response)
        if(response.username){ setIsAuthenticated(true) }
        else { 
          console.log(response)
          setErrorMessage("존재하지 않는 키 입니다")
        }
    }

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {privateKey === '' && (
                <Text style={styles.placeholder}>Login using private key</Text>
            )}
            <TextInput
                style={styles.input}
                value={privateKey}
                onChangeText={setPrivateKey}
                placeholderTextColor="transparent"
            />
            <Pressable style={styles.iconContainer} >
                <Icon name="content-paste" size={18} color="gray" />
            </Pressable>

            <Pressable
                style={styles.enter}
                onPress={() => { login() }}
            >
                <Text style={styles.enterText}>Login</Text>
            </Pressable>
            
            {errorMessage !== '' && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

        </View>
    );
}


const styles = StyleSheet.create({
    mainContainer: {
      paddingHorizontal: 10,
      paddingVertical: 30,
      backgroundColor: Colors.authBackground,
      flex: 1,
      paddingTop: 50,
    },
    Title: {
      color: Colors.primary400,
      fontSize: 28,
      textAlign: 'center',
      fontWeight: '700',
      marginBottom: 20,
    },
    logo: {
      width: 110,
      height: 110,
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
      fontSize: 14,
      color: 'gray',
      marginVertical: 10,
    },
    signin: {
      borderColor: Colors.primary400,
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 10,
      width: "100%",
      padding: 15,
      backgroundColor: Colors.authBackground,
    },
    signinText: {
      color: Colors.primary400,
      fontWeight: '600',
      fontSize: 16,
      textAlign: 'center',
    },
    enterText: {
      color: 'black',
      fontSize: 18,
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
      fontSize: 14,
      color: 'gray',
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 5,
    },
  });