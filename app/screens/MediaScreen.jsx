import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, Alert, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/color';
import PlusMenu from '../screens/PlusMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageViewing from 'react-native-image-viewing';

const fetchMedia = async (walletAddress) => {
  try {
    const response = await fetch(`http://13.124.248.7:2005/api/list-media?walletAddress=${walletAddress}`);
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
  };

  useEffect(() => {
    loadMedia();
  }, [walletAddress]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => {
        setCurrentIndex(index);
        setIsVisible(true);
      }}
    >
      <Image source={{ uri: item.url }} style={styles.image} />
    </TouchableOpacity>
  );

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
      return <View style={[styles.imageContainer, styles.invisible]} />;
    }
    return renderItem({ item, index });
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
          ListEmptyComponent={<Text style={{ fontSize: 15 }}>Empty</Text>}
        />
        {walletAddress && (
          <View style={styles.plusMenuContainer}>
            <PlusMenu walletAddress={walletAddress} onMediaUpload={loadMedia} />
          </View>
        )}
        <ImageViewing
          images={mediaFiles.map(file => ({ uri: file.url }))}
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
  imageContainer: {
    flex: 1,
    margin: 5,
    height: Dimensions.get('window').width / 3 - 10, // 3열로 만들기 위한 높이 설정

  },
  invisible: {
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    borderWidth: 0.2
  },
});

export default MediaScreen;
