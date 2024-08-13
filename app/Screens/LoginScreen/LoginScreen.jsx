import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import React, { useCallback } from 'react';
import { defaultStyles } from '../Utils/Styles';
import * as WebBrowser from 'expo-web-browser';
import { useWarmUpBrowser } from '../../hooks/useWarmUpBrowser';
import { useOAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
    useWarmUpBrowser();
    const redirectUrl = Linking.createURL('/');
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google", redirectUrl });

    const onGooglePress = useCallback(async () => {
        try {
            console.log("Starting OAuth flow...");
            const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();
            console.log("OAuth flow completed", { createdSessionId, signIn, signUp });
    
            // 여러 위치에서 이메일 정보 시도
            const email = signUp?.emailAddress || signIn?.userData?.email_address || signIn?.userData?.email || signIn?.emailAddress || null;
    
            if (email) {
                const uuid = uuidv4();
                const s3FolderName = `user-${uuid}`;
                await AsyncStorage.setItem('userEmail', email);
                await AsyncStorage.setItem('uuid', uuid);
                await AsyncStorage.setItem('s3FolderName', s3FolderName);
                await AsyncStorage.setItem('isLoggedIn', 'true');
    
                // 백엔드로 데이터 전송
                await fetch('https://your-backend-url/api/save-user-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, uuid, s3FolderName }),
                });
    
                console.log('Email, UUID, and S3 Folder Name stored and sent to backend:', email, uuid, s3FolderName);
            } else {
                console.log('No email retrieved, but login successful');
                await AsyncStorage.setItem('isLoggedIn', 'false');
            }
    
            const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
            console.log("isLoggedIn after login:", isLoggedIn);
    
        } catch (err) {
            console.error("OAuth error", err);
        }
    }, [startOAuthFlow]);
    
    

    return (
        <View style={defaultStyles.container}>
            <Text style={defaultStyles.header}>Welcome Back to</Text>
            <Text style={defaultStyles.logo}>Camell Drive</Text>

            <View style={styles.logoContainer}>
                <Image
                    source={require('../../../assets/images/logo.png')}
                    style={styles.logo}
                />
            </View>

            <TouchableOpacity
                style={[defaultStyles.pillButton, {
                    flexDirection: 'row',
                    gap: 16,
                    marginTop: 20,
                    backgroundColor: '#E1E4EC'
                }]}
                onPress={onGooglePress}
            >
                <Image
                    source={require('../../../assets/icons/google-icon.png')}
                    style={{ width: 24, height: 24 }}
                />
                <Text style={[defaultStyles.buttonText, { color: '#000' }]}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[defaultStyles.pillButton, {
                    flexDirection: 'row',
                    gap: 16,
                    marginTop: 20,
                    backgroundColor: '#F6F60A'
                }]}
                onPress={() => Alert.alert('To be updated...')}
            >
                <Image
                    source={require('../../../assets/icons/kakao-icon.png')}
                    style={{ width: 24, height: 24 }}
                />
                <Text style={[defaultStyles.buttonText, { color: '#000' }]}>Continue with Kakao</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' ? (
                <TouchableOpacity
                    style={[defaultStyles.pillButton, {
                        flexDirection: 'row',
                        gap: 16,
                        marginTop: 20,
                        backgroundColor: '#000000'
                    }]}
                    onPress={() => Alert.alert('To be updated...')}
                >
                    <Image
                        source={require('../../../assets/icons/apple-icon.png')}
                        style={{ width: 25, height: 25 }}
                    />
                    <Text style={[defaultStyles.buttonText2, { color: '#FFF' }]}>Continue with Apple</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={[defaultStyles.pillButton, {
                        flexDirection: 'row',
                        gap: 16,
                        marginTop: 20,
                        backgroundColor: '#0866FF'
                    }]}
                    onPress={() => Alert.alert('To be updated...')}
                >
                    <Image
                        source={require('../../../assets/icons/facebook-icon.png')}
                        style={{ width: 30, height: 30 }}
                    />
                    <Text style={[defaultStyles.buttonText2, { color: '#FFF' }]}>Continue with Facebook</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    logo: {
        marginTop: 40,
        marginBottom: 40,
        width: 200,
        height: 200,
    },
});

export default LoginScreen;
