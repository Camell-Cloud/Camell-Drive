import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../Utils/colors';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <Ionicons style={styles.searchIcon} name="search" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Search..."
            value={query}
            onChangeText={text => setQuery(text)}
            onSubmitEditing={() => onSearch(query)}
          />
        </View>
      </View>
      
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: Colors.background, // 바깥쪽 배경색
    paddingHorizontal: 20, // 좌우 마진
  },
  container: {
    flexDirection: 'row', // 아이콘과 입력 필드가 행으로 배열
    alignItems: 'center', // 요소들을 세로 중앙에 배치
    backgroundColor: '#fff', // 배경 색상
    marginTop: 1, // 상단 마진
    borderRadius: 20, // 경계선 둥글게 처리
    shadowOffset: { width: 0, height: 1 }, // 그림자 위치
    shadowOpacity: 0.1, // 그림자 투명도
    shadowRadius: 2, // 그림자 반경
    elevation: 5, // 안드로이드에서의 그림자 효과
    height: 40,
  },
  input: {
    flex: 1, // 남은 공간을 모두 차지
    marginLeft: 10, // 왼쪽 마진
    fontSize: 16, // 폰트 크기
  },
  searchIcon: {
    marginLeft: 15,
    color: '#000',
  }
});

export default SearchBar;