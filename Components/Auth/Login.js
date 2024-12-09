
import { View, Text, StyleSheet, TextInput,Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../Components/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Login({ navigation, setIsAuthenticated }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    
    async function login() {
      try {
          const response = await fetch("http://13.124.248.7:3000/auth/login/privatekey", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ privateKey }),
          });
  
          const data = await response.json(); // JSON 응답을 처리
          console.log(data);
  
          if (data.username) { 
              await AsyncStorage.setItem('username', data.username); // response.username 사용
              setIsAuthenticated(true);
          } else { 
              console.log(data);
              setErrorMessage("존재하지 않는 키 입니다");
          }
      } catch (error) {
          console.error("Login failed:", error);
          setErrorMessage("로그인 중 오류가 발생했습니다."); // 에러 메시지 설정
      }
  }

  return (
    <View style={{ alignItems: 'center',  width: '100%' }}>
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

        <View>
          <Pressable
              style={styles.enter}
              onPress={() => { login() }}
          >
              <Text style={styles.enterText}>Login</Text>
          </Pressable>
        </View>

        
        {errorMessage !== '' && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}

    </View>
);
}

const styles = StyleSheet.create({
  input: {
    fontSize: 12,
    width: '100%',
    height: 40,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 10,
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