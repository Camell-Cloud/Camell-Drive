import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput, StyleSheet, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { MaterialIcons, Foundation } from '@expo/vector-icons';
import { Colors } from '../theme/color';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export default function PlusMenu({ walletAddress, currentFolder, onMediaUpload }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFolderDialogVisible, setIsFolderDialogVisible] = useState(false);
  const [folderName, setFolderName] = useState('');

  const handleSubmit = () => {
    alert('To be updated.');
  };

  const toggleMenuModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const createFolder = async () => {
    if (!walletAddress) {
      return;
    }

    let folderNameToCreate = folderName.trim() || 'New Folder';

    const fullPath = currentFolder ? `${currentFolder}/${folderNameToCreate}` : folderNameToCreate;
    console.log("경로 :", fullPath);

    try {
      const response = await fetch(`http://13.124.248.7:2005/api/create-folder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folderPath: fullPath,
          walletAddress
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('The folder was successfully created.');
        setIsFolderDialogVisible(false);
        setFolderName('');
      } else {
        alert('Failed to create folder: ' + data.error);
      }
    } catch (error) {
      console.error('폴더 생성 오류:', error);
      alert('Error creating folder.');
    }
  };

  const selectDoc = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });
      if (result.assets[0].uri) {
        const uri = result.assets[0].uri;
        const fileName = result.assets[0].name;
        const mimeType = result.assets[0].mimeType;
        const formData = new FormData();
        formData.append('file', {
          uri,
          type: mimeType,
          name: fileName,
        });
        formData.append('walletAddress', walletAddress);
        formData.append('folderPath', currentFolder || '');

        try {
          const uploadResponse = await fetch('http://13.124.248.7:8080/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          });
          const uploadData = await uploadResponse.json();
          if (uploadData.success) {
            Alert.alert('Success', 'File uploaded successfully.');
            onMediaUpload();
          } else {
            console.error('파일 업로드 오류:', uploadData.error);
            Alert.alert('Failed', `File upload error: ${uploadData.error}`);
          }
        } catch (error) {
          console.error('API 오류:', error);
          Alert.alert('Failed', 'File upload error.');
        }
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };

  const uploadMediaFile = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('You need permission to access the gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const fileName = uri.split('/').pop();
      const mimeType = asset.type;

      try {
        const formData = new FormData();
        formData.append('fileContent', {
          uri,
          type: mimeType,
          name: fileName,
        });
        formData.append('walletAddress', walletAddress);
        formData.append('currentFolder', currentFolder || '');
        formData.append('fileName', fileName);

        const uploadResponse = await fetch('http://13.124.248.7:2005/api/mediaupload-file', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          Alert.alert('Success', 'Media file uploaded successfully.');
          onMediaUpload(); // Refresh media list after successful upload
        } else {
          console.error('미디어 파일 업로드 오류:', uploadData.error);
          Alert.alert('Failed', `Media File Upload Error: ${uploadData.error}`);
        }
      } catch (error) {
        console.error('API 오류:', error);
        Alert.alert('Failed', 'Media File Upload Error.');
      }
    } else {
      console.log('취소')
    }
  };

  const toggleFolderDialog = () => {
    setIsFolderDialogVisible(!isFolderDialogVisible);
    setIsModalVisible(!isModalVisible);
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
                label="Upload file"
                onPress={async () => {
                  await selectDoc();
                  toggleMenuModal();
                }}
              />
              <MenuItem
                icon={<MaterialIcons name="add-photo-alternate" size={24} color="gray" />}
                label="Upload media"
                onPress={uploadMediaFile}
              />
              <MenuItem
                icon={<Foundation name="folder-add" size={22} color="gray" />}
                label="Create folder"
                color="black"
                onPress={toggleFolderDialog}
              />
              <MenuItem
                icon={<MaterialIcons name="add-a-photo" size={22} color="gray" />}
                label="Photo shoot"
                onPress={handleSubmit}
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
            <View style={{ flex: 1.7 }}>
              <Text>New Folder</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Folder name"
              value={folderName}
              onChangeText={setFolderName}
            />
            <View style={styles.dialogButtons}>
              <TouchableOpacity onPress={createFolder} style={styles.dialogButton}>
                <Text style={styles.dialogbuttonText}>Create</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleFolderDialog} style={styles.dialogButton}>
                <Text style={styles.dialogbuttonText}>Cancil</Text>
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
    height: '20%',
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