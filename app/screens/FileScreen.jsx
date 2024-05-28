import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Modal, TouchableOpacity, Alert, Platform, PermissionsAndroid } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlusMenu from '../screens/PlusMenu';
import RNFS from 'react-native-fs';

const FileScreen = () => {
  const [files, setFiles] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [currentFolder, setCurrentFolder] = useState('');
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);

  const showShareModal = () => setIsShareModalVisible(true);
  const closeShareModal = () => setIsShareModalVisible(false);
  const showRenameModal = () => setIsRenameModalVisible(true);
  const closeRenameModal = () => setIsRenameModalVisible(false);

  useEffect(() => {
    const fetchWalletAddress = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) {
        console.error('No email found in storage');
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
          console.error('Error fetching wallet address:', data.error);
        }
      } catch (error) {
        console.error('API error:', error);
      }
    };

    fetchWalletAddress();
  }, []);

  useEffect(() => {
    const fetchFolderContents = async () => {
      if (!walletAddress) return;

      try {
        const response = await fetch('http://13.124.248.7:8080/api/list-folder-contents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ walletAddress, folderPath: currentFolder }),
        });
        const data = await response.json();
        if (data.success) {
          const folderContents = data.contents.map(item => ({
            ...item,
            key: item.key.split('/').filter(part => part).pop(),
          }));
          if (currentFolder) {
            folderContents.unshift({ key: 'back', type: 'back' });
          }
          setFiles(folderContents);
        } else {
          console.error('폴더 내용을 가져오는 중 오류 발생:', data.error);
        }
      } catch (error) {
        console.error('API 오류:', error);
      }
    };

    if (walletAddress) {
      fetchFolderContents();
    }
  }, [walletAddress, currentFolder]);

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

  const downloadFile = async (fileName) => {
    if (!walletAddress) {
      console.error('지갑 주소가 없습니다.');
      return;
    }

    // 권한 요청 (Android)
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: '파일 저장 권한',
            message: '파일을 저장하기 위해 저장소 접근 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '취소',
            buttonPositive: '확인',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.error('저장소 접근 권한이 거부되었습니다.');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    try {
      const response = await fetch(`http://13.124.248.7:2005/api/download-file?walletAddress=${walletAddress}&filePath=${currentFolder}${fileName}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`파일 다운로드 실패: ${errorText}`);
      }

      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = async () => {
        const base64data = reader.result.split(',')[1];
        const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        await RNFS.writeFile(path, base64data, 'base64')
          .then(() => {
            console.log('파일 다운로드 성공:', path);
            Alert.alert('성공', '파일이 성공적으로 다운로드되었습니다.');
          })
          .catch((err) => {
            console.error('파일 저장 오류:', err.message);
          });
      };
      reader.readAsDataURL(blob);

    } catch (error) {
      console.error('파일 다운로드 오류:', error.message);
    }
  };

  const renderFileItem = ({ item }) => (
    <TouchableOpacity
      style={styles.fileItem}
      onPress={() => {
        if (item.type === 'folder') {
          setCurrentFolder(prev => {
            const newPath = `${prev}${item.key}/`.replace(/\/\/+/g, '/');
            return newPath;
          });
        } else if (item.type === 'back') {
          goBack();
        } else {

        }
      }}
    >
      {item.type === 'folder' ? (
        <Ionicons
          name='folder'
          size={50}
          color='#d54d84'
          style={{ opacity: 0.8 }}
        />
      ) : item.type === 'back' ? (
        <MaterialCommunityIcons
          name='folder-open'
          size={50}
          color='#d54d84'
          style={{ opacity: 0.8 }}
        />
      ) : (
        <Ionicons
          name='document-text'
          size={50}
          color={Colors.themcolor}
          style={{ opacity: 0.8 }}
        />
      )}
      <Text style={styles.fileName}>{item.type === 'back' ? '...' : truncateName(item.key)}</Text>
      {item.type !== 'back' && (
        <TouchableOpacity
          style={styles.menuIcon}
          onPress={() => showMenu(item.key)}
        >
          <Ionicons name="ellipsis-vertical" size={15} color="#000" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const showMenu = (fileName) => {
    Alert.alert("File Menu", `Actions for ${fileName}`, [
      { text: '다운로드', onPress: () => downloadFile(fileName) },
      { text: '공유', onPress: showShareModal },
      { text: '즐겨찾기에 추가', onPress: () => console.log('Add to Favorites') },
      { text: '휴지통으로 이동', onPress: () => console.log('Move to Trash') },
      { text: '이름 변경', onPress: showRenameModal },
      { text: '취소', onPress: () => console.log('Cancel'), style: 'cancel' },
    ]);
  };

  const goBack = () => {
    setCurrentFolder(prev => {
      const parts = prev.split('/');
      parts.pop();
      parts.pop();
      return parts.length > 0 ? parts.join('/') + '/' : '';
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <FlatList
        data={files}
        renderItem={renderFileItem}
        keyExtractor={item => item.key}
        numColumns={4}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={<Text style={styles.emptyText}>Empty</Text>}
      />
      <PlusMenu walletAddress={walletAddress} currentFolder={currentFolder} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShareModalVisible}
        onRequestClose={closeShareModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.shareTitle}>공유하기</Text>
            <View style={styles.shareInput}>
              <TextInput style={styles.input} placeholder="Enter wallet address" />
              <TouchableOpacity onPress={() => console.log('Sending to')} style={styles.camerabutton}>
                <Ionicons name="camera" size={20} color="gray" />
              </TouchableOpacity>
            </View>
            <View style={{ width: 200, alignItems: 'flex-end' }}>
              <View style={styles.shareButton}>
                <TouchableOpacity onPress={() => console.log('Sending to')} style={styles.dialogButton}>
                  <Text style={styles.dialogbuttonText}>보내기</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeShareModal} style={styles.dialogButton}>
                  <Text style={styles.dialogbuttonText}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isRenameModalVisible}
        onRequestClose={closeRenameModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.RenamemodalView}>
            <Text style={styles.shareTitle}>이름 변경</Text>
            <View style={styles.shareInput}>
              <TextInput style={styles.input} placeholder="Enter wallet address" />
            </View>
            <View style={{ width: 200, alignItems: 'flex-end' }}>
              <View style={styles.shareButton}>
                <TouchableOpacity onPress={() => console.log('이름변경')} style={styles.dialogButton}>
                  <Text style={styles.dialogbuttonText}>변경</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeRenameModal} style={styles.dialogButton}>
                  <Text style={styles.dialogbuttonText}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  fileItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
    maxWidth: '22%',
    borderRadius: 10,
    marginHorizontal: 5, 

    

  },
  fileName: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
    height: 30,
    lineHeight: 15,
  },
  menuIcon: {
    position: 'absolute',
    top: 6,
    right: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 15,
    top: 248,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '60%',
    padding: 25,
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
  input: {
    height: 30,
    padding: 5,
    flex: 1,
  },
  shareTitle: {
    marginBottom: 30,
    fontSize: 20,
  },
  shareButton: {
    flexDirection: 'row',
    marginTop: 10,
  },
  dialogButton: {
    marginLeft: 10,
  },
  dialogbuttonText: {
    fontSize: 13,
    color: Colors.themcolor,
    padding: 10,
  },
  shareInput: {
    borderBottomWidth: 0.5,
    borderColor: Colors.themcolor,
    flexDirection: 'row',
  },
  camerabutton: {
    marginRight: 10,
  },
  RenamemodalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '60%',
    padding: 25,
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
});

export default FileScreen;
