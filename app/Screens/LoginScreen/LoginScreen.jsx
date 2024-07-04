import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import React from 'react';
import { defaultStyles } from '../Utils/Styles';
import * as WebBrowser from 'expo-web-browser';
import { useWarmUpBrowser } from '../../hooks/useWarmUpBrowser';
import { useOAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
    useWarmUpBrowser();

    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const onGooglePress = React.useCallback(async () => {
        try {
            const { createdSessionId, signIn, signUp, setActive } =
                await startOAuthFlow();

                if (createdSessionId) {
                    setActive({ session: createdSessionId });
                    const email = signUp?.emailAddress || signIn?.emailAddress;
                    if (email) {
                        const response = await fetch('http://13.124.248.7:8080/api/create-wallet', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email }),
                        });
                        const data = await response.json();
                        if (data.success) {
                            console.log('Wallet created with address: ', data.walletAddress);
                            await AsyncStorage.setItem('userEmail', email);
                            await AsyncStorage.setItem('isLoggedIn', 'true');
                            console.log('Email: ', email);
                        } else {
                            console.error('Failed to create wallet', data.error);
                        }
                    } else {
                        // Just go in
                    }
                }
        } catch (err) {
            console.error("OAuth error", err);
        }
    }, []);

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
