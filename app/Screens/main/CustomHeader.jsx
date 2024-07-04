import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../Utils/colors';
import SearchBar from './SearchBar';
import ProfileModal from '../screens/ProfileModal';
import { useUser } from '@clerk/clerk-react';

const CustomHeader = ({ title, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);  // Modal visibility
  const [sortType, setSortType] = useState('name');
  const [ascending, setAscending] = useState(true);
  const [viewMode, setViewMode] = useState('list');
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
          <Ionicons name="menu" size={30} color="black"/>
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
      <SearchBar onSearch={(query) => console.log('Searching:', query)} />
      <View style={styles.controlsContainer}>
        <View style={styles.sortOptions}>
          {/* 정렬 옵션 */}
          <TouchableOpacity style={styles.sortButton} onPress={() => toggleSortType('name')}>
            <Text style={styles.sortButtonText}>name</Text>
            <Ionicons name={getIcon('name')} size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortButton} onPress={() => toggleSortType('date')}>
            <Text style={styles.sortButtonText}>date</Text>
            <Ionicons name={getIcon('date')} size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortButton} onPress={() => toggleSortType('size')}>
            <Text style={styles.sortButtonText}>size</Text>
            <Ionicons name={getIcon('size')} size={20} color="black" />
          </TouchableOpacity>
        </View>
        <ProfileModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
        {/* 뷰 모드 변경 버튼 */}
        <TouchableOpacity style={styles.viewModeButton} onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}>
          <Ionicons name={viewMode === 'list' ? 'grid-outline' : 'list-outline'} size={20} color="black" />
        </TouchableOpacity>
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
      android: 24,  // 안드로이드의 경우 marginTop을 24로 설정
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
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20, // 좌우 마진을 증가
    fontSize: 10,
  },
  sortButtonText: {
    marginRight: 5,
    fontSize: 12,
  },
  viewModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  homeButton: {
    marginRight: 20,
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