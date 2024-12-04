  import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Clipboard } from 'react-native';  
import Colors from '../../Components/Colors';
import Login from '../../Components/Auth/Login';

export default function StartScreen({ navigation, setIsAuthenticated }) {
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const pasteFromClipboard = async () => {
    const clipboardContent = await Clipboard.getString();
    setText(clipboardContent);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.top}>
        <Image
          source={require('../../assets/images/camell_logo.png')}
          style={styles.logo}
        />

        <Text style={styles.Title}>Welcome to Camell Drive</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.login}>

          
          <Pressable
            style={styles.signin}
            onPress={() => navigation.navigate('Signup', { setIsAuthenticated })}
          >
            <Text style={styles.signinText}>Create private key</Text>
          </Pressable>


          <View style={{ width: '100%' }}>
            <Text style={styles.loginText}>Already registered?</Text>
          </View>


          {/* 로그인 */}
          <Login setIsAuthenticated={setIsAuthenticated} />


        </View>
      </View>
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
