
import { View, Text, StyleSheet, TextInput,Pressable, Image, SafeAreaView, Platform } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../Components/Colors';
import TermsOfServiceModal from '../../Components/Auth/TermsOfServiceModal';
import PrivateKeyModal from '../../Components/Auth/PrivateKeyModal';
import Signup from '../../Components/Auth/Signup';

export default function SignupScreen({ navigation, setIsAuthenticated }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [privateKeyModalvisible, setPrivateKeyModalVisible] = useState(false);
    

  return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContainer}>
                <View style={styles.backButtonContainer}>
                    <Pressable style={styles.backButton} onPress={() => navigation.navigate('Start')}>
                        <Icon name="arrow-back" size={30} color="black" />
                    </Pressable>
                </View>
                <View style={styles.sigin}>

                    <Signup navigation={navigation} setIsAuthenticated={setIsAuthenticated} />

                    <View style={{flex: 1, justifyContent: 'flex-end'}}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require('../../assets/images/camell_logo.png')}
                                style={styles.logo}
                            />
                            <Text style={styles.logoText}>Camell Drive</Text>
                        </View>
                    </View>

                </View>
            </View>

        </SafeAreaView>
  );
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
