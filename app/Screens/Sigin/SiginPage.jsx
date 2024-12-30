
import { View, Text, StyleSheet, TextInput,TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'; // 아이콘 사용
import ModalComponent from './ModalComponent';
import { v4 as uuidv4 } from 'uuid'; // uuid 라이브러리 사용
import SecondModal from './SecondModal'; // 두 번째 모달
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SiginPage({ navigation }) {
    const [text, setText] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태
    const [modalVisible, setModalVisible] = useState(false); // 모달 가시성 상태 관리
    const [secondModalVisible, setSecondModalVisible] = useState(false); // 두 번째 모달 상태
    const [privateKey, setPrivateKey] = useState(''); // 생성된 private key 저장

    const validateUsername = () => {
      const usernameRegex = /^[a-zA-Z0-9]{5,20}$/;
      if (text.length < 5 || text.length > 20) {
        setErrorMessage('Username must be between 5 and 20 characters.');
        return false;
      } else if (!usernameRegex.test(text)) {
        setErrorMessage('Only letters and numbers are allowed.');
        return false;
      }
      setErrorMessage(''); // 조건을 충족하면 에러 메시지 삭제
      return true;
    };

    const checkDuplicateAndProceed = async () => {
      // 유효성 검사 먼저 수행
      if (!validateUsername()) {
        return; // 유효성 검사를 통과하지 못하면 함수 종료
      }
    
      try {
        // 중복 확인 요청
        const response = await fetch('http://13.124.248.7:1212/check-username', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: text,
          }),
        });
    
        const result = await response.json();
    
        if (result.exists) {
          // 중복된 아이디가 있을 경우 메시지 표시
          setErrorMessage("Username already exists.");
        } else {
          // 중복되지 않으면 uuid로 private key 생성
          const newPrivateKey = uuidv4(); // uuid로 private key 생성
    
          // 생성된 프라이빗 키와 함께 임시 저장 API 호출
          const tempSaveResponse = await fetch('http://13.124.248.7:1212/save-temp-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: text,
              private_key: newPrivateKey, // 생성된 private_key 서버로 전
            }),
          });
    
          const tempSaveResult = await tempSaveResponse.json();
    
          if (tempSaveResult.success) {
            // 임시 저장 성공 시 프라이빗 키를 저장하고 모달 표시
            setPrivateKey(newPrivateKey);   // 생성된 private key 저장
            await AsyncStorage.setItem('username', text);
            await AsyncStorage.setItem('privateKey', newPrivateKey);
            await AsyncStorage.setItem('isLoggedIn', 'true');
            setModalVisible(true);          // 첫 번째 모달 열기
          } else {
            // 임시 저장 실패 시 오류 메시지
            setErrorMessage("임시 저장 중 오류가 발생했습니다: " + tempSaveResult.message);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    

  return (
    <View style={styles.container}>
        <View style={styles.mainContainer}>
            <View style={styles.backButtonContainer}>
                <TouchableOpacity 
                  style={styles.backButton} 
                  onPress={() => navigation.navigate('Start')}
                  >
                  <Icon name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.sigin}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                    <Text>Create a username.</Text>
                    <Text style={{fontSize: 10, color: 'gray'}}>Only letters and numbers are allowed.</Text>
                </View>
                <View style={styles.inputContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {text === '' && (
                  <Text style={styles.placeholder}>Between 5 and 20 characters</Text>
                )}
                <TextInput
                  style={styles.input}
                  value={text}
                  onChangeText={setText}
                  placeholderTextColor="transparent"
                />
                </View>
                {errorMessage !== '' && (
                  <Text style={styles.errorMessage}>{errorMessage}</Text>
                )}
          </View>
          <View style={styles.nextButtonContainer}>
            <TouchableOpacity style={styles.nextButton} onPress={checkDuplicateAndProceed}>
              <Text style={styles.nextButtonText}>Create</Text>
            </TouchableOpacity>
          </View>


          <ModalComponent
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            setSecondModalVisible={setSecondModalVisible} // 두 번째 모달 상태 전달
            />

          <SecondModal
            secondModalVisible={secondModalVisible}
            setSecondModalVisible={setSecondModalVisible}
            navigation={navigation}  // navigation 전달
            username={text}
            privateKey={privateKey}  // 생성된 privateKey 전달
          />


          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <View style={styles.imageContainer}>
                <Image
                source={require('../../../assets/images/camell_logo.png')} // 로컬 이미지
                style={styles.logo}
                />
                <Text style={styles.logoText}>Camell Drive</Text>
            </View>
          </View>

            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f4ecf0',
        padding: 10,
        flex: 1
    },

    mainContainer: {
        flex: 1,
    },

    sigin: {
        flex: 1,
        padding: 10,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 0.5,
        borderRadius: 5,
        paddingHorizontal: 10,
      },
      placeholder: {
        position: 'absolute',
        left: 10,
        top: 10,
        fontSize: 12,
        color: 'gray',
      },
    inputContainer: {
        marginTop: 5,
    },
    backButtonContainer: {
        marginTop: 5,  // 여백 제거
        padding: 0,    // 여백 제거
        alignSelf: 'flex-start', // 왼쪽으로 배치
      },
      
      backButton: {
        padding: 3, // 버튼 자체의 여백 제거
      },
      nextButtonContainer: {
        marginTop: 15,
        justifyContent: 'center', // 세로 중앙 정렬
        alignItems: 'flex-end'
      },
    
      nextButton: {
        borderColor: '#E45E7E',
        borderWidth: 1,
        backgroundColor: '#f1e5e9',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
      },
    
      nextButtonText: {
        color: '#E45E7E',
        fontSize: 13,
        
      },
      imageContainer: {
        bottom: 0,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      logo: {
        width: 40,
        height: 40,
        marginRight: 5,
      },
      logoText: {
        marginLeft: 5,
        color: '#E45E7E',
        fontSize: 18,
      },

      modalBackground: {
        flex: 1,
        justifyContent: 'flex-end'
      },
    
      modalView: {
        height: '50%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
    
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
      },
      errorMessage: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
      },
});
