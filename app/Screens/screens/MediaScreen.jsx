import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, Alert, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { Colors } from '../Utils/colors';
import PlusMenu from '../screens/PlusMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageViewing from 'react-native-image-viewing';
import { Video } from 'expo-av';
import Icon from 'react-native-vector-icons/Ionicons';

const fetchMedia = async (walletAddress) => {
  try {
    const response = await fetch(`http://13.124.248.7:2003/api/list-media?walletAddress=${walletAddress}`);
    const data = await response.json();
    console.log('서버로부터 받은 데이터:', data);
    if (!data.mediaFiles) {
      throw new Error('Invalid response format');
    }
    return data.mediaFiles;
  } catch (error) {
    console.error('미디어 목록 가져오기 오류:', error);
    Alert.alert('Error', 'Failed to fetch media list');
    return [];
  }
};

const MediaScreen = ({ navigation }) => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);
  const [images, setImages] = useState([]);
  const [imageIndexMap, setImageIndexMap] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const handleSubmit = () => {
    alert('To be updated');
  };

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

  const loadMedia = async () => {
    if (!walletAddress) return;
    const files = await fetchMedia(walletAddress);
    console.log('Fetched media files:', files);
    const filteredFiles = files.filter(file => file.url && file.url.trim() !== '');
    setMediaFiles(filteredFiles);

    const imageFiles = filteredFiles.filter(file => file.url && !file.url.endsWith('.mp4') && !file.url.endsWith('.mov'));
    setImages(imageFiles);

    const indexMap = {};
    let imageIndex = 0;
    filteredFiles.forEach((file, index) => {
      if (file.url && !file.url.endsWith('.mp4') && !file.url.endsWith('.mov')) {
        indexMap[index] = imageIndex++;
      }
    });
    setImageIndexMap(indexMap);
  };

  useEffect(() => {
    loadMedia();
  }, [walletAddress]);

  const handleVideoPress = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].presentFullscreenPlayer();
    }
  };

  const handleLongPress = (index) => {
    setIsSelectionMode(true);
    toggleSelection(index);
  };

  const toggleSelection = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter(item => item !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const handlePress = (index, isVideo) => {
    if (isSelectionMode) {
      toggleSelection(index);
    } else {
      if (isVideo) {
        handleVideoPress(index);
      } else {
        setCurrentIndex(imageIndexMap[index]);
        setIsVisible(true);
      }
    }
  };

  const renderItem = ({ item, index }) => {
    const isVideo = item.url && (item.url.endsWith('.mp4') || item.url.endsWith('.mov'));
    const isSelected = selectedItems.includes(index);

    return (
      <TouchableOpacity
        style={[styles.mediaContainer, isSelected && styles.selectedMedia]}
        onPress={() => handlePress(index, isVideo)}
        onLongPress={() => handleLongPress(index)}
      >
        {isVideo ? (
          <View style={styles.videoContainer}>
            <Video
              ref={el => (videoRefs.current[index] = el)}
              source={{ uri: item.url }}
              style={[styles.media, isSelected && styles.selectedOverlay]}
              resizeMode="cover"
              useNativeControls
              shouldPlay={false}
              isLooping={false}
            />
          </View>
        ) : (
          <Image source={{ uri: item.url }} style={[styles.media, isSelected && styles.selectedOverlay]} />
        )}
        {isSelectionMode && (
          <View style={styles.selectionOverlay}>
            <Icon name={isSelected ? "checkmark-circle" : "ellipse-outline"} size={30} color={isSelected ? Colors.themcolor : "gray"} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
    return data;
  };

  const renderFormattedItem = ({ item, index }) => {
    if (item.empty) {
      return <View style={[styles.mediaContainer, styles.invisible]} />;
    }
    return renderItem({ item, index });
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedItems([]);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <FlatList
          data={formatData(mediaFiles, 3)}
          renderItem={renderFormattedItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>Empty</Text>}
        />
        {walletAddress && !isSelectionMode && (
          <View style={styles.plusMenuContainer}>
            <PlusMenu walletAddress={walletAddress} onMediaUpload={loadMedia} />
          </View>
        )}
        {isSelectionMode && (
          <View style={styles.selectionMenu}>
            <TouchableOpacity style={styles.selectionButton} onPress={exitSelectionMode}>
              <Icon name="close-circle" size={25} color="gray" />
              <Text style={styles.selectionButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectionButton} onPress={handleSubmit}>
              <Icon name="download" size={25} color="gray" />
              <Text style={styles.selectionButtonText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectionButton} onPress={handleSubmit}>
              <Icon name="share-social" size={25} color="gray" />
              <Text style={styles.selectionButtonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectionButton} onPress={handleSubmit}>
              <Icon name="trash" size={25} color="gray" />
              <Text style={styles.selectionButtonText}>Trash</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectionButton} onPress={handleSubmit}>
              <Icon name="star" size={25} color="gray" />
              <Text style={styles.selectionButtonText}>Favorite</Text>
            </TouchableOpacity>
          </View>
        )}
        <ImageViewing
          images={images.map(file => ({ uri: file.url }))}
          imageIndex={currentIndex}
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    justifyContent: 'center',
    alignContent: 'center',
    padding: 10,
  },
  mediaContainer: {
    borderWidth: 0.2,
    padding:0.1,
    flex: 1,
    borderRadius: 5,
    margin: 5,
    height: Dimensions.get('window').width / 3 - 10,
  },
  invisible: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  media: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    borderWidth: 0.2,
  },
  selectedMedia: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  selectedOverlay: {
    opacity: 0.5,
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 1,
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
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 15,
    top: 248,
  },
});

export default MediaScreen;
