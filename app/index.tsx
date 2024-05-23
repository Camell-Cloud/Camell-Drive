import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useAssets } from 'expo-asset';
import { ResizeMode, Video } from 'expo-av';
import { Link, SplashScreen } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

const Main = () => {
  const [ assets ] = useAssets([require('@/assets/videos/intro.mp4')]);

  SplashScreen.hideAsync();

  return (
    <View style={styles.container}>
      { assets && (
        <Video 
        isMuted
        isLooping
        shouldPlay
        source={{ uri: assets[0].uri }} style={styles.video}
        resizeMode={ResizeMode.COVER} />
      )}
      <View style={{ marginTop: 80, padding: 20 }}>
        <Text style={styles.header}>
          Camell
        </Text>
        <Text style={styles.header}>
          Drive
        </Text>
        <Text style={styles.header2}>
          클라우드 스토리지
        </Text>
        <Text style={styles.header2}>
          플렛폼
        </Text>
      </View>
      <View style={styles.buttons}>
        <Link href={'/login/login'} style={[defaultStyles.pillButton, { flex: 1, backgroundColor: Colors.primary }]} asChild>
          <TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: '900' }}>로그인</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  header: {
    fontSize: 62,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: 'white'
  },
  header2: {
    fontSize: 36,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: 'white'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 60,
    paddingHorizontal: 20,
  }
});

export default Main;