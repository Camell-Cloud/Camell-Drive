import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Modal, TouchableOpacity, Alert, Platform, PermissionsAndroid } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../Utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlusMenu from '../screens/PlusMenu';

const FileScreen = () => {
  const [files, setFiles] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [currentFolder, setCurrentFolder] = useState('');
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [fileNameToRename, setFileNameToRename] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState('');
  const [favorites, setFavorites] = useState([]);

  const showShareModal = () => setIsShareModalVisible(true);
  const closeShareModal = () => setIsShareModalVisible(false);
  const showRenameModal = (fileName) => {
    setFileNameToRename(fileName);
    setIsRenameModalVisible(true);
  };
  const closeRenameModal = () => {
    setIsRenameModalVisible(false);
    setFileNameToRename('');
    setNewFileName('');
  };

  const handleSubmit = () => {
    alert('To be updated');
  };

  const fetchFolderContents = useCallback(async () => {
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
        let folderContents = data.contents.map(item => ({
          ...item,
          key: item.key.split('/').filter(part => part).pop(),
        }));
        if (currentFolder) {
          folderContents.unshift({ key: 'back', type: 'back' });
        }
        folderContents = folderContents.sort((a, b) => {
          const aIsFavorite = favorites.includes(a.key);
          const bIsFavorite = favorites.includes(b.key);
          return bIsFavorite - aIsFavorite;
        });
        setFiles(folderContents);
      } else {
        console.log('폴더 내용을 가져오는 중 오류 발생:', data.error);
      }
    } catch (error) {
      console.log('API 오류:', error);
    }
  }, [walletAddress, currentFolder, favorites]);

  const fetchFavorites = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const response = await fetch('http://13.124.248.7:8080/api/list-favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });

      const data = await response.json();
      if (data.success) {
        setFavorites(data.contents.map(item => item.key));
      } else {
        console.log('Error fetching favorites:', data.error);
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
    fetchFolderContents();
    fetchFavorites();
  }, [walletAddress, currentFolder, fetchFolderContents, fetchFavorites]);

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
      console.log('지갑 주소가 없습니다.');
      return;
    }

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
          console.log('저장소 접근 권한이 거부되었습니다.');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    try {
      const response = await fetch(`http://13.124.248.7:2003/api/download-file?walletAddress=${walletAddress}&filePath=${currentFolder}${fileName}`);
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
            Alert.alert('Successful', 'Downloaded');
          })
          .catch((err) => {
            console.log('파일 저장 오류:', err.message);
          });
      };
      reader.readAsDataURL(blob);

    } catch (error) {
      console.log('파일 다운로드 오류:', error.message);
    }
  };

  const toggleSelection = (key) => {
    if (selectedItems.includes(key)) {
      setSelectedItems(selectedItems.filter(item => item !== key));
    } else {
      setSelectedItems([...selectedItems, key]);
    }
  };

  const handleLongPress = (key) => {
    setIsSelectionMode(true);
    toggleSelection(key);
  };

  const handlePress = (item) => {
    if (isSelectionMode) {
      toggleSelection(item.key);
    } else {
      if (item.type === 'folder') {
        setCurrentFolder(prev => {
          const newPath = `${prev}${item.key}/`.replace(/\/\/+/g, '/');
          return newPath;
        });
      } else if (item.type === 'back') {
        goBack();
      } else {
        // 파일 클릭 시 동작 (예: 다운로드)
      }
    }
  };

  const renameFile = async () => {
    if (!walletAddress || !fileNameToRename || !newFileName) {
      Alert.alert('Error', 'Invalid input');
      return;
    }
  
    try {
      const response = await fetch('http://13.124.248.7:8080/api/rename-object', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          currentFolder,
          oldFileName: fileNameToRename,
          newFileName,
        }),
      });
  
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (data.success) {
          Alert.alert('Successful', 'Renamed');
          fetchFolderContents();
          closeRenameModal();
        } else {
          Alert.alert('Error', `${data.error}`);
        }
      } catch (jsonError) {
        console.log('JSON 파싱 오류:', jsonError);
        console.log('응답 텍스트:', text);
        Alert.alert('Error', 'Invalid response');
      }
    } catch (error) {
      console.log('파일 이름 변경 오류:', error);
      Alert.alert('Error', 'Failed to rename');
    }
  }; 

  const renderFileItem = ({ item }) => {
    const isSelected = selectedItems.includes(item.key);
    const isFavorite = favorites.includes(item.key);
  
    return (
      <TouchableOpacity
        style={[styles.fileItem, isSelected && styles.selectedItem]}
        onPress={() => handlePress(item)}
        onLongPress={() => handleLongPress(item.key)}
      >
        {isFavorite && (
          <Ionicons
            name='star'
            size={20}
            color='#FFD700'
            style={[styles.favoriteIcon, { left: 8 }]}
          />
        )}
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
        {isSelectionMode && (
          <View style={styles.selectionOverlay}>
            <Ionicons name={isSelected ? "checkmark-circle" : "ellipse-outline"} size={20} color={isSelected ? Colors.themcolor : "gray"} />
          </View>
        )}
        {!isSelectionMode && item.type !== 'back' && (
          <TouchableOpacity
            style={styles.menuIcon}
            onPress={() => showMenu(item.key, item.type)}
          >
            <Ionicons name="ellipsis-vertical" size={15} color="#000" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const showMenu = (fileName, type) => {
    const isFavorite = favorites.includes(fileName);
    setSelectedFileName(fileName);
    setSelectedFileType(type);
    setIsFavorite(isFavorite);
    setIsMenuVisible(true);
  };
  
  const toggleFavorite = async (fileName, type) => {
    if (!walletAddress) {
      console.log('지갑 주소가 없습니다.');
      return;
    }
  
    const isFavorite = favorites.includes(fileName);
    const url = isFavorite ? 'http://13.124.248.7:8080/api/remove-from-favorites' : 'http://13.124.248.7:8080/api/copy-to-favorites';
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          currentFolder,
          fileName,
          type,
        }),
      });
      const data = await response.json();
      if (data.success) {
        fetchFavorites();
        fetchFolderContents();
      } else {
        Alert.alert('Error', isFavorite ? `${data.error}` : `${data.error}`);
      }
    } catch (error) {
      console.log(isFavorite ? '즐겨찾기 제거 오류:' : '즐겨찾기 추가 오류:', error);
      Alert.alert('Error', isFavorite ? 'Failed to remove from favorites' : 'Failed to add to favorites');
    }
  };  

  const moveToTrash = async (fileName) => {
    if (!walletAddress) {
      console.log('지갑 주소가 없습니다.');
      return;
    }
  
    if (!fileName) {
      console.log('파일 이름이 없습니다.');
      return;
    }
  
    try {
      const response = await fetch('http://13.124.248.7:8080/api/move-to-trashBin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          currentFolder: currentFolder || '', // Ensure currentFolder is not null or undefined
          fileName,
        }),
      });
      const data = await response.json();
      if (data.success) {
        if (favorites.includes(fileName)) {
          await fetch('http://13.124.248.7:8080/api/remove-from-favorites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              walletAddress,
              currentFolder: currentFolder || '', // Ensure currentFolder is not null or undefined
              fileName,
              type: 'file',
            }),
          });
          fetchFavorites();
        }
        fetchFolderContents();
      } else {
        Alert.alert('Error', 'Failed to move to trash');
      }
    } catch (error) {
      console.log('휴지통으로 이동 오류:', error);
      Alert.alert('Error', 'Failed to move to trash');
    }
  };  

  const goBack = () => {
    setCurrentFolder(prev => {
      const parts = prev.split('/');
      parts.pop();
      parts.pop();
      return parts.length > 0 ? parts.join('/') + '/' : '';
    });
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedItems([]);
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
      {walletAddress && !isSelectionMode && (
        <PlusMenu walletAddress={walletAddress} currentFolder={currentFolder}/>
      )}
      {isSelectionMode && (
        <View style={styles.selectionMenu}>
          <TouchableOpacity style={styles.selectionButton} onPress={exitSelectionMode}>
            <Ionicons name="close-circle" size={25} color="gray" />
            <Text style={styles.selectionButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectionButton} onPress={handleSubmit}>
            <Ionicons name="download" size={25} color="gray" />
            <Text style={styles.selectionButtonText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectionButton} onPress={handleSubmit}>
            <Ionicons name="share-social" size={25} color="gray" />
            <Text style={styles.selectionButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectionButton} onPress={() => {moveToTrash(selectedFileName); setIsMenuVisible(false);}}>
            <Ionicons name="trash" size={25} color="gray" />
            <Text style={styles.selectionButtonText}>Trash</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectionButton} onPress={handleSubmit}>
            <Ionicons name="heart" size={25} color="gray" />
            <Text style={styles.selectionButtonText}>Favorite</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isShareModalVisible}
        onRequestClose={closeShareModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.shareTitle}>Share</Text>
            <View style={styles.shareInput}>
              <TextInput style={styles.input} placeholder="Enter wallet address" />
              <TouchableOpacity onPress={() => console.log('Sending to')} style={styles.camerabutton}>
                <Ionicons name="camera" size={20} color="gray" />
              </TouchableOpacity>
            </View>
            <View style={{ width: 200, alignItems: 'flex-end' }}>
              <View style={styles.shareButton}>
                <TouchableOpacity onPress={() => console.log('Sending to')} style={styles.dialogButton}>
                  <Text style={styles.dialogbuttonText}>Send</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeShareModal} style={styles.dialogButton}>
                  <Text style={styles.dialogbuttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isRenameModalVisible}
        onRequestClose={closeRenameModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.RenamemodalView}>
            <Text style={styles.shareTitle}>Rename</Text>
            <View style={styles.shareInput}>
              <TextInput
                style={styles.input}
                placeholder="Enter new file name"
                value={newFileName}
                onChangeText={setNewFileName}
              />
            </View>
            <View style={{ width: 200, alignItems: 'flex-end' }}>
              <View style={styles.shareButton}>
                <TouchableOpacity onPress={renameFile} style={styles.dialogButton}>
                  <Text style={styles.dialogbuttonText}>Change</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeRenameModal} style={styles.dialogButton}>
                  <Text style={styles.dialogbuttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Actions for {selectedFileName}</Text>
            <TouchableOpacity onPress={() => { downloadFile(selectedFileName); setIsMenuVisible(false); }} style={styles.menuItem}>
              <Text style={styles.menuText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('To be updated...')} style={styles.menuItem}>
            {/* <TouchableOpacity onPress={() => { showShareModal(); setIsMenuVisible(false); }} style={styles.menuItem}> */}
              <Text style={styles.menuText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { toggleFavorite(selectedFileName, selectedFileType); setIsMenuVisible(false); }} style={styles.menuItem}>
              <Text style={styles.menuText}>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { moveToTrash(selectedFileName); setIsMenuVisible(false); }} style={styles.menuItem}>
              <Text style={styles.menuText}>Trash</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('To be updated...')} style={styles.menuItem}>
            {/* <TouchableOpacity onPress={() => { showRenameModal(selectedFileName); setIsMenuVisible(false); }} style={styles.menuItem}> */}
              <Text style={styles.menuText}>Rename</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsMenuVisible(false)} style={[styles.menuItem, styles.cancelItem]}>
              <Text style={styles.menuText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  favoriteIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  grid: {
    marginTop: 10,
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
    marginBottom: 5
  },
  selectedItem: {
    backgroundColor: '#d1e7ff',
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
    top: 5,
    right: 0,
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
  selectionOverlay: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 2,
  },
  selectionMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 0.2,
    borderTopColor: 'gray',
    backgroundColor: 'white',
  },
  selectionButton: {
    alignItems: 'center',
  },
  selectionButtonText: {
    fontSize: 12,
    color: 'gray',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menuItem: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
  },
  cancelItem: {
    marginTop: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
});

export default FileScreen;
