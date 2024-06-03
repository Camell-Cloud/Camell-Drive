import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/color';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import SubTabScreenHeader from '../main/SubTabScreenHeader';
import { TextInput } from 'react-native-gesture-handler';


export default function DepositScreen({ navigation }) {
    const [text, setText] = useState('');

    const onChangeText = (InputText) => {
        setText(InputText);
    }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
      <SubTabScreenHeader title="입금" navigation={navigation} />

        <View style={styles.mainContainer}>
            <View style={styles.addressContainer}>
                <TextInput 
                onChangeText={onChangeText}
                value={text}
                placeholder='지갑주소 입력'
                style={styles.walletAddressSearch}
                />
            </View>
            
            <View style={styles.camellNum}>
                <TextInput 
                    onChangeText={onChangeText}
                    value={text}
                    placeholder='보낼 개수'
                    style={styles.walletAddressSearch}
                />
            </View>

            <View style={styles.camellBtn}>
                
            </View>
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
    alignContent: 'center',
    flex: 1,
  },

  walletAddressSearch: {
    backgroundColor: 'gray',
    height: 35,
    marginHorizontal: 20,
    borderRadius: 30,
    padding: 10,
  },
  addressContainer: {
    justifyContent: 'center',
    flex:1,
    backgroundColor : 'yellow'
  },

  camellNum: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'red'
  },
  camellBtn: {
    flex: 4,
    backgroundColor: 'green'
  }
});