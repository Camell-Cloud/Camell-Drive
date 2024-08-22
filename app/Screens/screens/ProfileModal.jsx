import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Image, Clipboard, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { useUser, useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const ProfileModal = ({ visible, onClose, navigation }) => {
  const slideAnim = useRef(new Animated.Value(-height)).current;
  const [userPhoto, setUserPhoto] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const { user } = useUser();
  const { signOut } = useAuth();
  const [balance, setBalance] = useState('0.0');
  const [walletAddress, setWalletAddress] = useState('');

  const handleSubmit = () => {
    alert('To be updated');
  };

  const handleNavigation = (path) => {
    console.log(`Navigating to ${path}`);
    if (navigation) {
      navigation.navigate(path);
    } else {
      console.error('Navigation is undefined');
    }
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

  useEffect(() => {
    if (walletAddress) {
      axios.get(`http://43.201.64.232:1234/wallet-balance?wallet_address=${walletAddress}`)
        .then(response => {
          if (response.data.balance) {
            setBalance(response.data.balance.toString());
          } else if (response.data.error) {
          }
        })
        .catch(error => {
          console.log("잔액을 불러오는데 실패했습니다.:", error);
        });
    }
  }, [walletAddress]);

  const copyToClipboard = (address) => {
    Clipboard.setString(address);
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

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

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Do you want to log out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout cancelled"),
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await signOut();
              await AsyncStorage.removeItem('userEmail');
              await AsyncStorage.removeItem('sessionId');
              await AsyncStorage.setItem('isLoggedIn', 'false');
              onClose(); // Close the modal after logout
            } catch (error) {
              console.error('Failed to sign out', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    if (user && user.primaryEmailAddress && user.imageUrl) {
      const currentUser = user.primaryEmailAddress.emailAddress;
      const userImg = user.imageUrl;
      if (currentUser) {
        setUserPhoto(userImg);
        setUserEmail(currentUser);
      }
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
              <Text style={{ color: 'green', fontSize: 12, marginRight: 10, }}>Connected</Text>
            </View>
            <View style={styles.wallet}>
              <Text style={{ fontWeight: 'bold' }}>
                {parseFloat(balance).toLocaleString('ko-KR')} CAMT
              </Text>
            </View>
          </View>

          <View style={styles.body}>
            <TouchableOpacity style={styles.menu} onPress={handleSubmit}>
              <Ionicons name="image" size={20} color="#828282" />
              <Text style={styles.menuText}>Change profile picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menu} onPress={handleSubmit}>
              <Ionicons name="help-circle" size={20} color="#828282" />
              <Text style={styles.menuText}>Help</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menu} onPress={handleSubmit}>
              <FontAwesome name="cog" size={20} color="#828282" />
              <Text style={styles.menuText}>Setting</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menu} onPress={handleLogout}>
              <Ionicons name="log-out" size={20} color="#828282" />
              <Text style={styles.menuText}>Logout</Text>
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
    height: height * 0.45,
    width: width * 0.9,
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
    width: '100%',
    position: 'relative',
    paddingBottom: 90,
    padding: 10,
  },
  headerBottom: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emailText: {
    fontSize: 13,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 10,
  },
  body: {
    flex: 3,
    justifyContent: 'center',
    width: '100%',
  },
  menu: {
    flexDirection: 'row',
    width: '90%',
    padding: 8,
  },
  menuText: {
    marginLeft: 10,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 15,
  },
  wallet: {
    borderWidth: 0.3,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  transactionModalView: {
    height: height * 0.6,
    width: width * 0.9,
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
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: '#000',
    marginTop: 8,
    width: '100%',
  },
  profilePic: {
    marginRight: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  walletAddress: {
    fontSize: 13,
    color: '#333',
  },
  date: {
    fontSize: 11,
    color: '#666',
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyIcon: {
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default ProfileModal;
