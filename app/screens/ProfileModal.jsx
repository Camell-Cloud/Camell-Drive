import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

const ProfileModal = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(-height)).current;
  const [userPhoto, setUserPhoto] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  const pickImageFromGallery = async () => {
    // 갤러리 접근 권한 요청
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('갤러리에 접근하기 위한 권한이 필요합니다.');
      return;
    }
  
    // 갤러리에서 이미지 선택
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.cancelled) {
      console.log(result.uri);
    }
  };


  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser
    if (currentUser) {
      setUserPhoto(currentUser.photoURL);
      setUserEmail(currentUser.email);
    }
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -height,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <Animated.View
          style={[styles.modalView, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.header}>
            {userPhoto ? (
              <Image source={{ uri: userPhoto }} style={styles.profilePicture} />
            ) : (
              <Ionicons name="person-circle" size={80} color="black" />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={30} color="black" />
            </TouchableOpacity>
            <View style={styles.headerBottom}>
              <Text style={styles.emailText}>{userEmail}</Text>
            </View>
          </View>

          <View style={styles.body}>
            <TouchableOpacity style={styles.menu} onPress={pickImageFromGallery}>
              <Ionicons name="image" size={20} color="#828282" />
              <Text style={styles.menuText}>프로필 사진 변경</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menu} onPress={() => console.log('도움말')}>
              <Ionicons name="help-circle" size={20} color="#828282" />
              <Text style={styles.menuText}>도움말</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menu} onPress={() => console.log('도움말')}>
              <Ionicons name="help-circle" size={20} color="#828282" />
              <Text style={styles.menuText}>도움말</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}></View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    height: height * 0.4, // Reduced height for the modal
    width: width * 0.9, // Adjust width based on screen size
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flex: 1.5,
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    paddingBottom: 50,
  },
  headerBottom: {
    marginTop: 10,
  },
  emailText: {
    fontSize: 15,
  },
  closeButton: {
    position: 'absolute',
    right: 0, // Position the close button to the right side
    top: 0,
    padding: 10,
  },
  body: {
    flex: 3,
    justifyContent: 'center',
    width: '100%',
    borderTopWidth: 0.7,
  },
  menu: {
    flexDirection: 'row',
    width: '90%',
    padding: 12,
    marginBottom: 7.5,
  },
  menuText: {
    marginLeft: 10,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 15
  }
});

export default ProfileModal;