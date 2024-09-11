import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PinPage = ({ navigation }) => {
  const [username, setUsername] = useState(null);
  const [code, setCode] = useState([]);
  const [existingPin, setExistingPin] = useState(null); // State to store existing PIN from server
  const codeLength = Array(6).fill(0);
  const [isPinComplete, setIsPinComplete] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [firstPin, setFirstPin] = useState(null); 
  const [errorMessage, setErrorMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  // Fetch username and check if PIN exists on the server
  useEffect(() => {
    const fetchUsernameAndCheckPin = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);

          // Check if PIN exists in the server
          const response = await axios.post('http://13.124.248.7:1212/check-pin', {
            username: storedUsername,
          });
          
          if (response.data.exists) {
            setExistingPin(response.data.pin); // Store existing PIN
          }
        }
      } catch (error) {
        console.log('Error fetching username or checking PIN from the server', error);
      }
    };

    fetchUsernameAndCheckPin();
  }, []);

  useEffect(() => {
    if (code.length === 6) {
      if (existingPin) {
        // If an existing PIN is present, validate the entered PIN
        validateExistingPin();
      } else if (!isConfirming) {
        setFirstPin(code.join(''));
        setCode([]);
        setIsConfirming(true); 
        setIsChecking(true); 
      } else {
        setIsChecking(false);
        onConfirmPin();
      }
    }
  }, [code]);

  const validateExistingPin = () => {
    const enteredPin = code.join('');
    if (enteredPin === existingPin) {
      console.log('PIN verified, proceeding to next screen.');
      navigation.navigate('Drawer'); // Navigate if PIN matches
    } else {
      setErrorMessage('Incorrect PIN. Please try again.');
      resetPin();
    }
  };

  const onConfirmPin = () => {
    const enteredPin = code.join('');
  
    if (enteredPin === firstPin) {
      savePinToServer(enteredPin); // Save new PIN to the server
    } else {
      console.log('Incorrect PIN. Please try again.');
      setErrorMessage('Incorrect PIN. Please try again.');
      resetPin();
    }
  };

  const savePinToServer = async (pin) => {
    try {
      const response = await axios.post('http://13.124.248.7:1212/save-pin', {
        username: username,
        pin: pin,
      });
      if (response.data.success) {
        console.log('PIN saved successfully.');
        navigation.navigate('Drawer'); // Navigate on success
      } else {
        console.log('Failed to save PIN.');
        setErrorMessage('Failed to save PIN. Please try again.');
      }
    } catch (error) {
      console.log('Error saving PIN to the server.', error);
      setErrorMessage('An error occurred while saving the PIN. Please try again.');
    }
  };
  
  const resetPin = () => {
    setCode([]);
    setIsConfirming(false);
    setFirstPin(null);
  };

  const onNumberPress = (number) => {
    if (code.length === 0) {
      setErrorMessage('');
    }

    if (code.length < 6) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCode([...code, number]);
    }
  };

  const numberBackspace = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCode(code.slice(0, -1));
  };

  const onBiometricPress = () => {};

  return (
    <SafeAreaView>
      <Text style={styles.greeting}>
        {existingPin
          ? 'Enter your existing PIN'
          : isConfirming
          ? 'Please confirm your PIN'
          : 'Enter your PIN'}
      </Text>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <View style={styles.codeView}>
        {codeLength.map((_, index) => (
          <View
            key={index}
            style={[
              styles.codeEmpty,
              {
                backgroundColor: code[index] !== undefined ? '#E45E7E' : 'lightgray',
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.numbersView}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {[1, 2, 3].map((number) => (
          <TouchableOpacity key={number} style={styles.numberButton} onPress={() => onNumberPress(number)}>
            <Text style={styles.number}>{number}</Text>
          </TouchableOpacity>
        ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {[4, 5, 6].map((number) => (
          <TouchableOpacity key={number} style={styles.numberButton} onPress={() => onNumberPress(number)}>
            <Text style={styles.number}>{number}</Text>
          </TouchableOpacity>
        ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {[7, 8, 9].map((number) => (
          <TouchableOpacity key={number} style={styles.numberButton} onPress={() => onNumberPress(number)}>
            <Text style={styles.number}>{number}</Text>
          </TouchableOpacity>
        ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity onPress={onBiometricPress}>
            <MaterialCommunityIcons name="face-recognition" size={26} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.numberButton} onPress={() => onNumberPress(0)}>
            <Text style={styles.number}>0</Text>
          </TouchableOpacity>

          <View style={{ minWidth: 30 }}>
            {code.length > 0 && (
              <TouchableOpacity onPress={numberBackspace}>
                <MaterialCommunityIcons name="backspace-outline" size={26} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'center',
  },
  codeView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginVertical: 100,
  },
  codeEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  numbersView: {
    marginHorizontal: 50,
  },
  numberButton: {
    padding: 30,
  },
  number: {
    fontSize: 32,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    top: 90,
    alignSelf: 'center',
    position: 'absolute',
  },
});

export default PinPage;
