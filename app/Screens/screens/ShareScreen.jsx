import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../Utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const formatSize = (sizeInBytes) => {
  if (sizeInBytes >= 1024 * 1024) {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  } else if (sizeInBytes >= 1024) {
    return `${(sizeInBytes / 1024).toFixed(2)} KB`;
  } else {
    return `${sizeInBytes} bytes`;
  }
};

export default function ShareScreen({ navigation }) {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchSharedFiles = useCallback(async () => {
    const email = await AsyncStorage.getItem('userEmail');
    if (!email) {
      console.log('No email found in storage');
      return;
    }

    try {
      const response = await fetch('http://13.124.248.7:8080/api/get-wallet-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        const walletAddress = data.address;
        setWalletAddress(walletAddress);
        const sharedResponse = await fetch('http://13.124.248.7:8080/api/list-shared-files', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ walletAddress }),
        });
        const sharedData = await sharedResponse.json();
        if (sharedData.success) {
          setSharedFiles(sharedData.contents);
        } else {
          console.log('Error fetching shared files:', sharedData.error);
        }
      } else {
        console.log('Error fetching wallet address:', data.error);
      }
    } catch (error) {
      console.log('API error:', error);
    }
  }, []);

  useEffect(() => {
    fetchSharedFiles();
  }, [fetchSharedFiles]);

  const handleLongPress = (item) => {
    setSelectedFile(item);
    setModalVisible(true);
  };

  const openModal = (file) => {
    setSelectedFile(file);
    setModalVisible(true);
  };

  const deleteFile = async () => {
    if (!walletAddress || !selectedFile) {
      Alert.alert('Error', 'Invalid input');
      return;
    }

    try {
      const response = await fetch('http://13.124.248.7:8080/api/delete-shared-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          fileName: selectedFile.key,
        }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Successful', 'File Deleted');
        fetchSharedFiles();
        setModalVisible(false);
      } else {
        Alert.alert('Error', `${data.error}`);
      }
    } catch (error) {
      console.log('File delete error:', error);
      Alert.alert('Error', 'Failed to delete file');
    }
  };

  const renderSharedFileItem = ({ item }) => (
    <View style={styles.fileItemContainer}>
      <TouchableOpacity
        style={styles.fileItem}
        onLongPress={() => handleLongPress(item)}
      >
        <Ionicons
          name='document-text'
          size={50}
          color={Colors.themcolor}
          style={{ opacity: 0.8 }}
        />
        <Text style={styles.fileName}>{item.key}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openModal(item)} style={styles.menuButton}>
        <Ionicons name='ellipsis-vertical' size={20} color='#000' />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sharedFiles}
        renderItem={renderSharedFileItem}
        keyExtractor={item => item.key}
        numColumns={4}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={<Text style={styles.emptyText}>No shared files</Text>}
      />
      {selectedFile && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name='close' size={30} color='#000' />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>File Details</Text>
              <View style={styles.fileDetails}>
                <Ionicons
                  name='document-text'
                  size={70}
                  color={Colors.themcolor}
                  style={{ opacity: 0.8 }}
                />
                <Text style={styles.modalFileName}>{selectedFile.key}</Text>
                <Text style={styles.modalFileSize}>Size: {formatSize(selectedFile.size)}</Text>
                <Text style={styles.modalSenderWallet}>Sender Wallet: {selectedFile.senderWallet}</Text>
                <Text style={styles.modalSenderEmail}>Sender Email: {selectedFile.senderEmail}</Text>
              </View>
              <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Update')}>
                <Text style={styles.downloadText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={deleteFile}>
                <Text style={styles.menuText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  grid: {
    marginTop: 10,
    paddingTop: 10,
  },
  fileItemContainer: {
    position: 'relative',
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  fileItem: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 140,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
  },
  fileName: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
    height: 30,
    lineHeight: 15,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 15,
  },
  menuButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fileDetails: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalFileName: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  modalFileSize: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  modalSenderWallet: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  modalSenderEmail: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  menuItem: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: 'red', // Add color for delete option
  },
  downloadText: {
    fontSize: 16,
    color: 'blue', // Add color for delete option
  },
});

