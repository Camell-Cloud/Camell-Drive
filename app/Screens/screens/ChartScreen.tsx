import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { defaultStyles } from '../Utils/Styles';
import Colors from '../Utils/Color';

const ChartScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Wallet')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={36} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <View>
          <Text style={styles.title}>CAMELL</Text>
          <Text style={styles.subtitle}>CAMT</Text>
        </View>
        <Image
          source={require('../../../assets/images/coin.png')}
          style={styles.logo}
        />
      </View>
      <View style={[defaultStyles.block, { marginTop: 20 }]}>
        <Text style={styles.subtitle}>Chart</Text>
        <Image
          source={require('../../../assets/images/chart.png')}
          style={styles.chart}
        />
      </View>
      <View style={[defaultStyles.block, { marginTop: 20 }]}>
        <Text style={styles.subtitle}>Overview</Text>
        <Text style={{ color: Colors.gray }}>
          The Camell is an innovative endeavor that integrates cloud storage services with a blockchain token economy to establish a new business model. At the heart of the Camell project is the Camell Drive, a cloud storage platform based on AWS S3. This platform allows users to own independent cloud storage spaces by utilizing CAMT tokens.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  scrollContainer: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 0,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
  },
  logo: {
    width: 70,
    height: 70,
  },
  chart: {
    width: 350,
    height: 300,
  },
});

export default ChartScreen;
