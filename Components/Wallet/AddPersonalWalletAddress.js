// AddWalletAddressModal.js
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // 경고 아이콘을 위한 임포트


const AddWalletAddressModal = ({ visible, onClose, onSave }) => {
  const [newAddress, setNewAddress] = useState(''); // 새로운 지갑 주소 상태

  const handleSave = () => {
    if (!newAddress) {
      Alert.alert('Error', 'Please enter a valid address');
      return;
    }
    onSave(newAddress); // 부모 컴포넌트로 지갑 주소 전달
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalView}>
        <View style={styles.modalTop}>
          <Text style={styles.modalTitle}>Add your personal wallet adress</Text>
        </View>

        <View style={styles.contentContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your wallet address"
              value={newAddress}
              onChangeText={setNewAddress}
            />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.warningContainer}>
          <Ionicons name="warning-outline" size={20} color="gray" />
          <Text style={styles.warningText}>
          Please ensure the accuracy of the wallet address. Incorrect entries may result in failed deposit verification.          </Text>
        </View>
      </View>
    </Modal>
    
  );
};

const styles = StyleSheet.create({
  modalView: {
    position: 'absolute',
    height: "27%",
    bottom: 0,
    width: '100%',

    backgroundColor: 'snow',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 17,
  },
  modalTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contentContainer: {
    margin: 7,
    padding: 5,
    width: '80%',
  },


  buttonContainer: {
    flexDirection: 'row',
    width: '100%',

  },   
  buttonText: {
    color: 'white',
    fontSize: 12,

  },
  saveButton: {
    backgroundColor: '#E45E7E',
    padding: 5,
    borderRadius: 8,
    position: 'relative',
    right: -220,

  },
  cancelButton: {
    backgroundColor: '#E45E7E',
    padding: 5,
    borderRadius: 8,
    position: 'relative',
    right: -230
  },
  input: {
    borderWidth: 0.6,
    borderRadius: 5,
    padding: 4,
    paddingHorizontal: 10,
  },

  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  warningText: {
    color: 'gray',
    fontSize: 11,
    marginLeft: 5,
  },
});

export default AddWalletAddressModal;
