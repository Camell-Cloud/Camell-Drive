import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Video, ResizeMode } from 'expo-av';
import Color from '../Utils/Color';
import { useAssets } from 'expo-asset';

export default function StartPage({ navigation }) {
  const [assets] = useAssets([require('../../../assets/videos/intro.mp4')]);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <View style={{
      flex: 1,
      justifyContent: 'space-between'
    }}>
      <StatusBar hidden />
      {assets && (
        <Video
          isMuted
          style={styles.video}
          source={{ uri: assets[0].uri }}
          shouldPlay
          isLooping
          resizeMode={ResizeMode.COVER}
          onLoad={() => setIsVideoLoaded(true)}
        />
      )}
      {!isVideoLoaded && (
        <ActivityIndicator size="large" color={Color.primary} style={styles.loader} />
      )}
      <View style={{ marginTop: 80, padding: 20 }}>
        <Text style={styles.header}>
          Camell
        </Text>
        <Text style={styles.header}>
          Drive
        </Text>
        <Text style={styles.header2}>
          Cloud Storage
        </Text>
        <Text style={styles.header2}>
          Platform
        </Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.pillButton, { flex: 1, backgroundColor: Color.primary }]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={{ color: 'white', fontSize: 24, fontWeight: '900' }}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  video: {
    height: '100%',
    width: '100%',
    position: 'absolute'
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }]
  },
  header: {
    fontSize: 62,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: Color.white
  },
  header2: {
    fontSize: 36,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: Color.white
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  pillButton: {
    padding: 10,
    height: 60,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
