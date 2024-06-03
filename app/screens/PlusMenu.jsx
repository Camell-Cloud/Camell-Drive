import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import {  MaterialIcons, Foundation } from '@expo/vector-icons';
import { Colors } from '../theme/color';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';



export default function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFolderDialogVisible, setIsFolderDialogVisible] = useState(false);
  const [folderName, setFolderName] = useState('');

  const toggleMenuModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // 모달 외부를 눌렀을 때 모달을 닫는 함수
  const closeModal = () => {
    setIsModalVisible(false);
  };

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
      // 선택된 이미지 처리 (예: 상태 업데이트 또는 업로드)
      console.log(result.uri);
    }
  };

  const toggleFolderDialog = () => {
    setIsFolderDialogVisible(!isFolderDialogVisible);
    setIsModalVisible(!isModalVisible);

  };

  const createFolder = () => {
    console.log("폴더 생성:", folderName);
    // 폴더 생성 로직 구현
    setFolderName('');
    toggleFolderDialog();
  };

  const selectDoc = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });
      if (result.type === "success") {
        console.log(result.uri);
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenuModal} style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleMenuModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalMenu}>
              <MenuItem
                  icon={<MaterialIcons name="note-add" size={22} color="gray" />}
                  label="파일 업로드"
                  onPress={ async () => {
                    await selectDoc();
                    toggleMenuModal();
                  }}
                />
              <MenuItem
                icon={<MaterialIcons name="add-photo-alternate" size={24} color="gray" />}
                label="미디어 업로드"
                onPress={pickImageFromGallery}
              />
              <MenuItem
                icon={<Foundation name="folder-add" size={22} color="gray" />}
                label="폴더 생성"
                color="black"
                onPress={toggleFolderDialog}
              />
              <MenuItem
                icon={<MaterialIcons name="add-a-photo" size={22} color="gray" />}
                label="사진 촬영"
                onPress={() => console.log("사진 촬영")}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


      <Modal

        transparent={true}
        visible={isFolderDialogVisible}
        onRequestClose={toggleFolderDialog}
      >
        <View style={styles.dialogOverlay}>
          <View style={styles.dialog}>
            <View style={{flex: 1.7,}}>
              <Text>새 폴더</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="제목 없는 폴더"
              value={folderName}
              onChangeText={setFolderName}
            />
            <View style={styles.dialogButtons}>
            <TouchableOpacity onPress={createFolder} style={styles.dialogButton}>
              <Text style={styles.dialogbuttonText}>만들기</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleFolderDialog} style={styles.dialogButton}>
              <Text style={styles.dialogbuttonText}>취소</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function MenuItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <Text style={styles.buttonText}>{icon}</Text>
      <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  button: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.themcolor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 35,
  },
  menuLabel: {
    fontSize: 13,
    color: '#000',
    marginTop: 5,
    marginLeft: 13,
  },
  modalOverlay: {
    flex: 1,


    justifyContent: 'flex-end',

    // backgroundColor: 'rgba(0, 0, 0, 0.15)',  // 모달 외부의 반투명 배경
  },
  modalMenu: {
    borderWidth: 0.2,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  dialogOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  dialog: {
    width: '60%',
    height: '16%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.themcolor,
    marginBottom: 20,
    fontSize: 16,
    padding: 10,

  },
  dialogButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',

    width: '100%',
  },
  dialogButton: {
    color: Colors.themcolor,
  },
  dialogbuttonText: {
    color: Colors.themcolor,
    marginLeft: 30,
  }
});
