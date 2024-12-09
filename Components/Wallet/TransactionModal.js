import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';

const TransactionModal = ({ modalType, visible, onClose, username, copyToClipboard, balance, fetchWalletData }) => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [receiverUsername, setReceiverUsername] = useState('');


  const handleWithdraw = async () => {
    if (!withdrawAmount || !receiverUsername) {
      Alert.alert('Error', 'Please enter all fields.');
      return;
    }
  
    // 잔액보다 많은 금액을 전송하려는 경우 확인
    if (parseFloat(withdrawAmount) > parseFloat(balance)) {
      Alert.alert('Error', 'Insufficient balance.');
      return;
    }
  
    try {
      const response = await axios.post('http://13.124.248.7:1212/update-amount', {
        sender: username, // 보내는 사람의 유저네임
        receiver: receiverUsername, // 받는 사람의 유저네임
        amount: withdrawAmount, // 전송할 금액 (숫자)
      });
  
      if (response.data.success) {
        Alert.alert('Success', 'Transaction sent successfully!');
        fetchWalletData();  // 잔액 새로고침
        onClose(); // 모달 닫기
      } else {
        Alert.alert('Error', 'Failed to send transaction');
      }
    } catch (error) {
      console.error('Transaction error:', error);
      Alert.alert('Error', `Transaction error: ${error.message}`);
    }
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
          <Text style={styles.modalTitle}>{modalType === 'deposit' ? 'Deposit' : 'Withdraw'}</Text>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
            <Text style={styles.closeButton}>x</Text>
          </TouchableOpacity>
        </View>
        {modalType === 'deposit' ? (
          <View style={styles.withdrawContent}>
            {username && <QRCode value={username} size={150} />}
            <Text style={styles.walletAddressText2}>Username</Text>
            <Text style={styles.walletAddressText}>{username}</Text>
            <TouchableOpacity onPress={() => copyToClipboard(username)} style={styles.copyButton}>
              <Ionicons name="copy-outline" size={20} color="white" />
              <Text style={styles.copyButtonText}>Copy Username</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.depositContent}>
            <Text style={styles.withrawTitle}>Amount of withdrawal</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter amount" 
              keyboardType="numeric"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
            />
            <Text style={styles.withrawTitle}>Username</Text>
            <TextInput
                          style={styles.input} 

  placeholder="Receiver Username"
  value={receiverUsername}
  onChangeText={setReceiverUsername}
/>

            <TouchableOpacity style={styles.confirmButton} onPress={handleWithdraw}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    position: 'absolute',
    height: "69%",
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
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
  modalCloseButton: {
    position: 'absolute',
    right: -150,
    padding: 10,
    alignItems: 'center',
  },
  withdrawContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  walletAddressText: {
    position: 'absolute',
    bottom: -100,
    fontSize: 16,
    marginVertical: 10,
    backgroundColor: "#ffebf0",
    padding: 3,
  },
  walletAddressText2: {
    position: 'absolute',
    bottom: -70,
    fontSize: 18,
    marginVertical: 10,
  },
  copyButton: {
    position: 'absolute',
    bottom: -150,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e87894',
    borderRadius: 5,
  },
  copyButtonText: {
    marginLeft: 5,
    color: 'white',
  },
  depositContent: {
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '80%',
    paddingHorizontal: 10,
  },
  confirmButton: {
    backgroundColor: '#e87894',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 40,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
  NetworkView: {
    backgroundColor: "#ffebf0",
    width: '81%',
    padding: 7,
  },
  networkText: {
    fontSize: 20,
  },
  withrawTitle: {
    textAlign: 'left',
    fontSize: 15,
    width: '81%',
    marginBottom: 3,
  },
  closeButton: {
    fontSize: 20,
  }
});

export default TransactionModal;
