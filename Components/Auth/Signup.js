
import { View, Text, StyleSheet, TextInput,Pressable, Image, SafeAreaView, Platform } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../Components/Colors';
import TermsOfServiceModal from '../../Components/Auth/TermsOfServiceModal';
import PrivateKeyModal from '../../Components/Auth/PrivateKeyModal';

export default function Signup({navigation, setIsAuthenticated}){

    const [userName, setUserName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [privateKeyModalvisible, setPrivateKeyModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function checkUsername(){
      const response = await fetch("http://13.124.248.7:3000/auth/signup/checkUsername", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ userName }),
      })
      // username 중복 없으면
      if(response.ok){ setModalVisible(true) }
      // username 중복 있으면
      else { setErrorMessage("사용중인 이름입니다") }
    }
    
    async function postUserName(){
    }

    return(
        <View>
            {/* 유저 이름 */}
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                <Text style={{fontSize: 16,}}>Create a username.</Text>
                <Text style={{fontSize: 12, color: 'gray'}}>Only letters and numbers are allowed.</Text>
            </View>

            <View style={styles.inputContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {userName === '' && (
                    <Text style={styles.placeholder}>Between 5 and 20 characters</Text>
                    )}
                    <TextInput
                        style={styles.input}
                        value={userName}
                        onChangeText={setUserName}
                        placeholderTextColor="transparent"
                    />
                </View>

                {errorMessage !== '' && (
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                )}
            </View>
            
            {/* 유저 이름 생성하면 약관동의 뜨기 */}
            <View style={styles.nextButtonContainer}>
                <Pressable style={styles.nextButton} onPress={() => checkUsername()}>
                    <Text style={styles.nextButtonText}>Create</Text>
                </Pressable>
            </View>


            {/* 약관 동의 */}
            <TermsOfServiceModal 
                modalVisible={modalVisible} 
                setModalVisible={setModalVisible} 
                userName={userName} 
                setPrivateKeyModalVisible={setPrivateKeyModalVisible}
            />

            <PrivateKeyModal
                PrivateKeyModalVisible={privateKeyModalvisible} 
                setPrivateKeyVisible={setPrivateKeyModalVisible}
                userName = {userName}
                navigation={navigation}
                setIsAuthenticated={setIsAuthenticated}
            />

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.authBackground,
        paddingHorizontal: 10,
        paddingVertical: 20,
        flex: 1,
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
        borderColor: 'gray',
        paddingHorizontal: 10,
        paddingVertical: 14,
      },
      placeholder: {
        position: 'absolute',
        left: 10,
        top: 10,
        fontSize: 14,
        color: 'gray',
      },
    inputContainer: {
        marginTop: 5,
    },
    backButtonContainer: {
        alignSelf: 'flex-start',
        marginTop: 20,
        marginBottom: 20,
      },
      
      backButton: {
        padding: 3,
      },
      nextButtonContainer: {
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'flex-end'
      },
    
      nextButton: {
        borderColor: Colors.primary400,
        borderWidth: 1,
        backgroundColor: Colors.authBackground,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
      },
    
      nextButtonText: {
        color: Colors.primary400,
        fontSize: 16,
        
      },
      imageContainer: {
        bottom: 0,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      logo: {
        width: 50,
        height: 50,
        marginRight: 5,
      },
      logoText: {
        marginLeft: 5,
        color: Colors.primary400,
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
        shadowColor: 'black',
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
