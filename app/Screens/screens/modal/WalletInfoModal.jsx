// WalletInfoModal.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const WalletInfoModal = ({ visible, onClose, walletAddress }) => {
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
        <View style={styles.content}>
            <Text>asdf</Text>
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
  content: {
    alignItems: 'center',
    marginTop: 20,
    padding: 5,
    backgroundColor: 'red'
  },
  closeButton: {
    fontSize: 20,
    position: 'absolute',
    right: 10,
    top: -14,
    padding: 10,
  },
});

export default WalletInfoModal;
