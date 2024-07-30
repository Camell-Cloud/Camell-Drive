import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { CandlestickChart } from 'react-native-wagmi-charts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ChartScreen = () => {
  const navigation = useNavigation();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const response = await fetch('http://43.201.64.232:5000/gopax-chart');
      const data = await response.json();
      if (Array.isArray(data)) {
        const formattedData = data.map(item => ({
          timestamp: new Date(item[0]).getTime(),
          open: item[3],
          close: item[4],
          high: item[2],
          low: item[1],
        }));
        setChartData(formattedData);
        const latestData = formattedData[formattedData.length - 1];
        setCurrentPrice(latestData.close);
        setCurrentTime(new Date(latestData.timestamp).toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit', hour12: true,
        }));
      } else {
        console.error('Error: Data is not an array', data);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!chartData.length) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load chart data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Wallet')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={36} color="black" />
        </TouchableOpacity>
        <Image source={require('../../../assets/images/coin.png')} style={styles.logo} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>CAMT / KRW</Text>
          <Text style={styles.subTitle}>{currentPrice ? currentPrice.toLocaleString() : 'N/A'}</Text>
        </View>
        <Text style={styles.currentDataText}>REF Time: {currentTime || 'N/A'}</Text>
      </View>
      <View style={styles.chartContainer}>
        <CandlestickChart.Provider data={chartData}>
          <CandlestickChart height={Dimensions.get('window').height - 300} width={Dimensions.get('window').width}>
            <CandlestickChart.Candles positiveColor="green" negativeColor="red" />
            <CandlestickChart.Crosshair color="black">
              <CandlestickChart.Tooltip />
            </CandlestickChart.Crosshair>
          </CandlestickChart>
          <CandlestickChart.DatetimeText
            locale="en-US"
            options={{
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }}
          />
        </CandlestickChart.Provider>
      </View>
      <View style={styles.currentDataContainer}>
        <Text style={{ fontSize: 16 }}>The following are Gopax's price data, from one day ago until now, in 30-minute intervals.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 0.2,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
  },
  subTitle: {
    fontSize: 20,
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  currentDataContainer: {
    justifyContent: 'center',
    padding: 5,
    borderTopWidth: 0.2,
    flex: 0.1,
    alignItems: 'center',
  },
  currentDataText: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    fontSize: 13,
    color: 'gray',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  logo: {
    position: 'absolute',
    left: 85,
    width: 40,
    height: 40,
  },
  backButton: {
    position: 'absolute',
    left: 1,
    color: 'black',
  },
});

export default ChartScreen;
