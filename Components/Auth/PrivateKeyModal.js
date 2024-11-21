
import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Clipboard } from 'react-native';
import Colors from '../Colors';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as Updates from 'expo-updates';


export default function PrivateKeyModal({ 
    PrivateKeyModalVisible, 
    setPrivateKeyVisible,
    userName, 
    navigation, 
    setIsAuthenticated 
}) {

  // 프라이빗
  const privateKey = uuidv4();
  
  async function signup(){
    
    const response = await fetch("http://13.124.248.7:3000/auth/signup/", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ userName, privateKey }),
    })
    if(response.ok){ setIsAuthenticated(true) }
    else { await Updates.reloadAsync(); } // 재시작
  }

  const copyToClipboard = () => {
    Clipboard.setString(privateKey);
    alert('Private key copied to clipboard!');
  };
  
  return (
    <Modal
      transparent={true}
      visible={PrivateKeyModalVisible}
      onRequestClose={() => setPrivateKeyVisible(false)}
    >

      <View style={styles.modalBackground}>
        <View style={styles.modalView}>

            <View style={styles.top}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Private Key</Text>

                    <View style={styles.privateContainer}>
                        <View style={styles.privateTextContainer}>
                          <Text style={styles.privateText}>{privateKey}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                  <Pressable style={styles.iconContainer} onPress={copyToClipboard}>
                    <Icon name="content-copy" size={18} color="gray" style={styles.icon} />
                  </Pressable>
                  <View style={styles.warningTextContainer}>
                    <View style={{ width: '100%', alignItems: 'center',justifyContent: 'center'}}>

                        <Icon name="warning" size={24} color="gray" style={styles.warningIcon} />
                    </View>
                      <Text style={styles.warningText}>1. Do not share your Private Key with anyone. Anyone with this key can access your account and assets.</Text>
                      <Text style={styles.warningText}>2. Your Private Key is your only access to your account. If you lose it, recovery is impossible.</Text>
                      <Text style={styles.warningText}>3. Copy and back up your private key.</Text>
                    </View>
                </View>

                <View style={styles.midTextContainer}>
                </View>
            </View>

            <View style={styles.bottom}>
                <Pressable
                    style={styles.closeButton}
                    onPress={() => signup()}>
                    <Text style={styles.closeButtonText}>Confirm</Text>
                </Pressable>
            </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: Colors.primary400,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,

  },
  top: {
    flex: 3,

    height: '100%',
    width: '100%'
  },
  
  titleContainer: {
    flex: 1,

    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  privateContainer:{
    flex: 0.4,
    borderWidth: 0.5,
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  privateTextContainer: {
    padding: 10,
  },
  privateText: {
    fontSize: 12,

  },
  buttonContainer: {
    flex: 2,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  bottom: {
    flex: 0.7,
    width: '100%',
    height: '100%,',
    justifyContent: 'flex-end',
    padding: 10,
  },

  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  icon: {
    borderWidth: 0.5,
    padding: 10,
    borderRadius: 100,
    position: 'relative',
  },
  warningIcon: {
    marginBottom: 10,
  },
  
  warningTextContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  
  warningText: {
    fontSize: 12,
    marginVertical: 5,
  },
  
});
