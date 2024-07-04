import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../Utils/colors';
import ProfileModal from '../screens/ProfileModal';
import { useUser } from '@clerk/clerk-react';

const CustomHeader = ({ title, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);  // Modal visibility
  const [sortType, setSortType] = useState('name');
  const [ascending, setAscending] = useState(true);
  const [userPhoto, setUserPhoto] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const currentUser = user.primaryEmailAddress.emailAddress;
    const userImg = user.imageUrl
    if (currentUser) {
      setUserPhoto(userImg);
    }
  }, []);

  const toggleSortType = (type) => {
    if (type === sortType) {
      setAscending(!ascending);
    } else {
      setSortType(type);
      setAscending(false);
    }
  };

  const getIcon = (type) => {
    return type === sortType ? (ascending ? 'chevron-up-outline' : 'chevron-down-outline') : 'chevron-up-outline';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="menu" size={30} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>


        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {userPhoto ? (
            <Image source={{ uri: userPhoto }} style={styles.profilePicture} />
          ) : (
            <Ionicons name="person-circle" size={35} color="black" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.controlsContainer}>
      <ProfileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        navigation={navigation} // navigation 객체를 전달
      />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background,
  },
  headerContainer: {
    marginTop: Platform.select({

    }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 70,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  sortOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 1,
  },

  profilePicture: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  homeandpro:{
    alignItems: 'center',
    flexDirection: 'row',
  }
});

export default CustomHeader;