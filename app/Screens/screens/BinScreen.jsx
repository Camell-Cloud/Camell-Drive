import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../Utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BinScreen = () => {
  const [files, setFiles] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'restore' or 'delete'

  const fetchTrashContents = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const response = await fetch('http://13.124.248.7:8080/api/list-bin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });
      const data = await response.json();
      if (data.success) {
        const trashContents = await Promise.all(data.contents.map(async (item) => {
          return {
            ...item,
            key: item.key ? item.key.split('/').filter(part => part).pop() : '',
            expirationDate: item.expirationDate ? new Date(item.expirationDate) : null,
            contentUrl: item.contentUrl || '', // Ensure contentUrl is not undefined
          };
        }));
        setFiles(trashContents);
      } else {
        console.log('Error fetching trash contents:', data.error);
      }
    } catch (error) {
      console.log('API error:', error);
    }
  }, [walletAddress]);

  useEffect(() => {
    const fetchWalletAddress = async () => {
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
          setWalletAddress(data.address);
        } else {
          console.log('Error fetching wallet address:', data.error);
        }
      } catch (error) {
        console.log('API error:', error);
      }
    };

    fetchWalletAddress();
  }, []);

  useEffect(() => {
    fetchTrashContents();
    const interval = setInterval(() => {
      fetchTrashContents();
    }, 2000); // Fetch files every 2 seconds

    return () => clearInterval(interval);
  }, [walletAddress, fetchTrashContents]);

  const truncateName = (name) => {
    const maxLength = 20;
    const ellipsis = '...';
    const nameParts = name.split('.');
    const fileExtension = nameParts.length > 1 ? nameParts.pop() : '';
    const baseName = nameParts.join('.');

    if (baseName.length + fileExtension.length + 1 > maxLength) {
      const availableLength = maxLength - ellipsis.length - fileExtension.length - 1;
      const truncatedBaseName = baseName.substring(0, availableLength);
      return `${truncatedBaseName}${ellipsis}${fileExtension ? '.' + fileExtension : ''}`;
    }

    return name;
  };

  const calculateDaysLeft = (expirationDate) => {
    if (!expirationDate) return { text: 'N/A', color: 'black' };
    const now = new Date();
    const timeDiff = expirationDate - now;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const color = daysLeft <= 5 ? 'red' : 'blue';
    return { text: daysLeft > 0 ? `${daysLeft} days` : 'Expired', color };
  };

  const formatSize = (sizeInBytes) => {
    if (sizeInBytes >= 1024 * 1024) {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    } else if (sizeInBytes >= 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else {
      return `${sizeInBytes} bytes`;
    }
  };

  const openModal = (file) => {
    setSelectedFile(file);
    setModalVisible(true);
  };

  const confirmAndRestoreFile = () => {
    setConfirmAction('restore');
    setConfirmModalVisible(true);
  };

  const confirmAndPermanentlyDeleteFile = () => {
    setConfirmAction('delete');
    setConfirmModalVisible(true);
  };

  const restoreFile = async () => {
    if (!selectedFile) return;
    try {
      const response = await fetch('http://13.124.248.7:8080/api/restore-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress, fileKey: selectedFile.key }),
      });

      const responseData = await response.text(); // Fetch response as text
      console.log('Full response:', responseData);

      const data = JSON.parse(responseData); // Try to parse it as JSON
      console.log(data); // Log the parsed response

      if (data.success) {
        setModalVisible(false);
        fetchTrashContents();
      } else {
        console.log('Error restoring file:', data.error);
      }
    } catch (error) {
      console.log('API error:', error);
    }
  };

  const permanentlyDeleteFile = async () => {
    if (!selectedFile) return;
    try {
      const response = await fetch('http://13.124.248.7:8080/api/delete-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress, fileKey: selectedFile.key }),
      });

      const responseData = await response.text(); // Fetch response as text
      console.log('Full response:', responseData);

      const data = JSON.parse(responseData); // Try to parse it as JSON
      console.log(data); // Log the parsed response

      if (data.success) {
        setModalVisible(false);
        fetchTrashContents();
      } else {
        console.log('Error deleting file:', data.error);
      }
    } catch (error) {
      console.log('API error:', error);
    }
  };

  const handleConfirmAction = () => {
    if (confirmAction === 'restore') {
      restoreFile();
    } else if (confirmAction === 'delete') {
      permanentlyDeleteFile();
    }
    setConfirmAction(null);
    setConfirmModalVisible(false);
  };

  const renderFileItem = ({ item }) => {
    const expiration = calculateDaysLeft(item.expirationDate);
    return (
      <View style={styles.fileItemContainer}>
        <TouchableOpacity
          style={styles.fileItem}
          onLongPress={() => openModal(item)}
        >
          {item.type === 'folder' ? (
            <Ionicons
              name='folder'
              size={70}
              color='#d54d84'
              style={{ opacity: 0.8 }}
            />
          ) : (
            <Ionicons
              name='document-text'
              size={70}
              color={Colors.themcolor}
              style={{ opacity: 0.8 }}
            />
          )}
          <Text style={styles.fileName}>{truncateName(item.key)}</Text>
          <Text style={[styles.expirationText, { color: expiration.color }]}>
            Expires in {expiration.text}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openModal(item)} style={styles.menuButton}>
          <Ionicons name='ellipsis-vertical' size={20} color='#000' />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <FlatList
        data={files}
        renderItem={renderFileItem}
        keyExtractor={item => item.key || Math.random().toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={<Text style={styles.emptyText}>Empty</Text>}
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
                {selectedFile.type === 'folder' ? (
                  <Ionicons
                    name='folder'
                    size={70}
                    color='#d54d84'
                    style={{ opacity: 0.8 }}
                  />
                ) : (
                  <Ionicons
                    name='document-text'
                    size={70}
                    color={Colors.themcolor}
                    style={{ opacity: 0.8 }}
                  />
                )}
                <Text style={styles.modalFileName}>{selectedFile.key}</Text>
                <Text style={styles.modalFileSize}>Size: {formatSize(selectedFile.size)}</Text>
                <Text style={styles.modalFileAdded}>Added: {selectedFile.addedDate ? selectedFile.addedDate.toLocaleDateString() : 'N/A'}</Text>
                <Text style={styles.modalExpiration}>Expires: {selectedFile.expirationDate ? selectedFile.expirationDate.toLocaleDateString() : 'N/A'}</Text>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.actionButton, { marginRight: 10 }]}
                  onPress={confirmAndRestoreFile}
                >
                  <Text style={styles.actionButtonText}>Restore</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton]}
                  onPress={confirmAndPermanentlyDeleteFile}
                >
                  <Text style={styles.actionButtonText}>Permanently Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      {confirmAction && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={confirmModalVisible}
          onRequestClose={() => setConfirmModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.confirmModalContent}>
              <Text style={styles.confirmModalTitle}>Confirm {confirmAction === 'restore' ? 'Restore' : 'Delete'}</Text>
              <Text style={styles.confirmModalText}>Are you sure you want to {confirmAction === 'restore' ? 'restore' : 'permanently delete'} this file?</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.actionButton, { marginRight: 10 }]}
                  onPress={handleConfirmAction}
                >
                  <Text style={styles.actionButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: 'grey' }]}
                  onPress={() => setConfirmModalVisible(false)}
                >
                  <Text style={styles.actionButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    marginTop: 10,
    paddingHorizontal: 10,
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
    backgroundColor: '#fff', // Added background color for better visibility
    padding: 10, // Added padding for better spacing
  },
  fileName: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
    height: 30,
    lineHeight: 15,
  },
  expirationText: {
    fontSize: 10,
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
  confirmModalContent: {
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
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  confirmModalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
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
  modalFileAdded: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  modalExpiration: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: Colors.themcolor,
    borderRadius: 10,
    padding: 10,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BinScreen;
