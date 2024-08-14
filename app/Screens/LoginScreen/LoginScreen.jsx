import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import React from 'react';
import { defaultStyles } from '../Utils/Styles';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
    const [userInfo, setUserInfo] = React.useState(null);
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '743275751573-gt78qf9t6l7abq6hevffofjnebgf54dl.apps.googleusercontent.com'
    });

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            getUserInfo(authentication.accessToken);
        }
    }, [response]);

    async function getUserInfo(token) {
        if (!token) return;
        try {
            const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const user = await response.json();
            if (user.email) {
                await AsyncStorage.setItem('userEmail', user.email);
                await AsyncStorage.setItem('@user', JSON.stringify(user));
                console.log('User info saved:', user);
                setUserInfo(user);
                console.log('User email saved:', user.email);
            } else {
                console.error('Failed to retrieve email');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    }

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
                onPress={() => promptAsync()}
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
