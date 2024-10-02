// WalletInfoModal.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AddWalletAddressModal from './AddPersonalWalletArress';

const WalletInfoModal = ({ visible, onClose, copyToClipboard, username}) => {
  const [privateKey, setPrivateKey] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isAddAddressModalVisible, setIsAddAddressModalVisible] = useState(false); // 주소 추가 모달 상태

  

  // 개인 지갑 주소를 불러오는 함수
const fetchWalletAddress = async () => {
  try {
    const response = await fetch('http://13.124.248.7:1212/get-wallet-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }), // 사용자 이름으로 요청
    });

    const data = await response.json();
    if (data.success && data.personal_wallet_address) {
      setWalletAddress(data.personal_wallet_address); // 개인 지갑 주소 상태에 저장
    } else {
      setWalletAddress(''); // 주소가 없으면 빈 값 설정
    }
  } catch (error) {
    Alert.alert('Error', `Error fetching wallet address: ${error.message}`);
  }
};

const deleteWalletAddress = async () => {
  try {
    const response = await fetch('http://13.124.248.7:1212/delete-wallet-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }), // 사용자 이름으로 요청
    });

    const data = await response.json();
    if (data.success) {
      setWalletAddress(''); // 성공적으로 삭제되면 지갑 주소 초기화
      Alert.alert('Success', 'Wallet address deleted successfully.');
    } else {
      Alert.alert('Error', data.message || 'Failed to delete wallet address.');
    }
  } catch (error) {
    Alert.alert('Error', `Error deleting wallet address: ${error.message}`);
  }
};

const saveWalletAddress = async (newAddress) => {
  setWalletAddress(newAddress); // 지갑 주소 업데이트
  setIsAddAddressModalVisible(false); // 모달 닫기

  try {
    const response = await fetch('http://13.124.248.7:1212/save-wallet-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        personal_wallet_address: newAddress,
      }),
    });

    const data = await response.json();
    if (data.success) {
      Alert.alert('Success', 'Wallet address saved successfully.');
    } else {
      Alert.alert('Error', data.message || 'Failed to save wallet address.');
    }
  } catch (error) {
    Alert.alert('Error', `Error saving wallet address: ${error.message}`);
  }
};


  // private_key를 불러오는 함수
  const fetchPrivateKey = async () => {
    try {
      const response = await fetch('http://13.124.248.7:1212/get-private-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }), // 사용자 이름으로 요청
      });

      const data = await response.json();
      if (data.success) {
        setPrivateKey(data.private_key); // private_key 상태에 저장
      } else {
        Alert.alert('Error', 'Failed to fetch private key');
      }
    } catch (error) {
      Alert.alert('Error', `Error fetching private key: ${error.message}`);
    }
  };

  

  useEffect(() => {
    if (visible && username) {
      fetchPrivateKey(); // 모달이 열릴 때 호출
      fetchWalletAddress(); // 지갑 주소 불러오기
    }
  }, [visible, username]);
  

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalView}>
        <View style={styles.modalTop}>
          <Text style={styles.modalTitle}>Wallet details</Text>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
        <Text style={styles.closeButton}>x</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>Username</Text>
            <TouchableOpacity onPress={() => copyToClipboard(username)} style={styles.contentValueContainer}>
                <Text style={styles.contentValue}>{username}</Text>
            </TouchableOpacity>
        </View>


        <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>Private Key</Text>
            <TouchableOpacity onPress={() => copyToClipboard(privateKey)} style={styles.contentValueContainer}>
                <Text style={styles.contentValue}>{privateKey}</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle}>Personal Wallet Address</Text>
          {walletAddress ? (
            <View>
              <TouchableOpacity onPress={() => copyToClipboard(walletAddress)} style={styles.contentValueContainer}>
                <Text style={styles.contentValue}>{walletAddress}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={deleteWalletAddress}>
                <Text style={styles.deleteButtonText}>Delete Wallet Address</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={() => setIsAddAddressModalVisible(true)}>
              <Text style={styles.buttonText}>+ Add Personal Wallet Address</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <AddWalletAddressModal
          visible={isAddAddressModalVisible}
          onClose={() => setIsAddAddressModalVisible(false)}
          onSave={saveWalletAddress}
        />
      </View>

    </Modal>
    
  );
};

const styles = StyleSheet.create({
  modalView: {
    position: 'absolute',
    height: "53%",
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
  closeButton: {
    fontSize: 20,
    position: 'absolute',
    right: 10,
    top: -14,
    padding: 10,
  },

  contentContainer: {
    margin: 7,
    padding: 5,
    width: '80%',
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentValueContainer: {
    backgroundColor: 'rgba(217,217,217,0.5)',
    marginTop: 5,
    padding: 7
  },
  addButton: {
    backgroundColor: 'rgba(232,120,148,0.8)',
    padding: 10,
    borderRadius: 20,
    marginTop: 5,
  },
  buttonText: {
    color: 'snow',

  },

  deleteButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default WalletInfoModal;
