// WalletInfoModal.js
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const WalletInfoModal = ({ visible, onClose, walletAddress, copyToClipboard, privateKey}) => {
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
            <Text style={styles.contentTitle}>Wallet Address</Text>
            <TouchableOpacity onPress={() => copyToClipboard(walletAddress)} style={styles.contentValueContainer}>
                <Text style={styles.contentValue}>{walletAddress}</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>Private Key</Text>
            <TouchableOpacity onPress={() => copyToClipboard(privateKey)} style={styles.contentValueContainer}>
                <Text style={styles.contentValue}>{privateKey}</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>Wallet Type</Text>
            <View style={styles.contentValueContainer}>
                <Text style={styles.contentValue}>TronLink</Text>
            </View>
        </View>

        <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>Network</Text>
            <View style={styles.contentValueContainer}>
                <Text style={styles.contentValue}>Tron</Text>
            </View>
        </View>
        
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
  }
});

export default WalletInfoModal;
