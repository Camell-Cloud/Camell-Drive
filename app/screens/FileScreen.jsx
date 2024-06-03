import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/color';
import AsyncStorage from '@react-native-async-storage/async-storage';

const POLLING_INTERVAL = 5000;

const FileScreen = () => {
  const [files, setFiles] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [currentFolder, setCurrentFolder] = useState('');

  useEffect(() => {
    const fetchWalletAddress = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) {
        console.error('No email found in storage');
        return;
      }

      try {
        const response = await fetch('http://54.180.133.138:8080/api/get-wallet-address', {
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
    let intervalId;

    const fetchFolderContents = async () => {
      if (!walletAddress) return;

      try {
        const response = await fetch('http://54.180.133.138:8080/api/list-folder-contents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ walletAddress, folderPath: currentFolder }),
        });
        const data = await response.json();
        if (data.success) {
          const folderContents = data.contents;
          if (currentFolder) {
            folderContents.unshift({ key: 'back', type: 'back' });
          }
          setFiles(folderContents);
        } else {
          console.error('Error fetching folder contents:', data.error);
        }
      } catch (error) {
        console.error('API error:', error);
      }
    };

    if (walletAddress) {
      fetchFolderContents();
      intervalId = setInterval(fetchFolderContents, POLLING_INTERVAL);
    }

    return () => clearInterval(intervalId);
  }, [walletAddress, currentFolder]);

  const renderFileItem = ({ item }) => (
    <TouchableOpacity
      style={styles.fileItem}
      onPress={() => {
        if (item.type === 'folder') {
          setCurrentFolder(prev => prev ? `${prev}/${item.key}` : item.key);
        } else if (item.type === 'back') {
          goBack();
        } else {
          // Handle file click if needed
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
      <Text style={styles.fileName}>{item.type === 'back' ? '...' : item.key}</Text>
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
      { text: '공유', onPress: () => console.log('Share') },
      { text: '즐겨찾기에 추가', onPress: () => console.log('Add to Favorites') },
      { text: '휴지통으로 이동', onPress: () => console.log('Move to Trash') },
      { text: '이름 변경', onPress: () => console.log('Rename') },
      { text: '취소', onPress: () => console.log('Cancel'), style: 'cancel' },
    ]);
  };

  const goBack = () => {
    setCurrentFolder(prev => {
      const parts = prev.split('/');
      parts.pop();
      return parts.join('/');
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
    height: 100,
    maxWidth: '25%',
    borderRadius: 10,
  },
  fileName: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  menuIcon: {
    position: 'absolute',
    top: 5,
    right: 11,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  },
});

export default FileScreen;
