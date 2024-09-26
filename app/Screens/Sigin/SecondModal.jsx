
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Clipboard } from 'react-native';  // 기본 API 사용
import AsyncStorage from '@react-native-async-storage/async-storage'; // 자동 로그인 위한 저장소 추가



export default function SecondModal({ secondModalVisible, setSecondModalVisible, navigation, privateKey, username }) {

  const copyToClipboard = () => {
    Clipboard.setString(privateKey);  // privateKey를 클립보드에 복사
    alert('Private key copied to clipboard!');
  };

  const saveDataToDatabase = async () => {
    try {
      const response = await fetch('http://13.124.248.7:1212/save-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,  // 전달된 username 사용
          privateKey: privateKey,
          CAMT_amount: 0,
          S3FolderName: `${username}/`,  // S3FolderName에 username/ 형식으로 저장
        }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        // 기기에 privateKey와 username 저장 -> 다음부터 자동 로그인 가능
        await AsyncStorage.setItem('privateKey', privateKey);
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('isLoggedIn', 'true')
        console.log('Private key and username saved for auto login.');
        navigation.navigate('Drawer');
      } else {
        Alert.alert("Error", "저장 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  


  return (
    <Modal
      transparent={true}
      visible={secondModalVisible}
      onRequestClose={() => setSecondModalVisible(false)}
    >

      <View style={styles.modalBackground}>
        <View style={styles.modalView}>

            <View style={styles.top}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Private Key</Text>

                    <View style={styles.privateContainer}>
                        <View style={styles.privateTextContainer}>
                          <Text style={styles.privateText}>{privateKey}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.iconContainer} onPress={copyToClipboard}>
                    <Icon name="content-copy" size={18} color="gray" style={styles.icon} />
                  </TouchableOpacity>
                  <View style={styles.warningTextContainer}>
                    <View style={{ width: '100%', alignItems: 'center',justifyContent: 'center'}}>

                        <Icon name="warning" size={24} color="gray" style={styles.warningIcon} />
                    </View>
                      <Text style={styles.warningText}>1. Do not share your Private Key with anyone. Anyone with this key can access your account and assets.</Text>
                      <Text style={styles.warningText}>2. Your Private Key is your only access to your account. If you lose it, recovery is impossible.</Text>
                      <Text style={styles.warningText}>3. Copy and back up your private key.</Text>
                    </View>
                </View>

                <View style={styles.midTextContainer}>
                </View>
            </View>

            <View style={styles.bottom}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.navigate('Pin')}
                    >
                    <Text style={styles.closeButtonText}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: '#E45E7E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,

  },
  top: {
    flex: 3,

    height: '100%',
    width: '100%'
  },
  
  titleContainer: {
    flex: 1,

    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  privateContainer:{
    flex: 0.4,
    borderWidth: 0.5,
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  privateTextContainer: {
    padding: 10,
  },
  privateText: {
    fontSize: 12,

  },
  buttonContainer: {
    flex: 2,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  bottom: {
    flex: 0.7,
    width: '100%',
    height: '100%,',
    justifyContent: 'flex-end',
    padding: 10,
  },

  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  icon: {
    borderWidth: 0.5,
    padding: 10,
    borderRadius: 100,
    position: 'relative',
  },
  warningIcon: {
    marginBottom: 10,
  },
  
  warningTextContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  
  warningText: {
    fontSize: 12,
    marginVertical: 5,
  },
  
});
