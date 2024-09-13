import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput} from 'react-native';

const SwapModal = ({ visible, onClose }) => {
  const [isDeposit, setIsDeposit] = useState(true); // true일 때 입금 화면, false일 때 출금 화면

  const handleDeposit = () => {
    setIsDeposit(true); // 입금 화면으로 전환
  };

  const handleWithdraw = () => {
    setIsDeposit(false); // 출금 화면으로 전환
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          {isDeposit ? (
            // 입금
            <View style={styles.Container}>

                <View style={styles.Top}>
                  <Text style={styles.titleText}>Deposit</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>X</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.Bottom}>
                    <View>
                        <Text>sdfasdfTEXT</Text>
                        <View style={styles.contentValueContainer}>
                            <Text style={styles.contentValue}>TEST</Text>
                        </View>
                    </View>
                    
                    <View style={{marginTop: 20, alignItems: 'center'}}>
                    <Text style={styles.title}>Enter the amount to be received from your personal wallet</Text>
                        <TextInput
                          style={styles.input}
                          placeholder=""
                        />
                    </View>

                </View>

                <View style={styles.buttonMainContainer}>
                    <TouchableOpacity style={styles.confirmButton}>
                        <Text style={styles.confirmButtonText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>

          ) : (
            // 출금
            <View style={styles.Container}>
                <View style={styles.Top}>
                  <Text>Withdraw Screen</Text>
                </View>
                <View style={styles.Bottom}></View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, { borderRightWidth: 0.5, borderColor: '#ccc' }]} 
              onPress={handleDeposit}
            >  
              <Text style={styles.buttonText}>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleWithdraw}
            >
              <Text style={styles.buttonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    height: '53%',
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
  closeButton: {
    padding: 10,
    position: 'absolute',
    paddingHorizontal: 15,
    right: 10,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 17,
  },
  Container: {
    flex: 1,
    width: '100%',
  },
  Top: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  Bottom: {
    flex: 4,
    padding: 15,
  },
  titleText: {
    fontSize: 17.5,
    padding: 10,
  },
  input: {
    borderWidth: 0.2,
    padding: 4,
    fontSize: 11,
    borderRadius: 3,
    width: '70%'
  },
  contentValueContainer: {
    backgroundColor: 'rgba(217,217,217,0.5)',
    marginTop: 5,
    marginBottom: 15,
    padding: 7
  },
  confirmButton: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    width: '40%',
    backgroundColor: '#e87894'
  },
  buttonMainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    fontSize: 12,
    marginBottom: 10,
  }
});

export default SwapModal;
